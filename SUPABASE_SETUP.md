# Supabase Setup Guide - Sarkar CRM

## 🚀 Project Information
- **Project URL**: https://mdwpqkrbmjwmfqygxuag.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3Bxa3JibWp3bWZxeWd4dWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTYwOTEsImV4cCI6MjA2OTc5MjA5MX0.hcHyQADCvxK7WI5-nWF1esA66F3a1LtYMTtOWelmL3Q

## 📊 Required Database Tables

### Core Tables (11 tables)
1. **stores** - Store information and configuration
2. **users** - Business Admin and Floor Manager users
3. **floors** - Multi-floor store management
4. **categories** - Product categories with hierarchy
5. **products** - Jewellery products with specifications
6. **customers** - Customer profiles and preferences
7. **interactions** - Customer interaction tracking
8. **follow_ups** - Follow-up scheduling and management
9. **sales** - Sales records and transactions
10. **customer_product_preferences** - Customer product preferences
11. **accounts** - NextAuth.js authentication accounts
12. **sessions** - NextAuth.js user sessions
13. **verification_tokens** - NextAuth.js email verification

### Enums (7 types)
- user_role: BUSINESS_ADMIN, FLOOR_MANAGER
- gender_type: MALE, FEMALE, OTHER
- customer_status: ACTIVE, INACTIVE, PROSPECT, CONVERTED
- interaction_type: WALK_IN, PHONE_CALL, EMAIL, FOLLOW_UP, SALE, COMPLAINT, INQUIRY
- follow_up_type: PHONE_CALL, EMAIL, SMS, VISIT, DEMO
- follow_up_status: PENDING, COMPLETED, CANCELLED, RESCHEDULED
- sale_status: PENDING, COMPLETED, CANCELLED, REFUNDED

## 🗄️ Storage Buckets (3 buckets)
1. **product-images** - Public bucket for product images
2. **customer-documents** - Private bucket for customer documents
3. **store-assets** - Public bucket for store logos and assets

## 🔄 Real-time Channels (3 channels)
1. **dashboard-metrics** - Live dashboard updates
2. **customer-activity** - Real-time customer interactions
3. **sales-pipeline** - Live sales pipeline updates

## 🔗 Webhooks (3 edge functions)
1. **customer-created** - Welcome emails and initial follow-ups
2. **sale-completed** - Sales notifications and analytics updates
3. **follow-up-reminder** - Automated follow-up reminders

## 🛡️ Row Level Security (RLS)
- Multi-tenant isolation for all tables
- Store-based data access control
- Role-based permissions (Business Admin vs Floor Manager)

## 📈 Database Indexes (20+ indexes)
- Performance optimization for all major queries
- Composite indexes for complex filtering
- Full-text search indexes for customer/product search

## 🔧 Database Functions (3 functions)
1. **generate_sku()** - Auto-generate product SKUs
2. **update_updated_at_column()** - Automatic timestamp updates
3. **get_dashboard_metrics()** - Dashboard analytics aggregation

## 📊 Analytics Views (3 views)
1. **sales_analytics** - Sales performance metrics
2. **customer_analytics** - Customer behavior insights
3. **product_performance** - Product performance tracking

## 🔐 Authentication Setup
- Email/password authentication
- Custom user claims for roles
- Multi-tenant user isolation
- Session management

## 🚀 Implementation Priority

### Phase 1: Core Database (Week 1)
- [ ] Create all tables and enums
- [ ] Set up RLS policies
- [ ] Create database indexes
- [ ] Set up authentication

### Phase 2: Storage & Real-time (Week 2)
- [ ] Configure storage buckets
- [ ] Set up real-time subscriptions
- [ ] Test file uploads
- [ ] Verify real-time updates

### Phase 3: Webhooks & Analytics (Week 3)
- [ ] Deploy edge functions
- [ ] Create analytics views
- [ ] Set up monitoring
- [ ] Performance testing

## 📝 Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://mdwpqkrbmjwmfqygxuag.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd3Bxa3JibWp3bWZxeWd4dWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTYwOTEsImV4cCI6MjA2OTc5MjA5MX0.hcHyQADCvxK7WI5-nWF1esA66F3a1LtYMTtOWelmL3Q
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🎯 Next Steps
1. Get your service role key from Supabase dashboard
2. Run the database setup scripts
3. Configure storage buckets
4. Deploy edge functions
5. Test the complete setup

Ready to build your Sarkar CRM with Supabase! 💎✨ 