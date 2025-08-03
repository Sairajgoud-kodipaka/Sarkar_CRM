// Application constants
export const APP_NAME = 'Sarkar CRM';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Comprehensive CRM system for jewellery stores';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    PASSWORD: '/api/users/password',
  },
  CUSTOMERS: {
    BASE: '/api/customers',
    IMPORT: '/api/customers/import',
    EXPORT: '/api/customers/export',
  },
  PRODUCTS: {
    BASE: '/api/products',
    IMPORT: '/api/products/import',
    EXPORT: '/api/products/export',
  },
  CATEGORIES: {
    BASE: '/api/categories',
  },
  FLOORS: {
    BASE: '/api/floors',
  },
  SALES: {
    BASE: '/api/sales',
    ANALYTICS: '/api/sales/analytics',
  },
  SUPPORT: {
    BASE: '/api/support',
  },
} as const;

// Navigation constants
export const NAVIGATION = {
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  PRODUCTS: '/products',
  SALES: '/sales',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  SUPPORT: '/support',
} as const;

// User roles
export const USER_ROLES = {
  BUSINESS_ADMIN: 'BUSINESS_ADMIN',
  FLOOR_MANAGER: 'FLOOR_MANAGER',
} as const;

// Customer status options
export const CUSTOMER_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// Interaction types
export const INTERACTION_TYPES = {
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  VISIT: 'VISIT',
  SALE: 'SALE',
  FOLLOW_UP: 'FOLLOW_UP',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  BANK_TRANSFER: 'BANK_TRANSFER',
  EMI: 'EMI',
} as const;

// Support ticket priorities
export const TICKET_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

// Support ticket statuses
export const TICKET_STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

// Support ticket categories
export const TICKET_CATEGORIES = {
  TECHNICAL: 'TECHNICAL',
  BILLING: 'BILLING',
  FEATURE_REQUEST: 'FEATURE_REQUEST',
  BUG_REPORT: 'BUG_REPORT',
  GENERAL: 'GENERAL',
} as const;

// Indian states
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
  'Puducherry',
  'Andaman and Nicobar Islands',
] as const;

// Indian cities (major cities)
export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivali',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubli-Dharwad',
  'Bareilly',
  'Moradabad',
  'Mysore',
  'Gurgaon',
  'Aligarh',
  'Jalandhar',
  'Tiruchirappalli',
  'Bhubaneswar',
  'Salem',
  'Warangal',
  'Mira-Bhayandar',
  'Thiruvananthapuram',
  'Bhiwandi',
  'Saharanpur',
  'Guntur',
  'Amravati',
  'Bikaner',
  'Noida',
  'Jamshedpur',
  'Bhilai',
  'Cuttack',
  'Firozabad',
  'Kochi',
  'Nellore',
  'Bhavnagar',
  'Dehradun',
  'Durgapur',
  'Asansol',
  'Rourkela',
  'Nanded',
  'Kolhapur',
  'Ajmer',
  'Akola',
  'Gulbarga',
  'Jamnagar',
  'Ujjain',
  'Loni',
  'Siliguri',
  'Jhansi',
  'Ulhasnagar',
  'Jammu',
  'Sangli-Miraj & Kupwad',
  'Mangalore',
  'Erode',
  'Belgaum',
  'Ambattur',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Jalgaon',
  'Udaipur',
  'Maheshtala',
  'Tirupur',
  'Davanagere',
  'Kozhikode',
  'Akola',
  'Kurnool',
  'Rajpur Sonarpur',
  'Bokaro',
  'South Dumdum',
  'Bellary',
  'Patiala',
  'Gopalpur',
  'Agartala',
  'Bhagalpur',
  'Muzaffarnagar',
  'Bhatpara',
  'Panihati',
  'Latur',
  'Dhule',
  'Rohtak',
  'Korba',
  'Bhilwara',
  'Brahmapur',
  'Muzaffarpur',
  'Ahmednagar',
  'Mathura',
  'Kollam',
  'Avadi',
  'Kadapa',
  'Kamarhati',
  'Bilaspur',
  'Shahjahanpur',
  'Satara',
  'Bijapur',
  'Rampur',
  'Shivamogga',
  'Chandrapur',
  'Junagadh',
  'Thrissur',
  'Alwar',
  'Bardhaman',
  'Kulti',
  'Kakinada',
  'Nizamabad',
  'Parbhani',
  'Tumkur',
  'Hisar',
  'Ozhukarai',
  'Bihar Sharif',
  'Panipat',
  'Darbhanga',
  'Bally',
  'Aizawl',
  'Dewas',
  'Ichalkaranji',
  'Tirupati',
  'Karnal',
  'Bathinda',
  'Rampur',
  'Shahjahanpur',
  'Satara',
  'Bijapur',
  'Rampur',
  'Shivamogga',
  'Chandrapur',
  'Junagadh',
  'Thrissur',
  'Alwar',
  'Bardhaman',
  'Kulti',
  'Kakinada',
  'Nizamabad',
  'Parbhani',
  'Tumkur',
  'Hisar',
  'Ozhukarai',
  'Bihar Sharif',
  'Panipat',
  'Darbhanga',
  'Bally',
  'Aizawl',
  'Dewas',
  'Ichalkaranji',
  'Tirupati',
  'Karnal',
  'Bathinda',
] as const;

