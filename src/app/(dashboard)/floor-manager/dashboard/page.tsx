'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useCustomers, useProducts, useSales } from '@/hooks/useRealData';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Star,
  Eye,
  Plus,
  RefreshCw,
  Building,
  UserCheck,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function FloorManagerDashboard() {
  const [currentFloor] = useState('Floor 1'); // In real app, get from auth context
  const [timeRange, setTimeRange] = useState('today');

  // Real data hooks
  const { data: customersResponse, loading: customersLoading, error: customersError } = useCustomers({ limit: 10 });
  const { data: productsResponse, loading: productsLoading, error: productsError } = useProducts({ limit: 10 });
  const { data: salesResponse, loading: salesLoading, error: salesError } = useSales({ limit: 10 });

  const customers = customersResponse || [];
  const products = productsResponse || [];
  const sales = salesResponse || [];

  const loading = customersLoading || productsLoading || salesLoading;
  const error = customersError || productsError || salesError;

  // Mock floor-specific data
  const floorStats = {
    staffOnDuty: 4,
    totalStaff: 6,
    activeCustomers: customers.filter((c: any) => c.status === 'ACTIVE').length,
    pendingApprovals: 3,
    floorPerformance: 87,
    inventoryAlerts: 2,
    todayVisitors: 12,
    conversionRate: 68
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading floor manager dashboard..." />
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
      <div className="p-6">
        <PageHeader
          title="Floor Manager Dashboard"
          description="Monitor your floor's performance and manage operations"
          breadcrumbs={true}
          actions={
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/floor-manager/customers'}>
                <Users className="h-4 w-4 mr-2" />
                Manage Customers
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/floor-manager/approvals'}>
                <CheckCircle className="h-4 w-4 mr-2" />
                View Approvals
              </Button>
            </div>
          }
        />

        {/* Floor-Specific Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floorStats.staffOnDuty}/{floorStats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+1</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floorStats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {floorStats.todayVisitors} visitors today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floorStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Require your attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Floor Performance</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floorStats.floorPerformance}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Floor Operations Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Staff Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Management
              </CardTitle>
              <CardDescription>
                Current floor staff status and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">On Duty</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {floorStats.staffOnDuty} Staff
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">On Break</span>
                  <Badge variant="outline">2 Staff</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Off Duty</span>
                  <Badge variant="outline">0 Staff</Badge>
                </div>
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Customer Activity
              </CardTitle>
              <CardDescription>
                Real-time customer interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Currently Shopping</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {floorStats.activeCustomers} Customers
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge variant="outline">{floorStats.conversionRate}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Visitors</span>
                  <Badge variant="outline">{floorStats.todayVisitors}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>
                Products requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Stock</span>
                  <Badge variant="destructive">{floorStats.inventoryAlerts} Items</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out of Stock</span>
                  <Badge variant="outline">0 Items</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expiring Soon</span>
                  <Badge variant="outline">1 Item</Badge>
                </div>
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Alerts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Floor Sales</CardTitle>
              <CardDescription>
                Latest transactions on your floor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {sale.customer?.name || 'Customer'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sale.product?.name || 'Product'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(sale.total_amount || 0)}
                      </div>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View All Sales
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Floor Management Actions</CardTitle>
              <CardDescription>
                Common tasks for floor operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Manage Staff</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <ShoppingCart className="h-5 w-5 mb-1" />
                  <span className="text-xs">Record Sale</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Package className="h-5 w-5 mb-1" />
                  <span className="text-xs">Check Inventory</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <AlertCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">View Alerts</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Schedule</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Target className="h-5 w-5 mb-1" />
                  <span className="text-xs">Performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 