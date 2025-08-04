# Database Reset Guide

## 🎯 What We're Doing

We're going to completely reset your Supabase database and recreate it with the **perfect schema** that matches your Prisma schema exactly.

## 📋 Files Created

1. **`check-current-setup.sql`** - Check what's currently in your database
2. **`reset-database.sql`** - Complete database reset script
3. **`complete-setup.sql`** - Your updated setup file (already has the missing tables)

## 🚀 Step-by-Step Process

### Step 1: Check Current Database State
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `check-current-setup.sql`
4. Run the script to see what's currently in your database

### Step 2: Reset Database (Choose One Option)

#### Option A: Use the Reset Script (Recommended)
1. In Supabase SQL Editor, copy and paste the contents of `reset-database.sql`
2. Run the script - it will:
   - Drop all existing tables, enums, functions, views
   - Recreate everything with the perfect schema
   - Add all missing tables (approval_workflows, audit_logs, escalations)
   - Set up all indexes, triggers, and security

#### Option B: Use Prisma (Alternative)
```bash
npx prisma db push --force-reset
```

### Step 3: Verify the Setup
After running the reset script, you should see:
- ✅ **15 tables** created
- ✅ **10 enums** created  
- ✅ **All indexes** and **triggers** working
- ✅ **Row Level Security** enabled
- ✅ **Real-time** features enabled
- ✅ **Storage buckets** configured

## 📊 What You'll Get

### Core Tables (12)
- `stores` - Store information
- `users` - User accounts and roles
- `floors` - Store floor management
- `categories` - Product categories
- `products` - Product catalog
- `customers` - Customer data
- `interactions` - Customer interactions
- `follow_ups` - Follow-up scheduling
- `sales` - Sales transactions
- `customer_product_preferences` - Customer preferences
- `sessions` - User sessions
- `verification_tokens` - Email verification

### Workflow Tables (3) - NEW!
- `approval_workflows` - Approval system
- `audit_logs` - System audit trail
- `escalations` - Escalation management

### Advanced Features
- ✅ **Performance indexes** for fast queries
- ✅ **Automatic timestamps** with triggers
- ✅ **Row Level Security** for data protection
- ✅ **Real-time notifications** for live updates
- ✅ **Storage buckets** for file management
- ✅ **Analytics views** for reporting

## 🔧 After Reset

1. **Test the connection** with your Prisma app
2. **Run migrations** if needed: `npx prisma migrate dev`
3. **Generate Prisma client**: `npx prisma generate`
4. **Start your application** and test the features

## ⚠️ Important Notes

- **This will delete ALL existing data** - make sure you have backups if needed
- **The reset script is safe** - it uses `DROP IF EXISTS` to avoid errors
- **All relationships are preserved** - foreign keys and constraints are properly set up
- **Security is enabled** - RLS policies are in place

## 🎉 Expected Result

After running the reset script, your database will be:
- **100% compatible** with your Prisma schema
- **Production-ready** with all security features
- **Performance optimized** with proper indexes
- **Feature complete** with all workflow systems

## 🆘 If Something Goes Wrong

1. Check the error message in Supabase SQL Editor
2. Make sure you have the right permissions
3. Try running the script in smaller sections
4. Contact support if needed

---

**Ready to reset?** Copy the `reset-database.sql` content and run it in your Supabase SQL Editor! 🚀 