// Languages
export const LANGUAGES = [
  'English',
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Odia',
  'Assamese',
  'Urdu',
  'Sanskrit',
] as const;

// Communities
export const COMMUNITIES = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Other',
] as const;

// Visit reasons
export const VISIT_REASONS = [
  'Wedding Shopping',
  'Birthday Gift',
  'Anniversary Gift',
  'Festival Shopping',
  'Investment',
  'Replacement',
  'Repair',
  'General Inquiry',
  'Other',
] as const;

// Visit sources
export const VISIT_SOURCES = [
  'Walk-in',
  'Referral',
  'Social Media',
  'Website',
  'Advertisement',
  'Previous Customer',
  'Event',
  'Other',
] as const;

// Jewellery categories
export const JEWELLERY_CATEGORIES = [
  'Gold Jewellery',
  'Silver Jewellery',
  'Diamond Jewellery',
  'Platinum Jewellery',
  'Pearl Jewellery',
  'Gemstone Jewellery',
  'Fashion Jewellery',
  'Antique Jewellery',
  'Bridal Jewellery',
  'Daily Wear Jewellery',
] as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Bangles',
  'Pendants',
  'Chains',
  'Anklets',
  'Nose Pins',
  'Toe Rings',
  'Mangalsutra',
  'Payal',
  'Kamarband',
  'Haar',
  'Jhumka',
  'Studs',
  'Hoops',
  'Drops',
  'Chokers',
  'Sets',
] as const;

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
  MAX_FILES: 10,
} as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 25, 50, 100],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_TIME: 'dd MMM yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_TIME: 'yyyy-MM-dd HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const;

// Currency constants
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN',
} as const;

// Validation constants
export const VALIDATION = {
  PHONE_REGEX: /^[6-9]\d{9}$/,
  PINCODE_REGEX: /^[1-9][0-9]{5}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  DESCRIPTION_MIN_LENGTH: 10,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_PINCODE: 'Please enter a valid 6-digit pincode',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  FILE_TOO_LARGE: 'File size is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  CUSTOMER_CREATED: 'Customer created successfully',
  CUSTOMER_UPDATED: 'Customer updated successfully',
  CUSTOMER_DELETED: 'Customer deleted successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  SALE_COMPLETED: 'Sale completed successfully',
  TICKET_CREATED: 'Support ticket created successfully',
  TICKET_UPDATED: 'Support ticket updated successfully',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully',
} as const;

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#f97316',
  SECONDARY: '#0f172a',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  GRAY: '#6b7280',
  LIGHT_GRAY: '#9ca3af',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
  DASHBOARD_FILTERS: 'dashboard_filters',
} as const;

// Session storage keys
export const SESSION_KEYS = {
  FORM_DATA: 'form_data',
  UPLOAD_PROGRESS: 'upload_progress',
  TEMP_DATA: 'temp_data',
} as const;

// Export formats
export const EXPORT_FORMATS = {
  PDF: 'PDF',
  EXCEL: 'EXCEL',
  CSV: 'CSV',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

// Table column options
export const TABLE_COLUMNS = {
  CUSTOMERS: [
    'name',
    'phone',
    'email',
    'city',
    'community',
    'visitSource',
    'followUpStatus',
    'createdAt',
  ],
  PRODUCTS: [
    'name',
    'sku',
    'category',
    'price',
    'stockQuantity',
    'isActive',
    'createdAt',
  ],
  SALES: [
    'customer',
    'product',
    'quantity',
    'finalAmount',
    'paymentMethod',
    'saleDate',
  ],
} as const;

// Default filters
export const DEFAULT_FILTERS = {
  DATE_RANGE: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  },
  STATUS: 'ALL',
  FLOOR: 'ALL',
  CATEGORY: 'ALL',
} as const;

// API response codes
export const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const; 