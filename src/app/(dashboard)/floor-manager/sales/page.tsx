'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { useAuth } from '@/contexts/auth-context';
import { WorkflowService } from '@/lib/workflow';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Package,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  ShoppingCart,
  Users,
  Target
} from 'lucide-react';

// Mock sales data for demonstration
const mockSales = [
  {
    id: '1',
    customer: {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 98765 43210'
    },
    amount: 75000,
    discount: 5,
    status: 'PENDING_APPROVAL',
    products: ['Gold Necklace', 'Diamond Ring'],
    notes: 'High-value customer, urgent sale',
    createdAt: '2024-12-15T10:30:00Z',
    approvalId: 'app_001'
  },
  {
    id: '2',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109'
    },
    amount: 35000,
    discount: 0,
    status: 'COMPLETED',
    products: ['Silver Bracelet'],
    notes: 'Regular customer',
    createdAt: '2024-12-15T09:15:00Z',
    completedAt: '2024-12-15T09:20:00Z'
  },
  {
    id: '3',
    customer: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 76543 21098'
    },
    amount: 45000,
    discount: 10,
    status: 'COMPLETED',
    products: ['Platinum Chain'],
    notes: 'VIP customer discount applied',
    createdAt: '2024-12-14T16:45:00Z',
    completedAt: '2024-12-14T16:50:00Z'
  }
];

