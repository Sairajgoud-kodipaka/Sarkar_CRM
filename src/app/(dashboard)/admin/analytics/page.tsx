'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAnalytics } from '@/hooks/useRealData';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  Eye,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Type definitions
interface AnalyticsData {
  sales?: {
    salesByMonth?: Array<{ month: string; sales: number }>;
    totalRevenue?: number;
    totalSales?: number;
    topCustomers?: Array<{ name: string; orders: number; totalSpent: number }>;
  };
  products?: {
    productsByCategory?: Array<{ category: string; count: number }>;
    topSellingProducts?: Array<{ name: string; sales: number; revenue: number }>;
  };
  customers?: {
    totalCustomers?: number;
    customerGrowth?: Array<{ month: string; newCustomers: number }>;
  };
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState('month');
  const [chartType, setChartType] = useState('line');

  // Real data hooks
  const { data: analytics, loading, error, refetch } = useAnalytics('dashboard');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Process real data
  const salesData = (analytics as AnalyticsData)?.sales?.salesByMonth || [];
  const pieData: PieDataItem[] = (analytics as AnalyticsData)?.products?.productsByCategory?.map((cat: { category: string; count: number }) => ({
    name: cat.category,
    value: cat.count,
    color: getCategoryColor(cat.category)
  })) || [];

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency((analytics as AnalyticsData)?.sales?.totalRevenue || 0),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Total Customers',
      value: ((analytics as AnalyticsData)?.customers?.totalCustomers || 0).toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Products Sold',
      value: ((analytics as AnalyticsData)?.sales?.totalSales || 0).toString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
    },
    {
      title: 'Conversion Rate',
      value: '23.4%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Target,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gold': return '#FFD700';
      case 'diamond': return '#B9F2FF';
      case 'silver': return '#C0C0C0';
      case 'platinum': return '#E5E4E2';
      default: return '#8884d8';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading analytics data..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage error={error} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your business performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs flex items-center mt-1 ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Monthly sales trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry: PieDataItem, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics as AnalyticsData)?.products?.topSellingProducts?.slice(0, 5).map((product: { name: string; sales: number; revenue: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sold</p>
                    </div>
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest spending customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics as AnalyticsData)?.sales?.topCustomers?.slice(0, 5).map((customer: { name: string; orders: number; totalSpent: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.orders} orders</p>
                    </div>
                    <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>Monthly customer acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={(analytics as AnalyticsData)?.customers?.customerGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="newCustomers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 