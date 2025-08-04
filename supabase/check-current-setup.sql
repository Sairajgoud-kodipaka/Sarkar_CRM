-- =============================================
-- CHECK CURRENT DATABASE SETUP
-- =============================================
-- This script will show you what's currently in your database

-- Check existing tables
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check existing enums
SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND t.typtype = 'e'
ORDER BY t.typname, e.enumsortorder;

-- Check existing functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Check existing views
SELECT 
  table_name,
  view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check existing indexes
SELECT 
  t.table_name,
  i.indexname,
  i.indexdef
FROM pg_indexes i
JOIN information_schema.tables t ON i.tablename = t.table_name
WHERE i.schemaname = 'public' AND t.table_schema = 'public'
ORDER BY t.table_name, i.indexname;

-- Check existing triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check storage buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Summary
SELECT 
  'Tables' as object_type,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
UNION ALL
SELECT 
  'Enums' as object_type,
  COUNT(DISTINCT t.typname) as count
FROM pg_type t
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND t.typtype = 'e'
UNION ALL
SELECT 
  'Functions' as object_type,
  COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public'
UNION ALL
SELECT 
  'Views' as object_type,
  COUNT(*) as count
FROM information_schema.views 
WHERE table_schema = 'public'
UNION ALL
SELECT 
  'Indexes' as object_type,
  COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Triggers' as object_type,
  COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_schema = 'public'; 