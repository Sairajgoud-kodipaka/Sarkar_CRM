// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  floorId?: string;
  floor?: Floor;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  avatar?: string;
}

export type UserRole = 'BUSINESS_ADMIN' | 'FLOOR_MANAGER';

// Floor Management Types
export interface Floor {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
  customers?: Customer[];
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: Date;
  weddingDate?: Date;
  
  // Address Information
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  catchmentArea?: string;
  
  // Demographics
  community?: string;
  languages?: string[];
  visitReason?: string;
  visitSource?: string;
  
  // Interests & Products
  interestedCategories?: string[];
  interestedProducts?: string[];
  preferences?: string;
  
  // Follow-up & Sales
  purchaseAmount?: number;
  notes?: string;
  followUpDate?: Date;
  followUpStatus?: FollowUpStatus;
  
  // Relationships
  floorId: string;
  floor?: Floor;
  registeredById: string;
  registeredBy?: User;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastVisitAt?: Date;
  
  // Interactions
  interactions?: CustomerInteraction[];
}

export type FollowUpStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Customer Interaction Types
export interface CustomerInteraction {
  id: string;
  customerId: string;
  customer?: Customer;
  type: InteractionType;
  description: string;
  outcome?: string;
  nextAction?: string;
  followUpDate?: Date;
  createdById: string;
  createdBy?: User;
  createdAt: Date;
  updatedAt: Date;
}

export type InteractionType = 'CALL' | 'EMAIL' | 'SMS' | 'VISIT' | 'SALE' | 'FOLLOW_UP';

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  category?: Category;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  minStockLevel: number;
  images?: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sales and Analytics Types
export interface SalesData {
  id: string;
  customerId: string;
  customer?: Customer;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  salesPersonId: string;
  salesPerson?: User;
  floorId: string;
  floor?: Floor;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'EMI';

// Dashboard Analytics Types
export interface DashboardMetrics {
  totalVisitors: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  floorPerformance: FloorPerformance[];
  recentActivity: RecentActivity[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  quantity: number;
}

export interface FloorPerformance {
  floorId: string;
  floorName: string;
  visitors: number;
  sales: number;
  revenue: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type ActivityType = 'CUSTOMER_REGISTERED' | 'SALE_COMPLETED' | 'FOLLOW_UP_SCHEDULED' | 'PRODUCT_ADDED' | 'USER_LOGGED_IN';

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  floorId?: string;
}

export interface CustomerFormData {
  // Step 1: Customer Details
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: Date;
  weddingDate?: Date;
  
  // Step 2: Address Information
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  catchmentArea?: string;
  
  // Step 3: Demographics & Visit
  community?: string;
  languages?: string[];
  visitReason?: string;
  visitSource?: string;
  
  // Step 4: Customer Interests & Product Selection
  interestedCategories?: string[];
  interestedProducts?: string[];
  preferences?: string;
  
  // Step 5: Follow-up & Summary
  purchaseAmount?: number;
  notes?: string;
  followUpDate?: Date;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  minStockLevel: number;
  images?: File[];
  specifications?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface CustomerFilters {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: FollowUpStatus;
  floorId?: string;
  community?: string;
  visitSource?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  isActive?: boolean;
}

// Export Types
export interface ExportOptions {
  format: 'PDF' | 'EXCEL' | 'CSV';
  filters?: CustomerFilters | ProductFilters;
  columns?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

// Support Types
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  userId: string;
  user?: User;
  assignedToId?: string;
  assignedTo?: User;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL';

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// Real-time Types
export interface RealtimeSubscription {
  id: string;
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  filter?: string;
  callback: (payload: any) => void;
}

// Environment and Configuration Types
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  features: {
    realtime: boolean;
    analytics: boolean;
    export: boolean;
  };
} 