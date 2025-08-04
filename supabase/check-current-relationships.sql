-- =============================================
-- CHECK CURRENT FOREIGN KEY RELATIONSHIPS
-- =============================================
-- This script shows what foreign key constraints currently exist

-- Check existing foreign key constraints
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- Count total foreign key constraints
SELECT COUNT(*) as total_foreign_keys 
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
  AND table_schema = 'public';

-- Check which tables have foreign key fields but no constraints
SELECT 
  t.table_name,
  c.column_name,
  c.data_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
  AND c.column_name LIKE '%_id'
  AND c.column_name != 'id'
  AND c.table_name NOT IN (
    SELECT DISTINCT tc.table_name 
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.column_name = c.column_name
  )
ORDER BY t.table_name, c.column_name; 