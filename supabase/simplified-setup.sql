-- =============================================
-- SIMPLIFIED SARKAR CRM SETUP (DATABASE ONLY)
-- =============================================

-- STEP 1: ADD MISSING INDEXES (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_users_store_id ON users(store_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_floors_store_id ON floors(store_id);
CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to_id ON customers(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_customer_id ON follow_ups(customer_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sales_store_id ON sales(store_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_product_preferences_customer_id ON customer_product_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_product_preferences_product_id ON customer_product_preferences(product_id);

-- STEP 2: CREATE DATABASE FUNCTIONS
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

-- STEP 3: CREATE TRIGGERS FOR AUTO UPDATES
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
DROP TRIGGER IF EXISTS update_floors_updated_at ON floors;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_interactions_updated_at ON interactions;
DROP TRIGGER IF EXISTS update_follow_ups_updated_at ON follow_ups;
DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 4: CREATE ANALYTICS VIEWS
DROP VIEW IF EXISTS sales_analytics;
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

DROP VIEW IF EXISTS customer_analytics;
CREATE VIEW customer_analytics AS
SELECT 
  c.store_id,
  c.status,
  COUNT(*) as customer_count,
  COUNT(CASE WHEN c.created_at::DATE >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_customers_30d,
  COUNT(CASE WHEN EXISTS (SELECT 1 FROM sales s WHERE s.customer_id = c.id) THEN 1 END) as customers_with_sales
FROM customers c
GROUP BY c.store_id, c.status;

DROP VIEW IF EXISTS product_performance;
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

-- STEP 5: ENABLE ROW LEVEL SECURITY
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

-- STEP 6: ENABLE REAL-TIME FOR ALL TABLES (HANDLE EXISTING)
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT unnest(ARRAY['stores', 'users', 'floors', 'categories', 'products', 'customers', 'interactions', 'follow_ups', 'sales', 'customer_product_preferences'])
    LOOP
        BEGIN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', table_name);
        EXCEPTION
            WHEN duplicate_object THEN
                -- Table already in publication, skip
                NULL;
        END;
    END LOOP;
END $$;

-- STEP 7: CREATE REAL-TIME FUNCTIONS
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

-- STEP 8: CREATE REAL-TIME TRIGGERS
DROP TRIGGER IF EXISTS sales_realtime_trigger ON sales;
DROP TRIGGER IF EXISTS customer_realtime_trigger ON customers;

CREATE TRIGGER sales_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON sales
  FOR EACH ROW EXECUTE FUNCTION notify_sales_update();

CREATE TRIGGER customer_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION notify_customer_update();

-- STEP 9: VERIFICATION QUERY
SELECT 'Database Setup Complete!' as status; 