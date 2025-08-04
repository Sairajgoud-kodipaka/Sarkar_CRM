import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

export interface AnalyticsData {
  dashboard?: {
    totalSales: number;
    totalCustomers: number;
    totalProducts: number;
    totalRevenue: number;
    salesGrowth: number;
    customerGrowth: number;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
    recentSales: Array<{
      id: string;
      customerName: string;
      productName: string;
      amount: number;
      date: string;
    }>;
  };
  sales?: {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByMonth: Array<{
      month: string;
      sales: number;
      revenue: number;
    }>;
    salesByCategory: Array<{
      category: string;
      sales: number;
      revenue: number;
    }>;
    topCustomers: Array<{
      name: string;
      totalSpent: number;
      orders: number;
    }>;
  };
  customers?: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    customersByStatus: Array<{
      status: string;
      count: number;
    }>;
    customersByFloor: Array<{
      floor: string;
      count: number;
    }>;
    customerGrowth: Array<{
      month: string;
      newCustomers: number;
      totalCustomers: number;
    }>;
  };
  products?: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    productsByCategory: Array<{
      category: string;
      count: number;
    }>;
    topSellingProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
    productPerformance: Array<{
      name: string;
      price: number;
      sales: number;
      revenue: number;
    }>;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (type: string, params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getAnalytics(type, params) as AnalyticsResponse;

      setAnalytics(prev => ({
        ...prev,
        [type]: response.data[type as keyof AnalyticsData]
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${type} analytics`);
      console.error(`Error fetching ${type} analytics:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardAnalytics = async (params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    await fetchAnalytics('dashboard', params);
  };

  const fetchSalesAnalytics = async (params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    await fetchAnalytics('sales', params);
  };

  const fetchCustomerAnalytics = async (params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    await fetchAnalytics('customers', params);
  };

  const fetchProductAnalytics = async (params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    await fetchAnalytics('products', params);
  };

  // Load dashboard analytics on mount
  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    fetchDashboardAnalytics,
    fetchSalesAnalytics,
    fetchCustomerAnalytics,
    fetchProductAnalytics,
  };
} 