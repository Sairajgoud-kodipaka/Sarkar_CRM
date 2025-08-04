import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  status: 'ACTIVE' | 'PROSPECT' | 'CONVERTED';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  storeId?: string;
  floorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchCustomers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    floor?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getCustomers({
        page: params?.page || page,
        limit: params?.limit || limit,
        search: params?.search,
        status: params?.status,
        floor: params?.floor,
      }) as CustomersResponse;

      setCustomers(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.createCustomer(customerData);
      
      // Refresh the customers list
      await fetchCustomers();
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      console.error('Error creating customer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.updateCustomer(id, customerData) as any;
      
      // Update the customer in the local state
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...response.data } : customer
      ));
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      console.error('Error updating customer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await ApiClient.deleteCustomer(id);
      
      // Remove the customer from the local state
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
      console.error('Error deleting customer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    total,
    page,
    limit,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
} 