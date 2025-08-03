-- =============================================
-- SAMPLE DATA FOR SARKAR CRM
-- =============================================

-- Create a sample store
INSERT INTO public.stores (
  id, name, address, city, state, pincode, phone, email, website, description, logo, is_active
) VALUES (
  'store-001',
  'Sarkar Jewellers',
  '123 Main Street, Andheri West',
  'Mumbai',
  'Maharashtra',
  '400058',
  '+91-22-12345678',
  'info@sarkarjewellers.com',
  'https://sarkarjewellers.com',
  'Premium jewellery store specializing in gold, diamond, and platinum jewellery',
  'https://example.com/logo.png',
  true
);

-- Create sample floors
INSERT INTO public.floors (id, name, number, description, store_id, is_active) VALUES
('floor-001', 'Ground Floor - Gold Collection', 1, 'Premium gold jewellery collection', 'store-001', true),
('floor-002', 'First Floor - Diamond Collection', 2, 'Exclusive diamond jewellery', 'store-001', true),
('floor-003', 'Second Floor - Platinum Collection', 3, 'Luxury platinum jewellery', 'store-001', true);

-- Create sample categories
INSERT INTO public.categories (id, name, description, store_id, is_active) VALUES
('cat-001', 'Gold Jewellery', 'Traditional and modern gold jewellery', 'store-001', true),
('cat-002', 'Diamond Jewellery', 'Precious diamond jewellery', 'store-001', true),
('cat-003', 'Platinum Jewellery', 'Elegant platinum jewellery', 'store-001', true),
('cat-004', 'Silver Jewellery', 'Beautiful silver jewellery', 'store-001', true);

-- Create sub-categories
INSERT INTO public.categories (id, name, description, parent_id, store_id, is_active) VALUES
('cat-005', 'Gold Rings', 'Gold rings for all occasions', 'cat-001', 'store-001', true),
('cat-006', 'Gold Necklaces', 'Traditional gold necklaces', 'cat-001', 'store-001', true),
('cat-007', 'Diamond Rings', 'Engagement and wedding rings', 'cat-002', 'store-001', true),
('cat-008', 'Diamond Earrings', 'Elegant diamond earrings', 'cat-002', 'store-001', true);

-- Create sample users
INSERT INTO public.users (id, name, email, role, is_active, store_id, floor_id) VALUES
('user-001', 'Rajesh Kumar', 'rajesh@sarkarjewellers.com', 'BUSINESS_ADMIN', true, 'store-001', NULL),
('user-002', 'Priya Sharma', 'priya@sarkarjewellers.com', 'FLOOR_MANAGER', true, 'store-001', 'floor-001'),
('user-003', 'Amit Patel', 'amit@sarkarjewellers.com', 'FLOOR_MANAGER', true, 'store-001', 'floor-002'),
('user-004', 'Neha Singh', 'neha@sarkarjewellers.com', 'FLOOR_MANAGER', true, 'store-001', 'floor-003');

-- Create sample products
INSERT INTO public.products (id, name, sku, description, price, cost_price, weight, material, gemstone, purity, images, is_active, store_id, category_id) VALUES
('prod-001', '22K Gold Ring', 'GR001', 'Traditional 22K gold ring with intricate design', 45000.00, 42000.00, 8.5, 'Gold', NULL, '22K', ARRAY['https://example.com/gold-ring-1.jpg'], true, 'store-001', 'cat-005'),
('prod-002', 'Diamond Engagement Ring', 'DR001', '1 carat diamond engagement ring in white gold', 150000.00, 135000.00, 3.2, 'White Gold', 'Diamond', '18K', ARRAY['https://example.com/diamond-ring-1.jpg'], true, 'store-001', 'cat-007'),
('prod-003', 'Platinum Wedding Band', 'PW001', 'Elegant platinum wedding band', 75000.00, 68000.00, 4.8, 'Platinum', NULL, '950', ARRAY['https://example.com/platinum-band-1.jpg'], true, 'store-001', 'cat-003'),
('prod-004', 'Gold Necklace Set', 'GN001', 'Traditional gold necklace with matching earrings', 85000.00, 78000.00, 12.5, 'Gold', NULL, '22K', ARRAY['https://example.com/necklace-1.jpg', 'https://example.com/earrings-1.jpg'], true, 'store-001', 'cat-006'),
('prod-005', 'Diamond Stud Earrings', 'DE001', '0.5 carat diamond stud earrings', 65000.00, 58000.00, 2.1, 'White Gold', 'Diamond', '18K', ARRAY['https://example.com/diamond-earrings-1.jpg'], true, 'store-001', 'cat-008');

