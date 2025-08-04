'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { ShoppingCart, Search, Filter, Plus, Eye, DollarSign, Calendar, TrendingUp, Target } from 'lucide-react';

// Mock sales data for salesperson
const mockSales = [
  {
    id: 'SALE-001',
    customerName: 'John Smith',
    product: 'Diamond Ring',
    amount: 2500,
    discount: 0,
    finalAmount: 2500,
    status: 'COMPLETED',
    date: '2024-12-15T14:30:00Z',
    salespersonId: 'SP001',
    floor: 'Floor 2'
  },
  {
    id: 'SALE-002',
    customerName: 'Emma Wilson',
    product: 'Gold Necklace',
    amount: 1800,
    discount: 100,
    finalAmount: 1700,
    status: 'COMPLETED',
    date: '2024-12-15T11:20:00Z',
    salespersonId: 'SP001',
    floor: 'Floor 2'
  },
  {
    id: 'SALE-003',
    customerName: 'Michael Brown',
    product: 'Platinum Watch',
    amount: 3200,
    discount: 200,
    finalAmount: 3000,
    status: 'COMPLETED',
    date: '2024-12-14T16:45:00Z',
    salespersonId: 'SP001',
    floor: 'Floor 2'
  },
  {
    id: 'SALE-004',
    customerName: 'Sarah Davis',
    product: 'Silver Bracelet',
    amount: 950,
    discount: 0,
    finalAmount: 950,
    status: 'PENDING',
    date: '2024-12-13T10:15:00Z',
    salespersonId: 'SP001',
    floor: 'Floor 2'
  }
];

// Mock customers and products for the form
const mockCustomers = [
  { id: 'CUST-001', name: 'John Smith', email: 'john@example.com' },
  { id: 'CUST-002', name: 'Emma Wilson', email: 'emma@example.com' },
  { id: 'CUST-003', name: 'Michael Brown', email: 'michael@example.com' },
  { id: 'CUST-004', name: 'Sarah Davis', email: 'sarah@example.com' }
];

const mockProducts = [
  { id: 'PROD-001', name: 'Diamond Ring', price: 2500, category: 'Rings' },
  { id: 'PROD-002', name: 'Gold Necklace', price: 1800, category: 'Necklaces' },
  { id: 'PROD-003', name: 'Platinum Watch', price: 3200, category: 'Watches' },
  { id: 'PROD-004', name: 'Silver Bracelet', price: 950, category: 'Bracelets' }
];

export default function SalespersonSales() {
  const { user } = useAuth();
  const { createSaleWithWorkflow } = useWorkflowAPI();
  const [sales, setSales] = useState(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  // Form state for new sale
  const [saleForm, setSaleForm] = useState({
    customerId: '',
    productId: '',
    amount: 0,
    discount: 0,
    notes: ''
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      COMPLETED: { variant: 'default', color: 'text-green-600' },
      PENDING: { variant: 'secondary', color: 'text-orange-600' },
      CANCELLED: { variant: 'destructive', color: 'text-red-600' },
      PENDING_APPROVAL: { variant: 'outline', color: 'text-blue-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.COMPLETED;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sales.length,
    completed: sales.filter(s => s.status === 'COMPLETED').length,
    totalRevenue: sales.filter(s => s.status === 'COMPLETED').reduce((sum, s) => sum + s.finalAmount, 0),
    averageSale: sales.length > 0 ? sales.reduce((sum, s) => sum + s.finalAmount, 0) / sales.length : 0
  };

  const handleCreateSale = async () => {
    try {
      const selectedCustomer = mockCustomers.find(c => c.id === saleForm.customerId);
      const selectedProduct = mockProducts.find(p => p.id === saleForm.productId);
      
      const saleData = {
        customerId: saleForm.customerId,
        customerName: selectedCustomer?.name || '',
        productId: saleForm.productId,
        productName: selectedProduct?.name || '',
        amount: saleForm.amount,
        discount: saleForm.discount,
        finalAmount: saleForm.amount - saleForm.discount,
        notes: saleForm.notes,
        floor: user?.floor || 'Floor 2'
      };

      const response = await createSaleWithWorkflow(saleData, user?.id || 'SP001');
      
      if (response.success) {
        const newSale = {
          id: `SALE-${Date.now()}`,
          customerName: saleData.customerName,
          product: saleData.productName,
          amount: saleData.amount,
          discount: saleData.discount,
          finalAmount: saleData.finalAmount,
          status: response.requiresApproval ? 'PENDING_APPROVAL' : 'COMPLETED',
          date: new Date().toISOString(),
          salespersonId: user?.id || 'SP001',
          floor: user?.floor || 'Floor 2'
        };

        setSales(prev => [newSale, ...prev]);
        setIsSaleDialogOpen(false);
        setSaleForm({
          customerId: '',
          productId: '',
          amount: 0,
          discount: 0,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setIsViewDialogOpen(true);
  };

  const handleProductChange = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    setSaleForm(prev => ({
      ...prev,
      productId,
      amount: product?.price || 0
    }));
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Sales"
        description="Record and track your sales transactions"
        breadcrumbs={true}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Export
            </Button>
            <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Record New Sale</DialogTitle>
                  <DialogDescription>
                    Record a new sale transaction
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={saleForm.customerId} onValueChange={(value) => setSaleForm(prev => ({ ...prev, customerId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select value={saleForm.productId} onValueChange={handleProductChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={saleForm.amount}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={saleForm.discount}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter discount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsSaleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSale}>
                      Record Sale
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.completed / stats.total) * 100).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From completed sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageSale.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
          <CardDescription>
            Search and filter your sales records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sales by customer, product, or sale ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>
            {filteredSales.length} sales found
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
                  <TableHead>Discount</TableHead>
                  <TableHead>Final Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>${sale.amount.toLocaleString()}</TableCell>
                    <TableCell>${sale.discount.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">${sale.finalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {getStatusBadge(sale.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(sale.date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSale(sale)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sales found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>
              Detailed information about sale {selectedSale?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Sale ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedSale.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Product</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.product}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">${selectedSale.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Discount</Label>
                  <p className="text-sm text-muted-foreground">${selectedSale.discount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Final Amount</Label>
                  <p className="text-sm font-medium text-green-600">${selectedSale.finalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSale.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 