-- =============================================
-- ADD MISSING FOREIGN KEY RELATIONSHIPS
-- =============================================
-- This script adds missing foreign key constraints to existing tables

-- Add foreign key constraints for categories table
ALTER TABLE categories 
ADD CONSTRAINT fk_categories_parent_id 
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

ALTER TABLE categories 
ADD CONSTRAINT fk_categories_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

-- Add foreign key constraints for customers table
ALTER TABLE customers 
ADD CONSTRAINT fk_customers_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE customers 
ADD CONSTRAINT fk_customers_floor_id 
FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE SET NULL;

ALTER TABLE customers 
ADD CONSTRAINT fk_customers_assigned_to_id 
FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add foreign key constraints for floors table
ALTER TABLE floors 
ADD CONSTRAINT fk_floors_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

-- Add foreign key constraints for follow_ups table
ALTER TABLE follow_ups 
ADD CONSTRAINT fk_follow_ups_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Add foreign key constraints for interactions table
ALTER TABLE interactions 
ADD CONSTRAINT fk_interactions_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE interactions 
ADD CONSTRAINT fk_interactions_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add foreign key constraints for products table
ALTER TABLE products 
ADD CONSTRAINT fk_products_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT fk_products_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- Add foreign key constraints for sales table
ALTER TABLE sales 
ADD CONSTRAINT fk_sales_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE sales 
ADD CONSTRAINT fk_sales_floor_id 
FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE;

ALTER TABLE sales 
ADD CONSTRAINT fk_sales_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE sales 
ADD CONSTRAINT fk_sales_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE sales 
ADD CONSTRAINT fk_sales_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add foreign key constraints for users table
ALTER TABLE users 
ADD CONSTRAINT fk_users_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;

ALTER TABLE users 
ADD CONSTRAINT fk_users_floor_id 
FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE SET NULL;

-- Add foreign key constraints for customer_product_preferences table
ALTER TABLE customer_product_preferences 
ADD CONSTRAINT fk_customer_product_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE customer_product_preferences 
ADD CONSTRAINT fk_customer_product_preferences_product_id 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Verification
SELECT 'Foreign key relationships added successfully!' as status;
SELECT COUNT(*) as total_foreign_keys FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'; 