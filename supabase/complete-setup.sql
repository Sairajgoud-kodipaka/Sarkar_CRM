-- =============================================
-- COMPLETE SARKAR CRM DATABASE SETUP
-- =============================================

-- STEP 1: CREATE ENUMS AND TYPES
CREATE TYPE user_role AS ENUM ('BUSINESS_ADMIN', 'FLOOR_MANAGER');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE customer_status AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'CONVERTED');
CREATE TYPE interaction_type AS ENUM ('WALK_IN', 'PHONE_CALL', 'EMAIL', 'FOLLOW_UP', 'SALE', 'COMPLAINT', 'INQUIRY');
CREATE TYPE follow_up_type AS ENUM ('PHONE_CALL', 'EMAIL', 'SMS', 'VISIT', 'DEMO');
CREATE TYPE follow_up_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE sale_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- Additional enums for approval and escalation workflows
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED', 'CANCELLED');
CREATE TYPE approval_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE escalation_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE escalation_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- STEP 2: CREATE CORE TABLES
CREATE TABLE stores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  address text NOT NULL,
  city character varying(100) NOT NULL,
  state character varying(100) NOT NULL,
  pincode character varying(10) NOT NULL,
  phone character varying(20) NOT NULL,
  email character varying(255) NOT NULL UNIQUE,
  website character varying(255),
  description text,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT stores_pkey PRIMARY KEY (id)
);

CREATE TABLE users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255),
  email character varying(255) NOT NULL UNIQUE,
  email_verified_at timestamp with time zone,
  image_url text,
  password_hash character varying(255),
  role user_role DEFAULT 'FLOOR_MANAGER',
  is_active boolean DEFAULT true,
  store_id uuid REFERENCES stores(id) ON DELETE SET NULL,
  floor_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE floors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(100) NOT NULL,
  number integer NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT floors_pkey PRIMARY KEY (id),
  CONSTRAINT floors_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE(store_id, number)
);

-- Add foreign key constraint for users table
ALTER TABLE users ADD CONSTRAINT fk_users_floor_id FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT users_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;

CREATE TABLE categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(100) NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  sku character varying(100) NOT NULL UNIQUE,
  description text,
  price numeric(10,2) NOT NULL,
  cost_price numeric(10,2),
  weight numeric(8,3),
  material character varying(100),
  gemstone character varying(100),
  purity character varying(20),
  images text[],
  specifications jsonb,
  is_active boolean DEFAULT true,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  email character varying(255),
  phone character varying(20) NOT NULL,
  address text,
  city character varying(100),
  state character varying(100),
  pincode character varying(10),
  date_of_birth date,
  gender gender_type,
  occupation character varying(100),
  income_range character varying(50),
  social_circle text,
  occasions text[],
  budget_range character varying(50),
  notes text,
  status customer_status DEFAULT 'ACTIVE',
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  floor_id uuid REFERENCES floors(id) ON DELETE SET NULL,
  assigned_to_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES floors(id),
  CONSTRAINT customers_assigned_to_id_fkey FOREIGN KEY (assigned_to_id) REFERENCES users(id),
  CONSTRAINT customers_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type interaction_type NOT NULL,
  description text NOT NULL,
  outcome text,
  next_action text,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT interactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE follow_ups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  scheduled_date timestamp with time zone NOT NULL,
  type follow_up_type NOT NULL,
  description text NOT NULL,
  status follow_up_status DEFAULT 'PENDING',
  completed_at timestamp with time zone,
  notes text,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT follow_ups_pkey PRIMARY KEY (id),
  CONSTRAINT follow_ups_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE sales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  amount numeric(10,2) NOT NULL,
  quantity integer DEFAULT 1,
  discount numeric(10,2),
  total_amount numeric(10,2) NOT NULL,
  payment_method character varying(50),
  status sale_status DEFAULT 'COMPLETED',
  notes text,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  floor_id uuid NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_pkey PRIMARY KEY (id),
  CONSTRAINT sales_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES floors(id),
  CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT sales_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customer_product_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preference character varying(50) NOT NULL,
  notes text,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_product_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT customer_product_preferences_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT customer_product_preferences_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id),
  UNIQUE(customer_id, product_id)
);