// Mock customers for dropdown
const mockCustomers = [
  { id: '1', name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91 98765 43210' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 87654 32109' },
  { id: '3', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 76543 21098' },
  { id: '4', name: 'Neha Gupta', email: 'neha.gupta@email.com', phone: '+91 65432 10987' }
];

// Mock products for dropdown
const mockProducts = [
  { id: '1', name: 'Gold Necklace', price: 25000, category: 'Gold' },
  { id: '2', name: 'Diamond Ring', price: 50000, category: 'Diamond' },
  { id: '3', name: 'Silver Bracelet', price: 15000, category: 'Silver' },
  { id: '4', name: 'Platinum Chain', price: 45000, category: 'Platinum' },
  { id: '5', name: 'Ruby Earrings', price: 30000, category: 'Gemstone' }
];

const statusColors = {
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-gray-100 text-gray-800'
};

export default function FloorManagerSales() {
  const { user } = useAuth();
  const { createSaleWithWorkflow, getSales } = useWorkflowAPI();
  
  const [sales, setSales] = useState(mockSales);
  const [filteredSales, setFilteredSales] = useState(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddSaleDialogOpen, setIsAddSaleDialogOpen] = useState(false);
  const [isViewSaleDialogOpen, setIsViewSaleDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  
  // Form state for new sale
  const [saleForm, setSaleForm] = useState({
    customerId: '',
    products: [],
    amount: 0,
    discount: 0,
    notes: '',
    priority: 'MEDIUM'
  });

  // Load sales on component mount
  useEffect(() => {
    loadSales();
  }, []);

  // Filter sales based on search and filters
  useEffect(() => {
    let filtered = sales;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sale => 
        sale.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.products.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    setFilteredSales(filtered);
  }, [sales, searchQuery, statusFilter]);

  const loadSales = async () => {
    try {
      // In real implementation, this would call the API
      // const data = await getSales(user?.id, user?.floor);
      // setSales(data);
      console.log('Loading sales...');
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  const handleAddSale = async () => {
    try {
      const selectedCustomer = mockCustomers.find(c => c.id === saleForm.customerId);
      const selectedProducts = mockProducts.filter(p => saleForm.products.includes(p.id));
      
      const saleData = {
        customerId: saleForm.customerId,
        products: selectedProducts.map(p => p.id),
        amount: saleForm.amount,
        discount: saleForm.discount,
        notes: saleForm.notes,
        floorId: user?.floor || 'floor-1',
        userId: user?.id
      };

      // Check if approval is required
      const requiresApproval = WorkflowService.requiresApproval('SALE_CREATE', {
        amount: saleForm.amount,
        discount: saleForm.discount,
        customerId: saleForm.customerId,
        products: selectedProducts
      });

      if (requiresApproval) {
        // Create sale with workflow approval
        const result = await createSaleWithWorkflow(saleData, user?.id);
        
        // Add to local state with pending status
        const newSale = {
          id: result.data.approvalId,
          customer: selectedCustomer,
          amount: saleForm.amount,
          discount: saleForm.discount,
          status: 'PENDING_APPROVAL',
          products: selectedProducts.map(p => p.name),
          notes: saleForm.notes,
          createdAt: new Date().toISOString(),
          approvalId: result.data.approvalId
        };
        
        setSales(prev => [newSale, ...prev]);
      } else {
        // Create sale directly
        const result = await createSaleWithWorkflow(saleData, user?.id);
        
        // Add to local state with completed status
        const newSale = {
          id: result.data.id,
          customer: selectedCustomer,
          amount: saleForm.amount,
          discount: saleForm.discount,
          status: 'COMPLETED',
          products: selectedProducts.map(p => p.name),
          notes: saleForm.notes,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        };
        
        setSales(prev => [newSale, ...prev]);
      }

      // Reset form and close dialog
      setSaleForm({
        customerId: '',
        products: [],
        amount: 0,
        discount: 0,
        notes: '',
        priority: 'MEDIUM'
      });
      setIsAddSaleDialogOpen(false);
      
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const openViewSaleDialog = (sale: any) => {
    setSelectedSale(sale);
    setIsViewSaleDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <AlertCircle className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateTotalAmount = () => {
    const selectedProducts = mockProducts.filter(p => saleForm.products.includes(p.id));
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const discountAmount = (subtotal * saleForm.discount) / 100;
    return subtotal - discountAmount;
  };

  const pendingCount = sales.filter(s => s.status === 'PENDING_APPROVAL').length;
  const completedCount = sales.filter(s => s.status === 'COMPLETED').length;
  const totalRevenue = sales.filter(s => s.status === 'COMPLETED').reduce((sum, s) => sum + s.amount, 0);

  return (
    <DashboardLayout userRole="FLOOR_MANAGER" userFloor={user?.floor || "Floor 1"}>
      <PageHeader
        title="Sales Management"
        description="Record and manage sales for your floor"
        breadcrumbs={true}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Sales
            </Button>
            <Button size="sm" onClick={() => setIsAddSaleDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record Sale
            </Button>
          </div>
        }
      />

      {/* Sales Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {completedCount > 0 ? formatCurrency(totalRevenue / completedCount) : '₹0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadSales}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
          <CardDescription>
            View and manage all sales for your floor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${sale.customer.name.toLowerCase().replace(' ', '-')}.jpg`} />
                        <AvatarFallback>{sale.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{sale.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{sale.customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium">
                        {sale.products.join(', ')}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{formatCurrency(sale.amount)}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {sale.discount > 0 ? `${sale.discount}%` : 'No discount'}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={statusColors[sale.status]}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(sale.status)}
                        <span>{sale.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(sale.createdAt)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewSaleDialog(sale)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {sale.status === 'PENDING_APPROVAL' && (
                        <Badge variant="outline" className="text-yellow-600">
                          <Clock className="mr-1 h-3 w-3" />
                          Awaiting Approval
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSales.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sales found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Sale Dialog */}
      <Dialog open={isAddSaleDialogOpen} onOpenChange={setIsAddSaleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Sale</DialogTitle>
            <DialogDescription>
              Create a new sale record. High-value sales may require approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Customer Selection */}
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={saleForm.customerId} onValueChange={(value) => setSaleForm(prev => ({ ...prev, customerId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Selection */}
            <div>
              <Label htmlFor="products">Products</Label>
              <Select 
                value={saleForm.products[0] || ''} 
                onValueChange={(value) => setSaleForm(prev => ({ ...prev, products: [value] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select products" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={saleForm.discount}
                  onChange={(e) => setSaleForm(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter discount"
                  max="100"
                />
              </div>
            </div>

            {/* Total Amount Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(calculateTotalAmount())}
                </span>
              </div>
              
              {/* Approval Warning */}
              {WorkflowService.requiresApproval('SALE_CREATE', {
                amount: saleForm.amount,
                discount: saleForm.discount,
                customerId: saleForm.customerId,
                products: mockProducts.filter(p => saleForm.products.includes(p.id))
              }) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      This sale requires Business Admin approval due to high value or discount
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={saleForm.notes}
                onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddSaleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSale}
                disabled={!saleForm.customerId || saleForm.products.length === 0 || saleForm.amount === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Record Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog open={isViewSaleDialogOpen} onOpenChange={setIsViewSaleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>
              View complete sale information
            </DialogDescription>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {selectedSale.customer.name}</p>
                      <p><strong>Email:</strong> {selectedSale.customer.email}</p>
                    </div>
                    <div>
                      <p><strong>Phone:</strong> {selectedSale.customer.phone}</p>
                      <p><strong>Status:</strong> {selectedSale.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div>
                <h4 className="font-medium mb-2">Sale Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Amount:</strong> {formatCurrency(selectedSale.amount)}</p>
                      <p><strong>Discount:</strong> {selectedSale.discount}%</p>
                    </div>
                    <div>
                      <p><strong>Created:</strong> {formatDate(selectedSale.createdAt)}</p>
                      {selectedSale.completedAt && (
                        <p><strong>Completed:</strong> {formatDate(selectedSale.completedAt)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-medium mb-2">Products</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {selectedSale.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{product}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSale.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedSale.notes}</p>
                  </div>
                </div>
              )}

              {/* Approval Status */}
              {selectedSale.status === 'PENDING_APPROVAL' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Pending Approval</p>
                      <p className="text-sm text-yellow-700">
                        This sale is awaiting Business Admin approval
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 