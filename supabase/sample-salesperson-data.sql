-- Sample Salesperson Data
-- This script adds sample salesperson users to the database

-- Insert sample salesperson users
INSERT INTO users (
  id,
  name,
  email,
  password,
  role,
  is_active,
  store_id,
  floor_id,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Sarah Johnson',
  'sarah.johnson@sarkarcrm.com',
  '$2a$10$example_hashed_password', -- This should be properly hashed in production
  'SALESPERSON',
  true,
  (SELECT id FROM stores LIMIT 1), -- Assign to first store
  (SELECT id FROM floors WHERE name = 'Floor 2' LIMIT 1), -- Assign to Floor 2
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Michael Chen',
  'michael.chen@sarkarcrm.com',
  '$2a$10$example_hashed_password', -- This should be properly hashed in production
  'SALESPERSON',
  true,
  (SELECT id FROM stores LIMIT 1), -- Assign to first store
  (SELECT id FROM floors WHERE name = 'Floor 1' LIMIT 1), -- Assign to Floor 1
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Emma Wilson',
  'emma.wilson@sarkarcrm.com',
  '$2a$10$example_hashed_password', -- This should be properly hashed in production
  'SALESPERSON',
  true,
  (SELECT id FROM stores LIMIT 1), -- Assign to first store
  (SELECT id FROM floors WHERE name = 'Floor 3' LIMIT 1), -- Assign to Floor 3
  NOW(),
  NOW()
);

-- Verify the salesperson users were created
SELECT 
  id,
  name,
  email,
  role,
  is_active,
  floor_id,
  created_at
FROM users 
WHERE role = 'SALESPERSON'
ORDER BY created_at DESC; 