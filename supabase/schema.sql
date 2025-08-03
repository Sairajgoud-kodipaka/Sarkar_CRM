-- Sarkar CRM Database Schema
-- Supabase Project: https://mdwpqkrbmjwmfqygxuag.supabase.co

-- =============================================
-- ENUMS AND TYPES
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM ('BUSINESS_ADMIN', 'FLOOR_MANAGER');

-- Gender types
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Customer status
CREATE TYPE customer_status AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'CONVERTED');

-- Interaction types
CREATE TYPE interaction_type AS ENUM ('WALK_IN', 'PHONE_CALL', 'EMAIL', 'FOLLOW_UP', 'SALE', 'COMPLAINT', 'INQUIRY');

-- Follow-up types
CREATE TYPE follow_up_type AS ENUM ('PHONE_CALL', 'EMAIL', 'SMS', 'VISIT', 'DEMO');

-- Follow-up status
CREATE TYPE follow_up_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- Sale status
CREATE TYPE sale_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- =============================================
-- CORE TABLES
-- =============================================

-- Stores table
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  website VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  password_hash VARCHAR(255),
  role user_role DEFAULT 'FLOOR_MANAGER',
  is_active BOOLEAN DEFAULT true,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Floors table
CREATE TABLE floors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  number INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, number)
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  weight DECIMAL(8,3), -- in grams
  material VARCHAR(100), -- gold, silver, platinum, etc.
  gemstone VARCHAR(100), -- diamond, ruby, emerald, etc.
  purity VARCHAR(20), -- 18K, 22K, etc.
  images TEXT[], -- Array of image URLs
  specifications JSONB, -- Additional specifications
  is_active BOOLEAN DEFAULT true,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  date_of_birth DATE,
  gender gender_type,
  occupation VARCHAR(100),
  income_range VARCHAR(50),
  social_circle TEXT, -- Community info
  occasions TEXT[], -- Special occasions they shop for
  budget_range VARCHAR(50), -- Budget range for purchases
  notes TEXT,
  status customer_status DEFAULT 'ACTIVE',
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions table
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type interaction_type NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  next_action TEXT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type follow_up_type NOT NULL,
  description TEXT NOT NULL,
  status follow_up_status DEFAULT 'PENDING',
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  discount DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  status sale_status DEFAULT 'COMPLETED',
  notes TEXT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer product preferences table
CREATE TABLE customer_product_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  preference VARCHAR(50) NOT NULL, -- liked, interested, not interested
  notes TEXT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- =============================================
-- AUTHENTICATION TABLES (NextAuth.js)
-- =============================================

-- Accounts table
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification tokens table
CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

-- =============================================
-- DATABASE INDEXES
-- =============================================

-- Performance indexes
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

-- =============================================
-- DATABASE FUNCTIONS
-- =============================================

-- Auto-generate SKU function
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

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dashboard metrics function
CREATE OR REPLACE FUNCTION get_dashboard_metrics(store_uuid UUID, date_from DATE, date_to DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_customers', (SELECT COUNT(*) FROM customers WHERE store_id = store_uuid),
    'total_sales', (SELECT COUNT(*) FROM sales WHERE store_id = store_uuid AND created_at::DATE BETWEEN date_from AND date_to),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE store_id = store_uuid AND created_at::DATE BETWEEN date_from AND date_to),
    'floor_metrics', (
      SELECT json_agg(
        json_build_object(
          'floor_id', f.id,
          'floor_name', f.name,
          'visitors', (SELECT COUNT(*) FROM customers WHERE floor_id = f.id),
          'sales', (SELECT COUNT(*) FROM sales WHERE floor_id = f.id AND created_at::DATE BETWEEN date_from AND date_to),
          'revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE floor_id = f.id AND created_at::DATE BETWEEN date_from AND date_to)
        )
      )
      FROM floors f
      WHERE f.store_id = store_uuid
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ANALYTICS VIEWS
-- =============================================

-- Sales analytics view
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

-- Customer analytics view
CREATE VIEW customer_analytics AS
SELECT 
  c.store_id,
  c.status,
  COUNT(*) as customer_count,
  COUNT(CASE WHEN c.created_at::DATE >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_customers_30d,
  COUNT(CASE WHEN EXISTS (SELECT 1 FROM sales s WHERE s.customer_id = c.id) THEN 1 END) as customers_with_sales
FROM customers c
GROUP BY c.store_id, c.status;

-- Product performance view
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