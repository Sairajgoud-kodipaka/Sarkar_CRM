import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Step 2: Business Information
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Please select a business type'),
  numberOfFloors: z.string().min(1, 'Please select number of floors'),
  storeType: z.string().min(1, 'Please select store type'),
  address: z.string().min(10, 'Please enter a complete address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().min(6, 'Please enter a valid pincode'),
  
  // Step 3: Account Setup
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot password form validation
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password form validation
export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Customer form validation - Step 1: Customer Details
export const customerDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  dateOfBirth: z.date().optional(),
  weddingDate: z.date().optional(),
});

// Customer form validation - Step 2: Address Information
export const customerAddressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters').optional().or(z.literal('')),
  city: z.string().min(2, 'City must be at least 2 characters').optional().or(z.literal('')),
  state: z.string().min(2, 'State must be at least 2 characters').optional().or(z.literal('')),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
  catchmentArea: z.string().optional().or(z.literal('')),
});

// Customer form validation - Step 3: Demographics & Visit
export const customerDemographicsSchema = z.object({
  community: z.string().optional().or(z.literal('')),
  languages: z.array(z.string()).optional(),
  visitReason: z.string().optional().or(z.literal('')),
  visitSource: z.string().optional().or(z.literal('')),
});

// Customer form validation - Step 4: Customer Interests & Product Selection
export const customerInterestsSchema = z.object({
  interestedCategories: z.array(z.string()).optional(),
  interestedProducts: z.array(z.string()).optional(),
  preferences: z.string().optional().or(z.literal('')),
});

// Customer form validation - Step 5: Follow-up & Summary
export const customerFollowUpSchema = z.object({
  purchaseAmount: z.number().min(0, 'Purchase amount must be positive').optional(),
  notes: z.string().optional().or(z.literal('')),
  followUpDate: z.date().optional(),
});

// Complete customer form validation
export const customerFormSchema = customerDetailsSchema
  .merge(customerAddressSchema)
  .merge(customerDemographicsSchema)
  .merge(customerInterestsSchema)
  .merge(customerFollowUpSchema);

export type CustomerFormData = z.infer<typeof customerFormSchema>;

// Product form validation
export const productFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  description: z.string().optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().min(0, 'Cost price must be positive').optional(),
  stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
  minStockLevel: z.number().min(0, 'Minimum stock level must be non-negative'),
  images: z.array(z.instanceof(File)).optional(),
  specifications: z.record(z.any()).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Category form validation
export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// User form validation
export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['BUSINESS_ADMIN', 'FLOOR_MANAGER']),
  floorId: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// Floor form validation
export const floorFormSchema = z.object({
  name: z.string().min(2, 'Floor name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type FloorFormData = z.infer<typeof floorFormSchema>;

// Sales form validation
export const salesFormSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  productId: z.string().min(1, 'Please select a product'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  discountAmount: z.number().min(0, 'Discount amount must be non-negative').optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'EMI']),
  saleDate: z.date(),
});

export type SalesFormData = z.infer<typeof salesFormSchema>;

// Customer interaction form validation
export const interactionFormSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  type: z.enum(['CALL', 'EMAIL', 'SMS', 'VISIT', 'SALE', 'FOLLOW_UP']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  outcome: z.string().optional().or(z.literal('')),
  nextAction: z.string().optional().or(z.literal('')),
  followUpDate: z.date().optional(),
});

export type InteractionFormData = z.infer<typeof interactionFormSchema>;

// Support ticket form validation
export const supportTicketFormSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.enum(['TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'GENERAL']),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type SupportTicketFormData = z.infer<typeof supportTicketFormSchema>;

// Search and filter validation
export const searchFilterSchema = z.object({
  search: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  status: z.string().optional(),
  floorId: z.string().optional(),
  categoryId: z.string().optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type SearchFilterData = z.infer<typeof searchFilterSchema>;

// Export options validation
export const exportOptionsSchema = z.object({
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  filters: searchFilterSchema.optional(),
  columns: z.array(z.string()).optional(),
});

export type ExportOptionsData = z.infer<typeof exportOptionsSchema>;

// CSV import validation
export const csvImportSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.type === 'text/csv' || file.name.endsWith('.csv'),
    'Please upload a valid CSV file'
  ),
  hasHeaders: z.boolean().default(true),
  mapping: z.record(z.string()).optional(),
});

export type CsvImportData = z.infer<typeof csvImportSchema>;

// Profile update validation
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  avatar: z.instanceof(File).optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// Notification settings validation
export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;

// Date range validation
export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date(),
}).refine((data) => data.start <= data.end, {
  message: "Start date must be before or equal to end date",
  path: ["end"],
});

export type DateRangeData = z.infer<typeof dateRangeSchema>;

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationData = z.infer<typeof paginationSchema>;

// Bulk operations validation
export const bulkOperationSchema = z.object({
  ids: z.array(z.string()).min(1, 'Please select at least one item'),
  operation: z.enum(['delete', 'update', 'export', 'followUp']),
  data: z.record(z.any()).optional(),
});

export type BulkOperationData = z.infer<typeof bulkOperationSchema>;

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().optional().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).optional(),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

// Validation helper functions
export const validateFileSize = (file: File, maxSize: number = 5 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Error message helpers
export const getFieldError = (errors: any, field: string): string | undefined => {
  return errors[field]?.message;
};

export const hasFieldError = (errors: any, field: string): boolean => {
  return !!errors[field];
};

export const getFormErrors = (errors: any): string[] => {
  return Object.values(errors).map((error: any) => error.message);
}; 