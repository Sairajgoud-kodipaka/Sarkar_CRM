-- Add SALESPERSON role to user_role enum
-- This script adds the SALESPERSON role to the existing user_role enum

-- First, create a new enum type with the additional value
CREATE TYPE user_role_new AS ENUM ('BUSINESS_ADMIN', 'FLOOR_MANAGER', 'SALESPERSON');

-- Update the column to use the new enum type
ALTER TABLE users 
ALTER COLUMN role TYPE user_role_new 
USING role::text::user_role_new;

-- Drop the old enum type
DROP TYPE user_role;

-- Rename the new enum type to the original name
ALTER TYPE user_role_new RENAME TO user_role;

-- Add a comment to document the change
COMMENT ON TYPE user_role IS 'User roles in the CRM system: BUSINESS_ADMIN, FLOOR_MANAGER, SALESPERSON';

-- Verify the change
SELECT unnest(enum_range(NULL::user_role)) as available_roles; 