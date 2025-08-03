-- =============================================
-- CHECK CURRENT SARKAR CRM SETUP
-- =============================================

-- Check existing ENUM types
SELECT typname, typtype 
FROM pg_type 
WHERE typname IN ('user_role', 'gender_type', 'customer_status', 'interaction_type', 'follow_up_type', 'follow_up_status', 'sale_status');

-- Check existing tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('stores', 'users', 'floors', 'categories', 'products', 'customers', 'interactions', 'follow_ups', 'sales', 'customer_product_preferences')
ORDER BY table_name;

-- Check existing indexes
SELECT 
    t.table_name,
    i.indexname,
    i.indexdef
FROM pg_indexes i
JOIN information_schema.tables t ON i.tablename = t.table_name
WHERE t.table_schema = 'public'
AND t.table_name IN ('stores', 'users', 'floors', 'categories', 'products', 'customers', 'interactions', 'follow_ups', 'sales', 'customer_product_preferences')
ORDER BY t.table_name, i.indexname;

-- Check existing views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name IN ('sales_analytics', 'customer_analytics', 'product_performance');

-- Check existing functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('generate_sku', 'update_updated_at_column', 'notify_sales_update', 'notify_customer_update');

-- Check existing triggers
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('stores', 'users', 'floors', 'categories', 'products', 'customers', 'interactions', 'follow_ups', 'sales');

-- Check storage buckets
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('product-images', 'customer-documents', 'store-assets');

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('stores', 'users', 'floors', 'categories', 'products', 'customers', 'interactions', 'follow_ups', 'sales', 'customer_product_preferences');

-- Check real-time publications
SELECT 
    pubname,
    puballtables
FROM pg_publication 
WHERE pubname = 'supabase_realtime'; 