-- Create sample customers
INSERT INTO public.customers (id, name, email, phone, address, city, state, pincode, date_of_birth, gender, occupation, income_range, social_circle, occasions, budget_range, status, store_id, floor_id, assigned_to_id) VALUES
('cust-001', 'Rahul Mehta', 'rahul.mehta@email.com', '+91-9876543210', '456 Park Street, Bandra West', 'Mumbai', 'Maharashtra', '400050', '1985-03-15', 'MALE', 'Software Engineer', '500000-1000000', 'Tech professionals', ARRAY['Wedding', 'Anniversary'], '50000-100000', 'ACTIVE', 'store-001', 'floor-001', 'user-002'),
('cust-002', 'Anjali Desai', 'anjali.desai@email.com', '+91-9876543211', '789 Marine Drive, Colaba', 'Mumbai', 'Maharashtra', '400001', '1990-07-22', 'FEMALE', 'Marketing Manager', '300000-500000', 'Corporate professionals', ARRAY['Birthday', 'Engagement'], '30000-80000', 'ACTIVE', 'store-001', 'floor-002', 'user-003'),
('cust-003', 'Vikram Singh', 'vikram.singh@email.com', '+91-9876543212', '321 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '1988-11-08', 'MALE', 'Business Owner', '1000000+', 'Business community', ARRAY['Wedding', 'Business gift'], '100000-500000', 'ACTIVE', 'store-001', 'floor-003', 'user-004'),
('cust-004', 'Pooja Sharma', 'pooja.sharma@email.com', '+91-9876543213', '654 Juhu Tara Road, Juhu', 'Mumbai', 'Maharashtra', '400049', '1992-04-12', 'FEMALE', 'Doctor', '800000-1200000', 'Medical professionals', ARRAY['Anniversary', 'Graduation'], '50000-150000', 'PROSPECT', 'store-001', 'floor-001', 'user-002');

-- Create sample interactions
INSERT INTO public.interactions (id, type, description, outcome, next_action, customer_id, user_id) VALUES
('int-001', 'WALK_IN', 'Customer visited store to browse gold rings', 'Showed interest in 22K gold ring', 'Follow up with ring details and pricing', 'cust-001', 'user-002'),
('int-002', 'PHONE_CALL', 'Called customer about diamond ring collection', 'Customer interested in engagement ring', 'Schedule store visit for ring selection', 'cust-002', 'user-003'),
('int-003', 'EMAIL', 'Sent platinum collection catalog', 'Customer requested more information', 'Send detailed specifications and pricing', 'cust-003', 'user-004'),
('int-004', 'FOLLOW_UP', 'Followed up on gold necklace inquiry', 'Customer wants to see the necklace in person', 'Arrange store visit for necklace viewing', 'cust-004', 'user-002');

-- Create sample follow-ups
INSERT INTO public.follow_ups (id, scheduled_date, type, description, status, customer_id) VALUES
('fu-001', NOW() + INTERVAL '3 days', 'PHONE_CALL', 'Follow up on gold ring interest', 'PENDING', 'cust-001'),
('fu-002', NOW() + INTERVAL '1 week', 'VISIT', 'Store visit for diamond ring selection', 'PENDING', 'cust-002'),
('fu-003', NOW() + INTERVAL '2 days', 'EMAIL', 'Send platinum ring specifications', 'PENDING', 'cust-003'),
('fu-004', NOW() + INTERVAL '5 days', 'VISIT', 'Show gold necklace collection', 'PENDING', 'cust-004');

-- Create sample sales
INSERT INTO public.sales (id, amount, quantity, discount, total_amount, payment_method, status, store_id, floor_id, customer_id, product_id, user_id) VALUES
('sale-001', 45000.00, 1, 2000.00, 43000.00, 'CARD', 'COMPLETED', 'store-001', 'floor-001', 'cust-001', 'prod-001', 'user-002'),
('sale-002', 150000.00, 1, 5000.00, 145000.00, 'BANK_TRANSFER', 'COMPLETED', 'store-001', 'floor-002', 'cust-002', 'prod-002', 'user-003'),
('sale-003', 75000.00, 1, 3000.00, 72000.00, 'CASH', 'COMPLETED', 'store-001', 'floor-003', 'cust-003', 'prod-003', 'user-004');

-- Create sample customer product preferences
INSERT INTO public.customer_product_preferences (id, preference, notes, customer_id, product_id) VALUES
('pref-001', 'liked', 'Customer loved the design and weight', 'cust-001', 'prod-001'),
('pref-002', 'interested', 'Customer wants to see similar designs', 'cust-002', 'prod-002'),
('pref-003', 'liked', 'Customer appreciated the platinum quality', 'cust-003', 'prod-003'),
('pref-004', 'interested', 'Customer wants to see gold necklace options', 'cust-004', 'prod-004');

-- Create sample accounts (for NextAuth.js)
INSERT INTO public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES
('acc-001', 'user-001', 'oauth', 'google', 'google-123456', 'refresh-token-1', 'access-token-1', 1754064000, 'Bearer', 'openid email profile', 'id-token-1', 'session-1'),
('acc-002', 'user-002', 'oauth', 'google', 'google-123457', 'refresh-token-2', 'access-token-2', 1754064000, 'Bearer', 'openid email profile', 'id-token-2', 'session-2');

-- Create sample sessions (for NextAuth.js)
INSERT INTO public.sessions (id, session_token, user_id, expires) VALUES
('sess-001', 'session-token-1', 'user-001', NOW() + INTERVAL '7 days'),
('sess-002', 'session-token-2', 'user-002', NOW() + INTERVAL '7 days');

-- Create sample verification tokens (for NextAuth.js)
INSERT INTO public.verification_tokens (identifier, token, expires) VALUES
('rajesh@sarkarjewellers.com', 'verification-token-1', NOW() + INTERVAL '24 hours'),
('priya@sarkarjewellers.com', 'verification-token-2', NOW() + INTERVAL '24 hours'); 