-- Additional tables for approval and escalation workflows
CREATE TABLE approval_workflows (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "actionType" character varying(50) NOT NULL,
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status approval_status DEFAULT 'PENDING',
  "requestData" jsonb NOT NULL,
  approval_notes text,
  priority approval_priority DEFAULT 'MEDIUM',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  approved_at timestamp with time zone,
  CONSTRAINT approval_workflows_pkey PRIMARY KEY (id),
  CONSTRAINT approval_workflows_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES users(id),
  CONSTRAINT approval_workflows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action character varying(100) NOT NULL,
  entity_type character varying(50) NOT NULL,
  entity_id uuid NOT NULL,
  "oldData" jsonb,
  "newData" jsonb,
  ip_address character varying(45),
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE escalations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  description text NOT NULL,
  priority escalation_priority DEFAULT 'MEDIUM',
  status escalation_status DEFAULT 'OPEN',
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  CONSTRAINT escalations_pkey PRIMARY KEY (id),
  CONSTRAINT escalations_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES users(id),
  CONSTRAINT escalations_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- STEP 3: CREATE PERFORMANCE INDEXES
CREATE INDEX idx_users_store_id ON users(store_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_floors_store_id ON floors(store_id);
CREATE INDEX idx_categories_store_id ON categories(store_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_assigned_to_id ON customers(assigned_to_id);
CREATE INDEX idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_follow_ups_customer_id ON follow_ups(customer_id);
CREATE INDEX idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX idx_sales_store_id ON sales(store_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_customer_product_preferences_customer_id ON customer_product_preferences(customer_id);
CREATE INDEX idx_customer_product_preferences_product_id ON customer_product_preferences(product_id);

-- Indexes for approval and escalation workflows
CREATE INDEX idx_approval_workflows_requester_id ON approval_workflows(requester_id);
CREATE INDEX idx_approval_workflows_approver_id ON approval_workflows(approver_id);
CREATE INDEX idx_approval_workflows_status ON approval_workflows(status);
CREATE INDEX idx_approval_workflows_action_type ON approval_workflows("actionType");

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_escalations_requester_id ON escalations(requester_id);
CREATE INDEX idx_escalations_assignee_id ON escalations(assignee_id);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);

-- STEP 4: CREATE DATABASE FUNCTIONS
CREATE OR REPLACE FUNCTION generate_sku(category_name TEXT, product_id UUID)
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  category_code TEXT;
  id_part TEXT;
BEGIN
  timestamp_part := to_char(EXTRACT(EPOCH FROM NOW())::BIGINT, 'FM000000');
  category_code := UPPER(LEFT(category_name, 3));
  id_part := RIGHT(product_id::TEXT, 4);
  
  RETURN category_code || timestamp_part || id_part;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 5: CREATE TRIGGERS
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_workflows_updated_at BEFORE UPDATE ON approval_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 6: CREATE ANALYTICS VIEWS
CREATE VIEW sales_analytics AS
SELECT 
  s.store_id,
  s.floor_id,
  f.name as floor_name,
  DATE(s.created_at) as sale_date,
  COUNT(*) as total_sales,
  SUM(s.total_amount) as total_revenue,
  AVG(s.total_amount) as average_sale,
  COUNT(DISTINCT s.customer_id) as unique_customers
FROM sales s
JOIN floors f ON s.floor_id = f.id
GROUP BY s.store_id, s.floor_id, f.name, DATE(s.created_at);

CREATE VIEW customer_analytics AS
SELECT 
  c.store_id,
  c.status,
  COUNT(*) as customer_count,
  COUNT(CASE WHEN c.created_at::DATE >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_customers_30d,
  COUNT(CASE WHEN EXISTS (SELECT 1 FROM sales s WHERE s.customer_id = c.id) THEN 1 END) as customers_with_sales
FROM customers c
GROUP BY c.store_id, c.status;

CREATE VIEW product_performance AS
SELECT 
  p.store_id,
  p.id as product_id,
  p.name as product_name,
  p.sku,
  c.name as category_name,
  COUNT(s.id) as total_sales,
  SUM(s.total_amount) as total_revenue,
  AVG(s.total_amount) as average_price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.store_id, p.id, p.name, p.sku, c.name;

-- STEP 7: ENABLE ROW LEVEL SECURITY
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_product_preferences ENABLE ROW LEVEL SECURITY;

-- STEP 8: CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-documents',
  'customer-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-assets',
  'store-assets',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- STEP 9: ENABLE REAL-TIME FOR ALL TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE stores;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE floors;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;
ALTER PUBLICATION supabase_realtime ADD TABLE interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE follow_ups;
ALTER PUBLICATION supabase_realtime ADD TABLE sales;
ALTER PUBLICATION supabase_realtime ADD TABLE customer_product_preferences;

-- STEP 10: CREATE STORAGE POLICIES
CREATE POLICY "Public access to product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their store's customer documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = (SELECT store_id::text FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Public access to store assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'store-assets');

-- STEP 11: CREATE REAL-TIME FUNCTIONS
CREATE OR REPLACE FUNCTION notify_sales_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'sales_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'type', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_customer_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'customer_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'type', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 12: CREATE REAL-TIME TRIGGERS
CREATE TRIGGER sales_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON sales
  FOR EACH ROW EXECUTE FUNCTION notify_sales_update();

CREATE TRIGGER customer_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION notify_customer_update(); 