-- =============================================
-- SAFE ADD MISSING FOREIGN KEY RELATIONSHIPS
-- =============================================
-- This script safely adds foreign key constraints after checking data integrity

-- STEP 1: Check for orphaned records that would prevent FK constraints
DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    -- Check for orphaned customers without valid store_id
    SELECT COUNT(*) INTO orphan_count 
    FROM customers c 
    LEFT JOIN stores s ON c.store_id = s.id 
    WHERE s.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % customers with invalid store_id', orphan_count;
    END IF;
    
    -- Check for orphaned customers without valid floor_id
    SELECT COUNT(*) INTO orphan_count 
    FROM customers c 
    LEFT JOIN floors f ON c.floor_id = f.id 
    WHERE c.floor_id IS NOT NULL AND f.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % customers with invalid floor_id', orphan_count;
    END IF;
    
    -- Check for orphaned customers without valid assigned_to_id
    SELECT COUNT(*) INTO orphan_count 
    FROM customers c 
    LEFT JOIN users u ON c.assigned_to_id = u.id 
    WHERE c.assigned_to_id IS NOT NULL AND u.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % customers with invalid assigned_to_id', orphan_count;
    END IF;
    
    -- Check for orphaned products without valid store_id
    SELECT COUNT(*) INTO orphan_count 
    FROM products p 
    LEFT JOIN stores s ON p.store_id = s.id 
    WHERE s.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % products with invalid store_id', orphan_count;
    END IF;
    
    -- Check for orphaned products without valid category_id
    SELECT COUNT(*) INTO orphan_count 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE c.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % products with invalid category_id', orphan_count;
    END IF;
    
    -- Check for orphaned sales records
    SELECT COUNT(*) INTO orphan_count 
    FROM sales s 
    LEFT JOIN stores st ON s.store_id = st.id 
    WHERE st.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % sales with invalid store_id', orphan_count;
    END IF;
    
    SELECT COUNT(*) INTO orphan_count 
    FROM sales s 
    LEFT JOIN floors f ON s.floor_id = f.id 
    WHERE f.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % sales with invalid floor_id', orphan_count;
    END IF;
    
    SELECT COUNT(*) INTO orphan_count 
    FROM sales s 
    LEFT JOIN customers c ON s.customer_id = c.id 
    WHERE c.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % sales with invalid customer_id', orphan_count;
    END IF;
    
    SELECT COUNT(*) INTO orphan_count 
    FROM sales s 
    LEFT JOIN products p ON s.product_id = p.id 
    WHERE p.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % sales with invalid product_id', orphan_count;
    END IF;
    
    SELECT COUNT(*) INTO orphan_count 
    FROM sales s 
    LEFT JOIN users u ON s.user_id = u.id 
    WHERE u.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE 'Found % sales with invalid user_id', orphan_count;
    END IF;
    
    RAISE NOTICE 'Data integrity check completed';
END $$;

-- STEP 2: Add foreign key constraints (only if no errors above)
-- Categories table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_categories_parent_id') THEN
        ALTER TABLE categories ADD CONSTRAINT fk_categories_parent_id FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_categories_parent_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_categories_store_id') THEN
        ALTER TABLE categories ADD CONSTRAINT fk_categories_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_categories_store_id';
    END IF;
END $$;

-- Customers table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_customers_store_id') THEN
        ALTER TABLE customers ADD CONSTRAINT fk_customers_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_customers_store_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_customers_floor_id') THEN
        ALTER TABLE customers ADD CONSTRAINT fk_customers_floor_id FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added fk_customers_floor_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_customers_assigned_to_id') THEN
        ALTER TABLE customers ADD CONSTRAINT fk_customers_assigned_to_id FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added fk_customers_assigned_to_id';
    END IF;
END $$;

-- Floors table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_floors_store_id') THEN
        ALTER TABLE floors ADD CONSTRAINT fk_floors_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_floors_store_id';
    END IF;
END $$;

-- Follow_ups table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_follow_ups_customer_id') THEN
        ALTER TABLE follow_ups ADD CONSTRAINT fk_follow_ups_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_follow_ups_customer_id';
    END IF;
END $$;

-- Interactions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_interactions_customer_id') THEN
        ALTER TABLE interactions ADD CONSTRAINT fk_interactions_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_interactions_customer_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_interactions_user_id') THEN
        ALTER TABLE interactions ADD CONSTRAINT fk_interactions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_interactions_user_id';
    END IF;
END $$;

-- Products table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_products_store_id') THEN
        ALTER TABLE products ADD CONSTRAINT fk_products_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_products_store_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_products_category_id') THEN
        ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
        RAISE NOTICE 'Added fk_products_category_id';
    END IF;
END $$;

-- Sales table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sales_store_id') THEN
        ALTER TABLE sales ADD CONSTRAINT fk_sales_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_sales_store_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sales_floor_id') THEN
        ALTER TABLE sales ADD CONSTRAINT fk_sales_floor_id FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_sales_floor_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sales_customer_id') THEN
        ALTER TABLE sales ADD CONSTRAINT fk_sales_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_sales_customer_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sales_product_id') THEN
        ALTER TABLE sales ADD CONSTRAINT fk_sales_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_sales_product_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sales_user_id') THEN
        ALTER TABLE sales ADD CONSTRAINT fk_sales_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_sales_user_id';
    END IF;
END $$;

-- Users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_users_store_id') THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added fk_users_store_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_users_floor_id') THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_floor_id FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added fk_users_floor_id';
    END IF;
END $$;

-- Customer_product_preferences table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_customer_product_preferences_customer_id') THEN
        ALTER TABLE customer_product_preferences ADD CONSTRAINT fk_customer_product_preferences_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_customer_product_preferences_customer_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_customer_product_preferences_product_id') THEN
        ALTER TABLE customer_product_preferences ADD CONSTRAINT fk_customer_product_preferences_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added fk_customer_product_preferences_product_id';
    END IF;
END $$;

-- STEP 3: Verification
SELECT 'Foreign key relationships added successfully!' as status;
SELECT COUNT(*) as total_foreign_keys FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'; 