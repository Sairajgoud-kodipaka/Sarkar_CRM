'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  Download,
  Upload,
  RefreshCw,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

// Mock data for floor-specific customers
const mockFloorCustomers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    status: 'active',
    lastVisit: '2024-01-15',
    totalPurchases: 45000,
    followUpDate: '2024-01-20',
    assignedTo: 'Priya Patel',
    priority: 'high',
    visitCount: 5,
    avgSpend: 9000,
  },
  {
    id: 2,
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.patel@email.com',
    status: 'pending',
    lastVisit: '2024-01-10',
    totalPurchases: 0,
    followUpDate: '2024-01-18',
    assignedTo: 'Amit Kumar',
    priority: 'medium',
    visitCount: 2,
    avgSpend: 0,
  },
  {
    id: 3,
    name: 'Amit Kumar',
    phone: '+91 76543 21098',
    email: 'amit.kumar@email.com',
    status: 'active',
    lastVisit: '2024-01-12',
    totalPurchases: 125000,
    followUpDate: '2024-01-25',
    assignedTo: 'Priya Patel',
    priority: 'high',
    visitCount: 8,
    avgSpend: 15625,
  },
  {
    id: 4,
    name: 'Neha Singh',
    phone: '+91 65432 10987',
    email: 'neha.singh@email.com',
    status: 'inactive',
    lastVisit: '2023-12-20',
    totalPurchases: 78000,
    followUpDate: null,
    assignedTo: 'Rajesh Verma',
    priority: 'low',
    visitCount: 3,
    avgSpend: 26000,
  },
  {
    id: 5,
    name: 'Rajesh Verma',
    phone: '+91 54321 09876',
    email: 'rajesh.verma@email.com',
    status: 'active',
    lastVisit: '2024-01-14',
    totalPurchases: 92000,
    followUpDate: '2024-01-22',
    assignedTo: 'Amit Kumar',
    priority: 'medium',
    visitCount: 6,
    avgSpend: 15333,
  },
];

export default function FloorManagerCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [customers, setCustomers] = useState(mockFloorCustomers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic
    console.log('Search query:', query);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-100 text-success-700">Active</Badge>;
      case 'pending':
        return <Badge className="bg-warning-100 text-warning-700">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-error-100 text-error-700">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-error-100 text-error-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning-100 text-warning-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-success-100 text-success-700">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout
      userRole="FLOOR_MANAGER"
      userFloor="Floor 1"
      searchPlaceholder="Search customers by name, email, or phone..."
      onSearch={handleSearch}
    >
      <PageHeader
        title="Floor 1 Customers"
        description="Manage customers assigned to Floor 1 - Gold & Diamond"
        breadcrumbs={true}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Link href="/floor-manager/customers/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </div>
        }
      />

      {/* Floor-specific Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Floor Customers</p>
                <p className="text-2xl font-bold text-navy-900">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Active Customers</p>
                <p className="text-2xl font-bold text-navy-900">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Pending Follow-ups</p>
                <p className="text-2xl font-bold text-navy-900">
                  {customers.filter(c => c.followUpDate && new Date(c.followUpDate) <= new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Floor Revenue</p>
                <p className="text-2xl font-bold text-navy-900">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalPurchases, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-navy-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Actions</label>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Floor 1 Customer List</CardTitle>
              <CardDescription>
                Showing {filteredCustomers.length} of {customers.length} customers
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary-50 text-primary-700">
                Floor 1 - Gold & Diamond
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-navy-900">{customer.name}</p>
                        <p className="text-sm text-navy-600">ID: {customer.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3 text-navy-400" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3 text-navy-400" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(customer.priority)}
                    </TableCell>
                    <TableCell>
                      {formatDate(customer.lastVisit)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-navy-900">
                        {formatCurrency(customer.totalPurchases)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {customer.followUpDate ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3 text-navy-400" />
                          {formatDate(customer.followUpDate)}
                        </div>
                      ) : (
                        <span className="text-navy-400">No follow-up</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-navy-600">{customer.assignedTo}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3 text-navy-400" />
                          {customer.visitCount} visits
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="mr-1 h-3 w-3 text-navy-400" />
                          {formatCurrency(customer.avgSpend)} avg
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Follow-up
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-error-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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