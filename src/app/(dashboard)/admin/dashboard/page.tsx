'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { MobileQuickActions } from '@/components/layout/mobile-nav';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Building2,
  Calendar,
  Clock,
  Bell,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  ChevronDown,
  AlertTriangle,
  Star,
  Target,
  Award,
  Clock4,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAnalytics, useCustomers, useSales, useProducts } from '@/hooks/useRealData';
import { toast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Real data hooks with enhanced error handling
  const { 
    data: analyticsData, 
    loading: analyticsLoading, 
    error: analyticsError,
    retry: retryAnalytics
  } = useAnalytics('dashboard');
  
  const { 
    data: customers, 
    loading: customersLoading, 
    error: customersError,
    retry: retryCustomers
  } = useCustomers({ limit: 10 });
  
  const { 
    data: sales, 
    loading: salesLoading, 
    error: salesError,
    retry: retrySales
  } = useSales({ limit: 10 });
  
  const { 
    data: products, 
    loading: productsLoading, 
    error: productsError,
    retry: retryProducts
  } = useProducts({ limit: 10 });

  // Loading and error states
  const isLoading = analyticsLoading || customersLoading || salesLoading || productsLoading;
  const hasError = analyticsError || customersError || salesError || productsError;

  // Retry all data
  const retryAll = () => {
    retryAnalytics();
    retryCustomers();
    retrySales();
    retryProducts();
  };

  // Process real data
  const visitorMetrics = analyticsData?.visitorMetrics || {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    change: 0
  };

  const salesMetrics = analyticsData?.salesMetrics || {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    change: 0
  };

  const floorCustomers = analyticsData?.floorCustomers || {
    floor1: [],
    floor2: [],
    floor3: []
  };

  const salesChartData = analyticsData?.salesChart || [];
  const categoryData = analyticsData?.categoryData || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingBag className="h-4 w-4 text-green-500" />;
      case 'customer': return <Users className="h-4 w-4 text-blue-500" />;
      case 'product': return <Package className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Navigation handlers
  const handleCreateCustomer = () => {
    toast({
      title: "Navigating...",
      description: "Opening customer creation form",
    });
    router.push('/admin/customers/new');
  };

  const handleViewAllSales = () => {
    toast({
      title: "Navigating...",
      description: "Opening sales dashboard",
    });
    router.push('/admin/sales');
  };

  const handleManageProducts = () => {
    toast({
      title: "Navigating...",
      description: "Opening products management",
    });
    router.push('/admin/products');
  };

  const handleAddProduct = () => {
    toast({
      title: "Navigating...",
      description: "Opening product creation form",
    });
    router.push('/admin/products/new');
  };

  const handleExportReport = () => {
    toast({
      title: "Export Feature",
      description: "Export functionality coming soon!",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading dashboard data..." />
        </div>
      </DashboardLayout>
    );
  }

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage error={hasError} />
        </div>
      </DashboardLayout>
    );
  }

  // Mobile quick actions
  const mobileActions = [
    {
      label: 'Add Customer',
      icon: Users,
      onClick: handleCreateCustomer,
      color: 'bg-blue-500 text-white hover:bg-blue-600'
    },
    {
      label: 'View Sales',
      icon: DollarSign,
      onClick: handleViewAllSales,
      color: 'bg-green-500 text-white hover:bg-green-600'
    },
    {
      label: 'Manage Products',
      icon: Package,
      onClick: handleManageProducts,
      color: 'bg-purple-500 text-white hover:bg-purple-600'
    },
    {
      label: 'Add Product',
      icon: Plus,
      onClick: handleAddProduct,
      color: 'bg-orange-500 text-white hover:bg-orange-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={handleCreateCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorMetrics.today}</div>
              <p className="text-xs text-muted-foreground">
                <span className={visitorMetrics.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {visitorMetrics.change >= 0 ? '+' : ''}{visitorMetrics.change}%
                </span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesMetrics.today)}</div>
              <p className="text-xs text-muted-foreground">
                <span className={salesMetrics.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {salesMetrics.change >= 0 ? '+' : ''}{salesMetrics.change}%
                </span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active customers this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Available products
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleCreateCustomer}
              >
                <Users className="h-6 w-6" />
                <span>Create Customer</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleViewAllSales}
              >
                <DollarSign className="h-6 w-6" />
                <span>View All Sales</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleManageProducts}
              >
                <Package className="h-6 w-6" />
                <span>Manage Products</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleAddProduct}
              >
                <Plus className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales?.slice(0, 5).map((sale: any) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.customerName || 'Customer'}</p>
                      <p className="text-sm text-gray-600">{sale.productName || 'Product'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(sale.amount || 0)}</p>
                    <Badge variant={sale.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {sale.status || 'PENDING'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floor-wise Customer Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(floorCustomers).map(([floor, customers]: [string, any]) => (
            <Card key={floor}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  {floor.charAt(0).toUpperCase() + floor.slice(1)}
                </CardTitle>
                <CardDescription>{customers?.length || 0} customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers?.slice(0, 3).map((customer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-600">{customer.phone}</p>
                      </div>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Mobile Quick Actions */}
      <MobileQuickActions actions={mobileActions} />
    </DashboardLayout>
  );
} 