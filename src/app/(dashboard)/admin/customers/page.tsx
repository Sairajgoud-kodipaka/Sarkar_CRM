'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  UserPlus,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  incomeRange?: string;
  socialCircle?: string;
  occasions?: string[];
  budgetRange?: string;
  notes?: string;
  status: string;
  createdAt: string;
  floor?: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
}

interface CustomerStats {
  total: number;
  active: number;
  prospect: number;
  converted: number;
  recentAdditions: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [showEditCustomerDialog, setShowEditCustomerDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [floors, setFloors] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    incomeRange: '',
    socialCircle: '',
    occasions: [] as string[],
    budgetRange: '',
    notes: '',
    status: 'ACTIVE',
    floorId: '',
    assignedToId: ''
  });

  useEffect(() => {
    loadCustomersData();
    loadFormData();
  }, []);

  const loadCustomersData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterFloor !== 'all') params.append('floorId', filterFloor);
      
      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setCustomers(data.data || []);
        calculateStats(data.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [floorsRes, usersRes] = await Promise.all([
        fetch('/api/floors'),
        fetch('/api/users')
      ]);

      const floorsData = await floorsRes.json();
      const usersData = await usersRes.json();

      if (floorsRes.ok) setFloors(floorsData.data || []);
      if (usersRes.ok) setUsers(usersData.data || []);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const calculateStats = (customersData: Customer[]) => {
    const stats: CustomerStats = {
      total: customersData.length,
      active: customersData.filter(c => c.status === 'ACTIVE').length,
      prospect: customersData.filter(c => c.status === 'PROSPECT').length,
      converted: customersData.filter(c => c.status === 'CONVERTED').length,
      recentAdditions: customersData.filter(c => {
        const createdAt = new Date(c.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length
    };
    setStats(stats);
  };

  const handleNewCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCustomer,
          storeId: 'store-001'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
        setShowNewCustomerDialog(false);
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          dateOfBirth: '',
          gender: '',
          occupation: '',
          incomeRange: '',
          socialCircle: '',
          occasions: [],
          budgetRange: '',
          notes: '',
          status: 'ACTIVE',
          floorId: '',
          assignedToId: ''
        });
        loadCustomersData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
        setShowEditCustomerDialog(false);
        setSelectedCustomer(null);
        loadCustomersData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        });
        loadCustomersData();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      dateOfBirth: customer.dateOfBirth || '',
      gender: customer.gender || '',
      occupation: customer.occupation || '',
      incomeRange: customer.incomeRange || '',
      socialCircle: customer.socialCircle || '',
      occasions: customer.occasions || [],
      budgetRange: customer.budgetRange || '',
      notes: customer.notes || '',
      status: customer.status,
      floorId: customer.floor?.id || '',
      assignedToId: customer.assignedTo?.id || ''
    });
    setShowEditCustomerDialog(true);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesFloor = filterFloor === 'all' || customer.floor?.id === filterFloor;
    
    return matchesSearch && matchesStatus && matchesFloor;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600">Manage all customer relationships and interactions</p>
          </div>
          <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter customer details to add them to the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      value={newCustomer.pincode}
                      onChange={(e) => setNewCustomer({...newCustomer, pincode: e.target.value})}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={newCustomer.dateOfBirth}
                      onChange={(e) => setNewCustomer({...newCustomer, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={newCustomer.gender} onValueChange={(value) => setNewCustomer({...newCustomer, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Occupation</Label>
                    <Input
                      value={newCustomer.occupation}
                      onChange={(e) => setNewCustomer({...newCustomer, occupation: e.target.value})}
                      placeholder="Occupation"
                    />
                  </div>
                  <div>
                    <Label>Income Range</Label>
                    <Select value={newCustomer.incomeRange} onValueChange={(value) => setNewCustomer({...newCustomer, incomeRange: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-300000">₹0 - ₹3,00,000</SelectItem>
                        <SelectItem value="300000-500000">₹3,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="500000-1000000">₹5,00,000 - ₹10,00,000</SelectItem>
                        <SelectItem value="1000000+">₹10,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Budget Range</Label>
                  <Select value={newCustomer.budgetRange} onValueChange={(value) => setNewCustomer({...newCustomer, budgetRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000-30000">₹10,000 - ₹30,000</SelectItem>
                      <SelectItem value="30000-80000">₹30,000 - ₹80,000</SelectItem>
                      <SelectItem value="80000-150000">₹80,000 - ₹1,50,000</SelectItem>
                      <SelectItem value="150000+">₹1,50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assigned Floor</Label>
                    <Select value={newCustomer.floorId} onValueChange={(value) => setNewCustomer({...newCustomer, floorId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                      <SelectContent>
                        {floors.map((floor: any) => (
                          <SelectItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <Select value={newCustomer.assignedToId} onValueChange={(value) => setNewCustomer({...newCustomer, assignedToId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNewCustomer}>
                    Add Customer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Active customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prospects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.prospect}</div>
                <p className="text-xs text-muted-foreground">Potential customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Converted</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.converted}</div>
                <p className="text-xs text-muted-foreground">Converted customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentAdditions}</div>
                <p className="text-xs text-muted-foreground">Added this week</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, phone, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterFloor} onValueChange={setFilterFloor}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map((floor: any) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadCustomersData}>
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Manage customer information and relationships</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading customers...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.occupation}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.city && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {customer.city}, {customer.state}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.floor?.name || '-'}
                      </TableCell>
                      <TableCell>
                        {customer.assignedTo?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No customers found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Customer Dialog */}
        <Dialog open={showEditCustomerDialog} onOpenChange={setShowEditCustomerDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Update customer information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Same form fields as new customer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              {/* Add all other fields similar to new customer form */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditCustomerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCustomer}>
                  Update Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 