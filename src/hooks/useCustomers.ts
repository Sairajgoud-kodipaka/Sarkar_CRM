import { useState, useEffect, useCallback } from 'react';
import { Customer, CreateCustomerInput, UpdateCustomerInput, CustomerFilters } from '@/types/customer';

interface UseCustomersOptions {
  autoFetch?: boolean;
  initialFilters?: CustomerFilters;
  pageSize?: number;
}

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useCustomers(options: UseCustomersOptions = {}) {
  const {
    autoFetch = true,
    initialFilters = {},
    pageSize = 20,
  } = options;

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    pages: 0,
  });

  // Fetch customers
  const fetchCustomers = useCallback(async (
    newFilters?: CustomerFilters,
    page = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', page.toString());
      queryParams.append('limit', pageSize.toString());
      
      // Add filters
      const currentFilters = newFilters || filters;
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      if (currentFilters.status) queryParams.append('status', currentFilters.status);
      if (currentFilters.floorId) queryParams.append('floorId', currentFilters.floorId);
      if (currentFilters.assignedToId) queryParams.append('assignedToId', currentFilters.assignedToId);
      if (currentFilters.dateFrom) queryParams.append('dateFrom', currentFilters.dateFrom.toISOString());
      if (currentFilters.dateTo) queryParams.append('dateTo', currentFilters.dateTo.toISOString());

      const response = await fetch(`/api/customers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: Customer[]; pagination: any } = await response.json();
      
      if (data.success) {
        setCustomers(data.data);
        setPagination(data.pagination);
        if (newFilters) {
          setFilters(newFilters);
        }
      } else {
        throw new Error('Failed to fetch customers');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize]);

  // Create customer
  const createCustomer = useCallback(async (customerData: CreateCustomerInput): Promise<Customer | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: Customer; message: string } = await response.json();
      
      if (data.success) {
        // Add new customer to the list
        setCustomers(prev => [data.data, ...prev]);
        return data.data;
      } else {
        throw new Error('Failed to create customer');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
      console.error('Error creating customer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer
  const updateCustomer = useCallback(async (id: string, customerData: UpdateCustomerInput): Promise<Customer | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: Customer; message: string } = await response.json();
      
      if (data.success) {
        // Update customer in the list
        setCustomers(prev => prev.map(customer => 
          customer.id === id ? data.data : customer
        ));
        return data.data;
      } else {
        throw new Error('Failed to update customer');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to update customer');
      console.error('Error updating customer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete customer
  const deleteCustomer = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; message: string } = await response.json();
      
      if (data.success) {
        // Remove customer from the list
        setCustomers(prev => prev.filter(customer => customer.id !== id));
        return true;
      } else {
        throw new Error('Failed to delete customer');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to delete customer');
      console.error('Error deleting customer:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search customers
  const searchCustomers = useCallback(async (query: string): Promise<Customer[]> => {
    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { success: boolean; data: Customer[] } = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error('Failed to search customers');
      }

    } catch (err: any) {
      console.error('Error searching customers:', err);
      return [];
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: CustomerFilters) => {
    setFilters(newFilters);
    fetchCustomers(newFilters, 1);
  }, [fetchCustomers]);

  // Change page
  const changePage = useCallback((page: number) => {
    fetchCustomers(filters, page);
  }, [fetchCustomers, filters]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCustomers();
    }
  }, [autoFetch, fetchCustomers]);

  return {
    // State
    customers,
    loading,
    error,
    filters,
    pagination,
    
    // Actions
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    applyFilters,
    changePage,
    clearError,
    
    // Computed
    hasCustomers: customers.length > 0,
    totalCustomers: pagination.total,
  };
} 