export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  occupation?: string;
  incomeRange?: string;
  socialCircle?: string;
  occasions: string[];
  budgetRange?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'CONVERTED';
  storeId: string;
  floorId?: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Related data
  store?: { name: string };
  floor?: { name: string; number: number };
  assignedTo?: { name: string; email: string };
  interactions?: any[];
  sales?: any[];
  followUps?: any[];
  preferences?: any[];
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  occupation?: string;
  incomeRange?: string;
  socialCircle?: string;
  occasions?: string[];
  budgetRange?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'CONVERTED';
  storeId: string;
  floorId?: string;
  assignedToId?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  occupation?: string;
  incomeRange?: string;
  socialCircle?: string;
  occasions?: string[];
  budgetRange?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'CONVERTED';
  floorId?: string;
  assignedToId?: string;
}

export interface CustomerFilters {
  storeId?: string;
  floorId?: string;
  assignedToId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'CONVERTED';
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  prospect: number;
  converted: number;
  thisMonth: number;
  lastMonth: number;
} 