import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Customer, CreateCustomerInput, UpdateCustomerInput, CustomerFilters } from '@/types/customer';

export class CustomerService {
  private static getSupabaseClient() {
    const cookieStore = cookies();
    return createClient(cookieStore);
  }

  static async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    const supabase = this.getSupabaseClient();
    
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        occupation: data.occupation,
        income_range: data.incomeRange,
        social_circle: data.socialCircle,
        occasions: data.occasions,
        budget_range: data.budgetRange,
        notes: data.notes,
        status: data.status || 'ACTIVE',
        store_id: data.storeId,
        floor_id: data.floorId,
        assigned_to_id: data.assignedToId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformCustomer(customer);
  }

  static async getCustomers(filters: CustomerFilters = {}, page = 1, limit = 20): Promise<{ customers: Customer[]; pagination: { page: number; limit: number; total: number; pages: number }; }> {
    const supabase = this.getSupabaseClient();
    
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.storeId) {
      query = query.eq('store_id', filters.storeId);
    }
    if (filters.floorId) {
      query = query.eq('floor_id', filters.floorId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }
    if (filters.assignedToId) {
      query = query.eq('assigned_to_id', filters.assignedToId);
    }

    const { data: customers, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const total = count || 0;
    const pages = Math.ceil(total / limit);

    return {
      customers: customers?.map(this.transformCustomer) || [],
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  static async getCustomerById(id: string): Promise<Customer> {
    const supabase = this.getSupabaseClient();
    
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformCustomer(customer);
  }

  static async updateCustomer(id: string, data: UpdateCustomerInput): Promise<Customer> {
    const supabase = this.getSupabaseClient();
    
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.dateOfBirth !== undefined) updateData.date_of_birth = data.dateOfBirth;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.occupation !== undefined) updateData.occupation = data.occupation;
    if (data.incomeRange !== undefined) updateData.income_range = data.incomeRange;
    if (data.socialCircle !== undefined) updateData.social_circle = data.socialCircle;
    if (data.occasions !== undefined) updateData.occasions = data.occasions;
    if (data.budgetRange !== undefined) updateData.budget_range = data.budgetRange;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.floorId !== undefined) updateData.floor_id = data.floorId;
    if (data.assignedToId !== undefined) updateData.assigned_to_id = data.assignedToId;

    const { data: customer, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.transformCustomer(customer);
  }

  static async deleteCustomer(id: string): Promise<void> {
    const supabase = this.getSupabaseClient();
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCustomerStats(storeId: string): Promise<{ total: number; active: number; inactive: number; prospect: number; converted: number; thisMonth: number; lastMonth: number; }> {
    const supabase = this.getSupabaseClient();
    
    // Get total customers
    const { count: total } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId);

    // Get active customers
    const { count: active } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .eq('status', 'ACTIVE');

    // Get inactive customers
    const { count: inactive } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .eq('status', 'INACTIVE');

    // Get prospect customers
    const { count: prospect } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .eq('status', 'PROSPECT');

    // Get converted customers
    const { count: converted } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .eq('status', 'CONVERTED');

    // Get this month's customers
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const { count: thisMonth } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .gte('created_at', thisMonthStart.toISOString());

    // Get last month's customers
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(1);
    lastMonthEnd.setHours(0, 0, 0, 0);

    const { count: lastMonth } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', lastMonthEnd.toISOString());

    return {
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      prospect: prospect || 0,
      converted: converted || 0,
      thisMonth: thisMonth || 0,
      lastMonth: lastMonth || 0,
    };
  }

  static async searchCustomers(query: string, storeId: string, limit = 10): Promise<Customer[]> {
    const supabase = this.getSupabaseClient();
    
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('store_id', storeId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(limit)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return customers?.map(this.transformCustomer) || [];
  }

  private static transformCustomer(dbCustomer: any): Customer {
    return {
      id: dbCustomer.id,
      name: dbCustomer.name,
      email: dbCustomer.email,
      phone: dbCustomer.phone,
      address: dbCustomer.address,
      city: dbCustomer.city,
      state: dbCustomer.state,
      pincode: dbCustomer.pincode,
      dateOfBirth: dbCustomer.date_of_birth,
      gender: dbCustomer.gender,
      occupation: dbCustomer.occupation,
      incomeRange: dbCustomer.income_range,
      socialCircle: dbCustomer.social_circle,
      occasions: dbCustomer.occasions || [],
      budgetRange: dbCustomer.budget_range,
      notes: dbCustomer.notes,
      status: dbCustomer.status,
      storeId: dbCustomer.store_id,
      floorId: dbCustomer.floor_id,
      assignedToId: dbCustomer.assigned_to_id,
      createdAt: dbCustomer.created_at,
      updatedAt: dbCustomer.updated_at,
    };
  }
} 