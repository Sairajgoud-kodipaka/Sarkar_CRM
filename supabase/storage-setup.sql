-- Storage Buckets and Policies for Sarkar CRM
-- File management for products, customers, and store assets

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Product images bucket (public access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Customer documents bucket (private access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-documents',
  'customer-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Store assets bucket (public access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-assets',
  'store-assets',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Product Images Policies
CREATE POLICY "Public access to product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Store admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN')
  );

CREATE POLICY "Store admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN')
  );

-- Customer Documents Policies
CREATE POLICY "Users can view their store's customer documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can upload customer documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update customer documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete customer documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

-- Store Assets Policies
CREATE POLICY "Public access to store assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'store-assets');

CREATE POLICY "Store admins can upload store assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'store-assets' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN')
  );

CREATE POLICY "Store admins can update store assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'store-assets' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN')
  );

CREATE POLICY "Store admins can delete store assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'store-assets' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN')
  );

-- =============================================
-- STORAGE FUNCTIONS
-- =============================================

-- Function to get signed URL for private files
CREATE OR REPLACE FUNCTION get_signed_url(bucket_name TEXT, file_path TEXT, expires_in INTEGER DEFAULT 3600)
RETURNS TEXT AS $$
BEGIN
  RETURN storage.sign(
    bucket_name,
    file_path,
    expires_in,
    'GET'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upload file with proper folder structure
CREATE OR REPLACE FUNCTION upload_file(
  bucket_name TEXT,
  file_path TEXT,
  file_data BYTEA,
  content_type TEXT DEFAULT 'application/octet-stream'
)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner, data, metadata)
  VALUES (
    bucket_name,
    file_path,
    auth.uid(),
    file_data,
    jsonb_build_object('content-type', content_type)
  );
  
  RETURN file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE TRIGGERS
-- =============================================

-- Function to automatically create folder structure
CREATE OR REPLACE FUNCTION create_storage_folder()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure folder structure exists for store-based organization
  IF NEW.bucket_id = 'product-images' THEN
    -- Product images: store_id/product_id/filename
    NEW.name := (SELECT store_id::text FROM users WHERE id = auth.uid()) || '/' || NEW.name;
  ELSIF NEW.bucket_id = 'customer-documents' THEN
    -- Customer documents: store_id/customer_id/filename
    NEW.name := (SELECT store_id::text FROM users WHERE id = auth.uid()) || '/' || NEW.name;
  ELSIF NEW.bucket_id = 'store-assets' THEN
    -- Store assets: store_id/assets/filename
    NEW.name := (SELECT store_id::text FROM users WHERE id = auth.uid()) || '/assets/' || NEW.name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic folder structure
CREATE TRIGGER create_storage_folder_trigger
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION create_storage_folder(); 