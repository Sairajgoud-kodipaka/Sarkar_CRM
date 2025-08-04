-- Complete SQL Schema matching Prisma Schema
-- Generated for Sarkar CRM System

-- Create custom enums
CREATE TYPE "gender_type" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "customer_status" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'CONVERTED');
CREATE TYPE "follow_up_type" AS ENUM ('PHONE_CALL', 'EMAIL', 'SMS', 'VISIT', 'DEMO');
CREATE TYPE "follow_up_status" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE "interaction_type" AS ENUM ('WALK_IN', 'PHONE_CALL', 'EMAIL', 'FOLLOW_UP', 'SALE', 'COMPLAINT', 'INQUIRY');
CREATE TYPE "sale_status" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "user_role" AS ENUM ('BUSINESS_ADMIN', 'FLOOR_MANAGER');
CREATE TYPE "approval_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED', 'CANCELLED');
CREATE TYPE "approval_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "escalation_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "escalation_status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- Create stores table
CREATE TABLE "stores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255),
    "description" TEXT,
    "logo" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for stores email
CREATE UNIQUE INDEX "stores_email_key" ON "stores"("email");

-- Create users table
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMPTZ(6),
    "image" TEXT,
    "password" VARCHAR(255),
    "role" "user_role" DEFAULT 'FLOOR_MANAGER',
    "is_active" BOOLEAN DEFAULT true,
    "store_id" UUID,
    "floor_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for users email
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Create indexes for users
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_store_id" ON "users"("store_id");

-- Create floors table
CREATE TABLE "floors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "number" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "store_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for floors
CREATE UNIQUE INDEX "floors_store_id_number_key" ON "floors"("store_id", "number");

-- Create index for floors
CREATE INDEX "idx_floors_store_id" ON "floors"("store_id");

-- Create categories table
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "store_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create indexes for categories
CREATE INDEX "idx_categories_parent_id" ON "categories"("parent_id");
CREATE INDEX "idx_categories_store_id" ON "categories"("store_id");

-- Create customers table
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20) NOT NULL,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "date_of_birth" DATE,
    "gender" "gender_type",
    "occupation" VARCHAR(100),
    "income_range" VARCHAR(50),
    "social_circle" TEXT,
    "occasions" TEXT[],
    "budget_range" VARCHAR(50),
    "notes" TEXT,
    "status" "customer_status" DEFAULT 'ACTIVE',
    "store_id" UUID NOT NULL,
    "floor_id" UUID,
    "assigned_to_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- Create indexes for customers
CREATE INDEX "idx_customers_assigned_to_id" ON "customers"("assigned_to_id");
CREATE INDEX "idx_customers_email" ON "customers"("email");
CREATE INDEX "idx_customers_phone" ON "customers"("phone");
CREATE INDEX "idx_customers_store_id" ON "customers"("store_id");

-- Create products table
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "cost_price" DECIMAL(10,2),
    "weight" DECIMAL(8,3),
    "material" VARCHAR(100),
    "gemstone" VARCHAR(100),
    "purity" VARCHAR(20),
    "images" TEXT[],
    "specifications" JSONB,
    "is_active" BOOLEAN DEFAULT true,
    "store_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for products sku
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- Create indexes for products
CREATE INDEX "idx_products_category_id" ON "products"("category_id");
CREATE INDEX "idx_products_sku" ON "products"("sku");
CREATE INDEX "idx_products_store_id" ON "products"("store_id");

-- Create customer_product_preferences table
CREATE TABLE "customer_product_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "preference" VARCHAR(50) NOT NULL,
    "notes" TEXT,
    "customer_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "customer_product_preferences_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints for customer_product_preferences
CREATE UNIQUE INDEX "customer_product_preferences_customer_id_product_id_key" ON "customer_product_preferences"("customer_id", "product_id");
CREATE UNIQUE INDEX "customer_product_preferences_customer_product_unique" ON "customer_product_preferences"("customer_id", "product_id");

-- Create indexes for customer_product_preferences
CREATE INDEX "idx_customer_product_preferences_customer_id" ON "customer_product_preferences"("customer_id");
CREATE INDEX "idx_customer_product_preferences_product_id" ON "customer_product_preferences"("product_id");

