'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Calendar, 
  Star,
  ShoppingCart,
  UserCheck,
  Award,
  Activity
} from 'lucide-react';

// Mock data for salesperson dashboard
const mockSalespersonData = {
  id: 'SP001',
  name: 'Sarah Johnson',
  floor: 'Floor 2',
  role: 'SALESPERSON',
  stats: {
    totalSales: 45,
    totalRevenue: 125000,
    monthlyTarget: 150000,
    customersServed: 23,
    averageRating: 4.8,
    salesThisWeek: 12,
    salesThisMonth: 28
  },
  recentSales: [
    {
      id: 'SALE-001',
      customerName: 'John Smith',
      amount: 2500,
      product: 'Diamond Ring',
      date: '2024-12-15T14:30:00Z',
      status: 'COMPLETED'
    },
    {
      id: 'SALE-002',
      customerName: 'Emma Wilson',
      amount: 1800,
      product: 'Gold Necklace',
      date: '2024-12-15T11:20:00Z',
      status: 'COMPLETED'
    },
    {
      id: 'SALE-003',
      customerName: 'Michael Brown',
      amount: 3200,
      product: 'Platinum Watch',
      date: '2024-12-14T16:45:00Z',
      status: 'COMPLETED'
    }
  ],
  recentCustomers: [
    {
      id: 'CUST-001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      lastVisit: '2024-12-15T14:30:00Z',
      totalSpent: 2500,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-002',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1234567891',
      lastVisit: '2024-12-15T11:20:00Z',
      totalSpent: 1800,
      status: 'ACTIVE'
    },
    {
      id: 'CUST-003',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1234567892',
      lastVisit: '2024-12-14T16:45:00Z',
      totalSpent: 3200,
      status: 'ACTIVE'
    }
  ],
  performance: {
    weeklyGoal: 15,
    weeklyAchieved: 12,
    monthlyGoal: 35,
    monthlyAchieved: 28,
    customerSatisfaction: 4.8,
    averageTransactionValue: 2778
  }
};

export default function SalespersonDashboard() {
  const { user } = useAuth();
  const [salespersonData, setSalespersonData] = useState(mockSalespersonData);

  // Calculate progress percentages
  const weeklyProgress = (salespersonData.performance.weeklyAchieved / salespersonData.performance.weeklyGoal) * 100;
  const monthlyProgress = (salespersonData.performance.monthlyAchieved / salespersonData.performance.monthlyGoal) * 100;
  const targetProgress = (salespersonData.stats.totalRevenue / salespersonData.stats.monthlyTarget) * 100;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      COMPLETED: { variant: 'default', color: 'text-green-600' },
      PENDING: { variant: 'secondary', color: 'text-orange-600' },
      CANCELLED: { variant: 'destructive', color: 'text-red-600' },
      ACTIVE: { variant: 'default', color: 'text-green-600' },
      INACTIVE: { variant: 'secondary', color: 'text-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.COMPLETED;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Sales Dashboard"
        description={`Welcome back, ${salespersonData.name}! Track your performance and recent activities.`}
        breadcrumbs={true}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Schedule
            </Button>
            <Button className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Record Sale
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salespersonData.stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              +{salespersonData.stats.salesThisWeek} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salespersonData.stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${salespersonData.performance.averageTransactionValue.toLocaleString()} avg per sale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salespersonData.stats.customersServed}</div>
            <p className="text-xs text-muted-foreground">
              +{salespersonData.stats.salesThisMonth} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salespersonData.stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Weekly Goal Progress</CardTitle>
            <CardDescription>
              Sales target: {salespersonData.performance.weeklyGoal}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Achieved: {salespersonData.performance.weeklyAchieved}</span>
              <span className="text-sm text-muted-foreground">{weeklyProgress.toFixed(1)}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Goal Progress</CardTitle>
            <CardDescription>
              Sales target: {salespersonData.performance.monthlyGoal}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Achieved: {salespersonData.performance.monthlyAchieved}</span>
              <span className="text-sm text-muted-foreground">{monthlyProgress.toFixed(1)}%</span>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue Target</CardTitle>
            <CardDescription>
              Target: ${salespersonData.stats.monthlyTarget.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Achieved: ${salespersonData.stats.totalRevenue.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">{targetProgress.toFixed(1)}%</span>
            </div>
            <Progress value={targetProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recent Sales
            </CardTitle>
            <CardDescription>
              Your latest sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salespersonData.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-sm text-muted-foreground">{sale.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${sale.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Recent Customers
            </CardTitle>
            <CardDescription>
              Customers you've served recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salespersonData.recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(customer.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sales History
          </CardTitle>
          <CardDescription>
            Detailed view of your sales transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salespersonData.recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>${sale.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sale.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 