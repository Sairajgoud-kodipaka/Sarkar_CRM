# 🏢 Sarkar CRM - Jewelry Store Management System

A comprehensive Customer Relationship Management (CRM) system designed specifically for jewelry stores, featuring role-based access control, floor management, and advanced customer tracking capabilities.

## 🚀 Features

### 🔐 **Authentication & Authorization**
- **Multi-role System**: Business Admin, Floor Manager, Salesperson
- **Secure Login/Logout**: Role-based dashboard access
- **Password Recovery**: Forgot password functionality
- **User Registration**: Multi-step registration process

### 👥 **Customer Management**
- **Customer Database**: Complete customer profiles with contact information
- **Floor Assignment**: Customers assigned to specific floors (Gold & Diamond, Silver, etc.)
- **Follow-up Tracking**: Automated follow-up scheduling and reminders
- **Purchase History**: Complete transaction history and spending patterns
- **Status Management**: Active, Pending, Inactive customer statuses

### 🏪 **Floor Management**
- **Floor-specific Dashboards**: Dedicated views for each floor
- **Inventory Management**: Product catalog with stock tracking
- **Performance Metrics**: Floor-wise sales and customer analytics
- **Staff Assignment**: Salesperson allocation to floors

### 📊 **Analytics & Reporting**
- **Real-time Dashboards**: Live performance metrics
- **Sales Analytics**: Revenue tracking and trend analysis
- **Customer Insights**: Behavior patterns and preferences
- **Performance Tracking**: Individual and team performance metrics

### 🎨 **Modern UI/UX**
- **HubSpot-inspired Design**: Professional and intuitive interface
- **Responsive Layout**: Works seamlessly on all devices
- **Dark/Light Mode**: Customizable theme preferences
- **Interactive Components**: Smooth animations and transitions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
Sarkar_CRM/
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/            # Dashboard pages
│   │   │   ├── admin/              # Business Admin pages
│   │   │   ├── floor-manager/      # Floor Manager pages
│   │   │   └── salesperson/        # Salesperson pages
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── layout/                 # Layout components
│   ├── lib/                        # Utility functions
│   └── types/                      # TypeScript types
├── prisma/                         # Database schema
├── supabase/                       # Supabase configuration
└── public/                         # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sarkar_CRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🧪 Testing Guide

### 🌐 **Access URLs**

| Page | URL | Role Required |
|------|-----|---------------|
| Login | `/login` | All |
| Business Admin Dashboard | `/admin/dashboard` | BUSINESS_ADMIN |
| Customer Management | `/admin/customers` | BUSINESS_ADMIN |
| Add Customer | `/admin/customers/new` | BUSINESS_ADMIN |
| Product Management | `/admin/products` | BUSINESS_ADMIN |
| Floor Manager Dashboard | `/floor-manager/dashboard` | FLOOR_MANAGER |
| Floor Customers | `/floor-manager/customers` | FLOOR_MANAGER |
| Floor Products | `/floor-manager/products` | FLOOR_MANAGER |
| Salesperson Dashboard | `/salesperson/dashboard` | SALESPERSON |

### 🔐 **Test Credentials**

Since the system uses mock data for demonstration, you can use any of these credentials:

**Business Admin:**
```
Email: admin@sarkarcrm.com
Password: admin123
```

**Floor Manager:**
```
Email: manager@sarkarcrm.com
Password: manager123
```

**Salesperson:**
```
Email: sales@sarkarcrm.com
Password: sales123
```

### 📋 **Testing Checklist**

#### ✅ **Authentication Flow**
- [ ] **Login Page** (`/login`)
  - Test form validation
  - Test "Remember me" checkbox
  - Test "Forgot password" link
  - Test "Sign up" link
  - Test role-based redirects

- [ ] **Forgot Password** (`/forgot-password`)
  - Test email input validation
  - Test success state
  - Test "Back to login" link

- [ ] **Registration** (`/register`)
  - Test multi-step form navigation
  - Test form validation on each step
  - Test success state

#### ✅ **Business Admin Features**
- [ ] **Dashboard** (`/admin/dashboard`)
  - Test overview metrics
  - Test recent activities
  - Test quick actions
  - Test navigation

- [ ] **Customer Management** (`/admin/customers`)
  - Test search functionality
  - Test filters (Status, Floor)
  - Test table sorting
  - Test action dropdowns
  - Test stats cards

- [ ] **Add Customer** (`/admin/customers/new`)
  - Test multi-step form
  - Test form validation
  - Test navigation between steps
  - Test success state

- [ ] **Product Management** (`/admin/products`)
  - Test search functionality
  - Test category and status filters
  - Test product table
  - Test action buttons

#### ✅ **Floor Manager Features**
- [ ] **Floor Dashboard** (`/floor-manager/dashboard`)
  - Test floor-specific metrics
  - Test today's tasks
  - Test recent customers
  - Test top products

- [ ] **Floor Customers** (`/floor-manager/customers`)
  - Test floor-specific customer list
  - Test priority filters
  - Test performance metrics
  - Test floor branding

- [ ] **Floor Products** (`/floor-manager/products`)
  - Test floor-specific products
  - Test performance trends
  - Test stock management
  - Test revenue tracking

#### ✅ **Salesperson Features**
- [ ] **Sales Dashboard** (`/salesperson/dashboard`)
  - Test personal performance metrics
  - Test sales targets
  - Test customer satisfaction
  - Test recent sales

#### ✅ **General Features**
- [ ] **Responsive Design**
  - Test on desktop (1920x1080)
  - Test on tablet (768x1024)
  - Test on mobile (375x667)
  - Test sidebar collapse/expand

- [ ] **Navigation**
  - Test sidebar navigation
  - Test breadcrumbs
  - Test role-based menu items
  - Test logout functionality

- [ ] **Search & Filters**
  - Test global search
  - Test table filters
  - Test date range filters
  - Test export functionality

## 🎯 Key Features to Test

### 1. **Role-Based Access Control**
- Each role sees different dashboard layouts
- Menu items are filtered by role
- Data is scoped to user's permissions

### 2. **Real-time Data**
- Stats cards update dynamically
- Tables show live data
- Performance metrics are current

### 3. **Interactive Forms**
- Multi-step customer registration
- Form validation with error messages
- Success states and confirmations

### 4. **Data Management**
- Search across all fields
- Filter by multiple criteria
- Sort by any column
- Export data functionality

### 5. **Responsive Design**
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Linting & Formatting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Adding New Components

1. **Create component file** in `src/components/`
2. **Add to index** for easy imports
3. **Update types** if needed
4. **Add to storybook** for documentation

### Database Schema

The system uses Prisma with the following main models:
- `User` - Authentication and user profiles
- `Customer` - Customer information and history
- `Product` - Product catalog and inventory
- `Sale` - Transaction records
- `Floor` - Floor management and assignments

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for jewelry stores worldwide** 