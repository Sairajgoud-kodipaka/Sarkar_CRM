'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useFloors } from '@/hooks/useRealData';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminFloors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Real data hooks
  const { 
    data: floorsResponse, 
    loading, 
    error, 
    refetch 
  } = useFloors({ search: searchQuery, status: statusFilter, limit: 50 });

  const floors = floorsResponse?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = () => {
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading floors..." />
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
          title="Floor Management"
          description="Manage store floors and their performance"
          breadcrumbs={true}
          actions={[
            {
              label: 'Add Floor',
              icon: Plus,
              onClick: () => console.log('Add floor'),
              variant: 'default'
            }
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Floors</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floors.length}</div>
              <p className="text-xs text-muted-foreground">
                Store floors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Floors</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {floors.filter(f => f.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((floors.filter(f => f.is_active).length / floors.length) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {floors.reduce((sum, floor) => sum + (floor.staff_count || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all floors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(floors.reduce((sum, floor) => sum + (floor.total_sales || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Floors</CardTitle>
            <CardDescription>
              Showing {floors.length} floors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search floors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Floors Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Floor</th>
                    <th className="text-left p-2 font-medium">Staff</th>
                    <th className="text-left p-2 font-medium">Customers</th>
                    <th className="text-left p-2 font-medium">Sales</th>
                    <th className="text-left p-2 font-medium">Performance</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {floors.map((floor) => (
                    <tr key={floor.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{floor.name}</div>
                            <div className="text-sm text-gray-500">Floor {floor.number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {floor.staff_count || 0}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">{floor.customer_count || 0}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm font-medium">
                          {formatCurrency(floor.total_sales || 0)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">{floor.performance || 0}%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(floor.is_active ? 'ACTIVE' : 'INACTIVE')}>
                          {floor.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 