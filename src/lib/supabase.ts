import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helpers
export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },

  // Update user profile
  updateProfile: async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });
    return { data, error };
  },
};

// Database helpers
export const db = {
  // Customer operations
  customers: {
    // Get all customers with pagination
    getAll: async (page = 1, limit = 10, filters?: any) => {
      let query = supabase
        .from('customers')
        .select(`
          *,
          floor:floors(name),
          registered_by:users(name, email),
          interactions(*)
        `)
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      if (filters?.floorId) {
        query = query.eq('floor_id', filters.floorId);
      }
      if (filters?.status) {
        query = query.eq('follow_up_status', filters.status);
      }
      if (filters?.dateRange) {
        query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end);
      }

      const { data, error, count } = await query;
      return { data, error, count };
    },

    // Get customer by ID
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          floor:floors(name),
          registered_by:users(name, email),
          interactions(*)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },

    // Create new customer
    create: async (customerData: any) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();
      return { data, error };
    },

    // Update customer
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    // Delete customer
    delete: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      return { error };
    },

    // Get customer count by floor
    getCountByFloor: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('floor_id, floors(name)')
        .select('floor_id, count');
      return { data, error };
    },
  },

  // Product operations
  products: {
    // Get all products with pagination
    getAll: async (page = 1, limit = 10, filters?: any) => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.inStock !== undefined) {
        query = filters.inStock 
          ? query.gt('stock_quantity', 0)
          : query.eq('stock_quantity', 0);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error, count } = await query;
      return { data, error, count };
    },

    // Get product by ID
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },

    // Create new product
    create: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      return { data, error };
    },

    // Update product
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    // Delete product
    delete: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      return { error };
    },

    // Bulk import products
    bulkImport: async (products: any[]) => {
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();
      return { data, error };
    },
  },

  // Category operations
  categories: {
    // Get all categories
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      return { data, error };
    },

    // Get category tree
    getTree: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) return { data: null, error };

      // Build tree structure
      const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
          .filter(item => item.parent_id === parentId)
          .map(item => ({
            ...item,
            children: buildTree(items, item.id),
          }));
      };

      const tree = buildTree(data);
      return { data: tree, error: null };
    },

    // Create category
    create: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();
      return { data, error };
    },
  },

  // User operations
  users: {
    // Get all users
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          floor:floors(name)
        `)
        .order('name');
      return { data, error };
    },

    // Get user by ID
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          floor:floors(name)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },

    // Create user
    create: async (userData: any) => {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      return { data, error };
    },

    // Update user
    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  // Floor operations
  floors: {
    // Get all floors
    getAll: async () => {
      const { data, error } = await supabase
        .from('floors')
        .select('*')
        .order('name');
      return { data, error };
    },

    // Get floor with performance metrics
    getWithMetrics: async (floorId: string, dateRange?: any) => {
      let query = supabase
        .from('customers')
        .select('*')
        .eq('floor_id', floorId);

      if (dateRange) {
        query = query.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
      }

      const { data, error } = await query;
      return { data, error };
    },
  },

  // Analytics operations
  analytics: {
    // Get dashboard metrics
    getDashboardMetrics: async (dateRange?: any) => {
      // Get total customers
      let customerQuery = supabase
        .from('customers')
        .select('*', { count: 'exact' });

      if (dateRange) {
        customerQuery = customerQuery.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
      }

      const { count: totalCustomers, error: customerError } = await customerQuery;

      // Get floor performance
      const { data: floorPerformance, error: floorError } = await supabase
        .from('customers')
        .select(`
          floor_id,
          floors(name)
        `);

      return {
        data: {
          totalCustomers,
          floorPerformance,
        },
        error: customerError || floorError,
      };
    },

    // Get sales analytics
    getSalesAnalytics: async (dateRange?: any) => {
      let query = supabase
        .from('sales')
        .select(`
          *,
          customer:customers(name),
          product:products(name),
          floor:floors(name)
        `);

      if (dateRange) {
        query = query.gte('sale_date', dateRange.start).lte('sale_date', dateRange.end);
      }

      const { data, error } = await query;
      return { data, error };
    },
  },
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to customer changes
  subscribeToCustomers: (callback: (payload: any) => void) => {
    return supabase
      .channel('customers')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'customers',
      }, callback)
      .subscribe();
  },

  // Subscribe to product changes
  subscribeToProducts: (callback: (payload: any) => void) => {
    return supabase
      .channel('products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
      }, callback)
      .subscribe();
  },

  // Subscribe to sales changes
  subscribeToSales: (callback: (payload: any) => void) => {
    return supabase
      .channel('sales')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sales',
      }, callback)
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel);
  },
};

// Storage helpers
export const storage = {
  // Upload file
  upload: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  // Get public URL
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file
  delete: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { error };
  },
};

export default supabase; 