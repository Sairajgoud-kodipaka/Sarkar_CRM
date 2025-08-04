'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  customers: {
    total: number;
    active: number;
    inactive: number;
    prospect: number;
    converted: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    totalValue: number;
    averagePrice: number;
  };
  sales: {
    total: number;
    completed: number;
    pending: number;
    totalRevenue: number;
    averageSale: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all APIs
      const [customersRes, productsRes, salesRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/products'),
        fetch('/api/sales')
      ]);

      const customersData = await customersRes.json();
      const productsData = await productsRes.json();
      const salesData = await salesRes.json();

      if (customersData.success && productsData.success && salesData.success) {
        setStats({
          customers: customersData.stats || { total: 0, active: 0, inactive: 0, prospect: 0, converted: 0 },
          products: productsData.stats || { total: 0, active: 0, inactive: 0, totalValue: 0, averagePrice: 0 },
          sales: salesData.stats || { total: 0, completed: 0, pending: 0, totalRevenue: 0, averageSale: 0 }
        });
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage error={error} onRetry={fetchDashboardData} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Admin Dashboard"
          description="Overview of your jewelry business performance"
          breadcrumbs={false}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Button 
            onClick={() => window.location.href = '/admin/customers/new'} 
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="h-6 w-6" />
            <span>Add Customer</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/products'} 
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <ShoppingBag className="h-6 w-6" />
            <span>View Products</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/sales'} 
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <DollarSign className="h-6 w-6" />
            <span>View Sales</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin/customers'} 
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Users className="h-6 w-6" />
            <span>View Customers</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Customers Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.customers.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.customers.active || 0} active, {stats?.customers.prospect || 0} prospects
              </p>
            </CardContent>
          </Card>

          {/* Products Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.products.active || 0} active products
              </p>
            </CardContent>
          </Card>

          {/* Sales Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.sales.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.sales.completed || 0} completed
              </p>
            </CardContent>
          </Card>

          {/* Revenue Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(stats?.sales.totalRevenue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg: ₹{(stats?.sales.averageSale || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Customers
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/customers'}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
              <CardDescription>Latest customer additions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Added 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Added 3 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bob Johnson</p>
                    <p className="text-xs text-muted-foreground">Added 5 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Sales
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/sales'}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
              <CardDescription>Latest sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Diamond Ring Sale</p>
                    <p className="text-xs text-muted-foreground">₹2,500 - 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sapphire Necklace</p>
                    <p className="text-xs text-muted-foreground">₹1,200 - 3 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Emerald Earrings</p>
                    <p className="text-xs text-muted-foreground">₹1,800 - 5 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 