-- Create follow_ups table
CREATE TABLE "follow_ups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scheduled_date" TIMESTAMPTZ(6) NOT NULL,
    "type" "follow_up_type" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "follow_up_status" DEFAULT 'PENDING',
    "completed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "customer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "follow_ups_pkey" PRIMARY KEY ("id")
);

-- Create indexes for follow_ups
CREATE INDEX "idx_follow_ups_customer_id" ON "follow_ups"("customer_id");
CREATE INDEX "idx_follow_ups_scheduled_date" ON "follow_ups"("scheduled_date");

-- Create interactions table
CREATE TABLE "interactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "interaction_type" NOT NULL,
    "description" TEXT NOT NULL,
    "outcome" TEXT,
    "next_action" TEXT,
    "customer_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- Create indexes for interactions
CREATE INDEX "idx_interactions_customer_id" ON "interactions"("customer_id");
CREATE INDEX "idx_interactions_user_id" ON "interactions"("user_id");

-- Create sales table
CREATE TABLE "sales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER DEFAULT 1,
    "discount" DECIMAL(10,2),
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50),
    "status" "sale_status" DEFAULT 'COMPLETED',
    "notes" TEXT,
    "store_id" UUID NOT NULL,
    "floor_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- Create indexes for sales
CREATE INDEX "idx_sales_created_at" ON "sales"("created_at");
CREATE INDEX "idx_sales_customer_id" ON "sales"("customer_id");
CREATE INDEX "idx_sales_store_id" ON "sales"("store_id");

-- Create sessions table
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for sessions
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- Create verification_tokens table
CREATE TABLE "verification_tokens" (
    "identifier" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
);

-- Create unique constraint for verification_tokens
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- Create approval_workflows table
CREATE TABLE "approval_workflows" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actionType" VARCHAR(50) NOT NULL,
    "requester_id" UUID NOT NULL,
    "approver_id" UUID,
    "status" "approval_status" DEFAULT 'PENDING',
    "requestData" JSONB NOT NULL,
    "approval_notes" TEXT,
    "priority" "approval_priority" DEFAULT 'MEDIUM',
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    "approved_at" TIMESTAMPTZ(6),
    CONSTRAINT "approval_workflows_pkey" PRIMARY KEY ("id")
);

-- Create indexes for approval_workflows
CREATE INDEX "idx_approval_workflows_requester_id" ON "approval_workflows"("requester_id");
CREATE INDEX "idx_approval_workflows_approver_id" ON "approval_workflows"("approver_id");
CREATE INDEX "idx_approval_workflows_status" ON "approval_workflows"("status");
CREATE INDEX "idx_approval_workflows_action_type" ON "approval_workflows"("actionType");

-- Create audit_logs table
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Create indexes for audit_logs
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs"("created_at");

-- Create escalations table
CREATE TABLE "escalations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "escalation_priority" DEFAULT 'MEDIUM',
    "status" "escalation_status" DEFAULT 'OPEN',
    "requester_id" UUID NOT NULL,
    "assignee_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT now(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
    "resolved_at" TIMESTAMPTZ(6),
    CONSTRAINT "escalations_pkey" PRIMARY KEY ("id")
);

-- Create indexes for escalations
CREATE INDEX "idx_escalations_requester_id" ON "escalations"("requester_id");
CREATE INDEX "idx_escalations_assignee_id" ON "escalations"("assignee_id");
CREATE INDEX "idx_escalations_status" ON "escalations"("status");
CREATE INDEX "idx_escalations_priority" ON "escalations"("priority");

-- Add foreign key constraints

-- Users foreign keys
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Floors foreign key
ALTER TABLE "floors" ADD CONSTRAINT "floors_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Categories foreign keys
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Customers foreign keys
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customers" ADD CONSTRAINT "customers_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customers" ADD CONSTRAINT "customers_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Products foreign keys
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Customer product preferences foreign keys
ALTER TABLE "customer_product_preferences" ADD CONSTRAINT "customer_product_preferences_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customer_product_preferences" ADD CONSTRAINT "customer_product_preferences_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Follow ups foreign key
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Interactions foreign keys
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sales foreign keys
ALTER TABLE "sales" ADD CONSTRAINT "sales_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sessions foreign key
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Approval workflows foreign keys
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Audit logs foreign key
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Escalations foreign keys
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_workflows_updated_at BEFORE UPDATE ON approval_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on tables that need it
ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "floors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customer_product_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "follow_ups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approval_workflows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "escalations" ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies need to be created separately based on your specific security requirements 