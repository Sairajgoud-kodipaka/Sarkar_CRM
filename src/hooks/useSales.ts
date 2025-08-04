import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

export interface Sale {
  id: string;
  customerId: string;
  productId: string;
  userId: string;
  quantity: number;
  total_amount: number;
  discount: number;
  status: string;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    price: number;
  };
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface SalesResponse {
  success: boolean;
  data: Sale[];
  total: number;
  page: number;
  limit: number;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchSales = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getSales({
        page: params?.page || page,
        limit: params?.limit || limit,
        search: params?.search,
        status: params?.status,
        floor: params?.floor,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      }) as SalesResponse;

      setSales(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.createSale(saleData);
      
      // Refresh the sales list
      await fetchSales();
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sale');
      console.error('Error creating sale:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.updateSale(id, saleData);
      
      // Update the sale in the local state
      setSales(prev => prev.map(sale => 
        sale.id === id ? { ...sale, ...response.data } : sale
      ));
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sale');
      console.error('Error updating sale:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await ApiClient.deleteSale(id);
      
      // Remove the sale from the local state
      setSales(prev => prev.filter(sale => sale.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sale');
      console.error('Error deleting sale:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load sales on mount
  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    total,
    page,
    limit,
    fetchSales,
    createSale,
    updateSale,
    deleteSale,
  };
} 