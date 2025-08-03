-- Row Level Security (RLS) Policies for Sarkar CRM
-- Multi-tenant isolation and role-based access control

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

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
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STORE POLICIES
-- =============================================

-- Users can view their own store
CREATE POLICY "Users can view their own store" ON stores
  FOR SELECT USING (id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Store admins can manage their store
CREATE POLICY "Store admins can manage their store" ON stores
  FOR ALL USING (id = (SELECT store_id FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN'));

-- =============================================
-- USER POLICIES
-- =============================================

-- Users can view store users
CREATE POLICY "Users can view store users" ON users
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Store admins can manage users
CREATE POLICY "Store admins can manage users" ON users
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN'));

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- =============================================
-- FLOOR POLICIES
-- =============================================

-- Users can view store floors
CREATE POLICY "Users can view store floors" ON floors
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Store admins can manage floors
CREATE POLICY "Store admins can manage floors" ON floors
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN'));

-- =============================================
-- CATEGORY POLICIES
-- =============================================

-- Users can view store categories
CREATE POLICY "Users can view store categories" ON categories
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Store admins can manage categories
CREATE POLICY "Store admins can manage categories" ON categories
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN'));

-- =============================================
-- PRODUCT POLICIES
-- =============================================

-- Users can view store products
CREATE POLICY "Users can view store products" ON products
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Store admins can manage products
CREATE POLICY "Store admins can manage products" ON products
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid() AND role = 'BUSINESS_ADMIN'));

-- =============================================
-- CUSTOMER POLICIES
-- =============================================

-- Users can view store customers
CREATE POLICY "Users can view store customers" ON customers
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Users can manage customers
CREATE POLICY "Users can manage customers" ON customers
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- =============================================
-- INTERACTION POLICIES
-- =============================================

-- Users can view store interactions
CREATE POLICY "Users can view store interactions" ON interactions
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- Users can manage interactions
CREATE POLICY "Users can manage interactions" ON interactions
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- =============================================
-- FOLLOW-UP POLICIES
-- =============================================

-- Users can view store follow-ups
CREATE POLICY "Users can view store follow-ups" ON follow_ups
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- Users can manage follow-ups
CREATE POLICY "Users can manage follow-ups" ON follow_ups
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- =============================================
-- SALE POLICIES
-- =============================================

-- Users can view store sales
CREATE POLICY "Users can view store sales" ON sales
  FOR SELECT USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- Users can manage sales
CREATE POLICY "Users can manage sales" ON sales
  FOR ALL USING (store_id = (SELECT store_id FROM users WHERE id = auth.uid()));

-- =============================================
-- CUSTOMER PRODUCT PREFERENCE POLICIES
-- =============================================

-- Users can view store preferences
CREATE POLICY "Users can view store preferences" ON customer_product_preferences
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- Users can manage preferences
CREATE POLICY "Users can manage preferences" ON customer_product_preferences
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE store_id = (SELECT store_id FROM users WHERE id = auth.uid())));

-- =============================================
-- AUTHENTICATION TABLE POLICIES
-- =============================================

-- Users can view their own accounts
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (user_id = auth.uid());

-- Users can manage their own accounts
CREATE POLICY "Users can manage own accounts" ON accounts
  FOR ALL USING (user_id = auth.uid());

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (user_id = auth.uid());

-- Users can manage their own sessions
CREATE POLICY "Users can manage own sessions" ON sessions
  FOR ALL USING (user_id = auth.uid());

-- Verification tokens are public (for email verification)
CREATE POLICY "Verification tokens are public" ON verification_tokens
  FOR ALL USING (true); 