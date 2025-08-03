'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  amount: number;
  quantity: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  product: {
    id: string;
    name: string;
    sku: string;
  };
  floor: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

interface SalesStats {
  today: { total: number; count: number; change: number };
  week: { total: number; count: number; change: number };
  month: { total: number; count: number; change: number };
  floorBreakdown: Array<{
    floor: string;
    sales: number;
    count: number;
    change: number;
  }>;
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('day');
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);
  const [newSale, setNewSale] = useState({
    customerId: '',
    productId: '',
    floorId: '',
    amount: '',
    quantity: '1',
    discount: '0',
    paymentMethod: 'CASH',
    notes: ''
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    loadSalesData();
    loadFormData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      
      // Load sales with filters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterFloor !== 'all') params.append('floorId', filterFloor);
      
      const response = await fetch(`/api/sales?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setSales(data.data || []);
        calculateStats(data.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load sales data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      // Load customers, products, and floors for the new sale form
      const [customersRes, productsRes, floorsRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/products'),
        fetch('/api/floors')
      ]);

      const customersData = await customersRes.json();
      const productsData = await productsRes.json();
      const floorsData = await floorsRes.json();

      if (customersRes.ok) setCustomers(customersData.data || []);
      if (productsRes.ok) setProducts(productsData.data || []);
      if (floorsRes.ok) setFloors(floorsData.data || []);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const calculateStats = (salesData: Sale[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());

    const todaySales = salesData.filter(sale => new Date(sale.createdAt) >= today);
    const weekSales = salesData.filter(sale => new Date(sale.createdAt) >= weekAgo);
    const monthSales = salesData.filter(sale => new Date(sale.createdAt) >= monthAgo);

    const stats: SalesStats = {
      today: {
        total: todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        count: todaySales.length,
        change: 8.3 // Mock change percentage
      },
      week: {
        total: weekSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        count: weekSales.length,
        change: 15.7
      },
      month: {
        total: monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        count: monthSales.length,
        change: 22.1
      },
      floorBreakdown: []
    };

    // Calculate floor breakdown
    const floorMap = new Map();
    salesData.forEach(sale => {
      const floorName = sale.floor.name;
      if (!floorMap.has(floorName)) {
        floorMap.set(floorName, { sales: 0, count: 0 });
      }
      floorMap.get(floorName).sales += sale.totalAmount;
      floorMap.get(floorName).count += 1;
    });

    floorMap.forEach((data, floor) => {
      stats.floorBreakdown.push({
        floor,
        sales: data.sales,
        count: data.count,
        change: Math.random() * 20 - 10 // Mock change
      });
    });

    setStats(stats);
  };

  const handleNewSale = async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSale,
          amount: parseFloat(newSale.amount),
          quantity: parseInt(newSale.quantity),
          discount: parseFloat(newSale.discount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sale recorded successfully",
        });
        setShowNewSaleDialog(false);
        setNewSale({
          customerId: '',
          productId: '',
          floorId: '',
          amount: '',
          quantity: '1',
          discount: '0',
          paymentMethod: 'CASH',
          notes: ''
        });
        loadSalesData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to record sale",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchesFloor = filterFloor === 'all' || sale.floor.id === filterFloor;
    
    return matchesSearch && matchesStatus && matchesFloor;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
              <p className="text-gray-600">Track and manage all sales transactions</p>
            </div>
          </div>
          <Dialog open={showNewSaleDialog} onOpenChange={setShowNewSaleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
                <DialogDescription>Enter sale details to record a new transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Customer</Label>
                  <Select value={newSale.customerId} onValueChange={(value) => setNewSale({...newSale, customerId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer: any) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Product</Label>
                  <Select value={newSale.productId} onValueChange={(value) => setNewSale({...newSale, productId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₹{product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Floor</Label>
                  <Select value={newSale.floorId} onValueChange={(value) => setNewSale({...newSale, floorId: value})}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newSale.amount}
                      onChange={(e) => setNewSale({...newSale, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount (₹)</Label>
                    <Input
                      type="number"
                      value={newSale.discount}
                      onChange={(e) => setNewSale({...newSale, discount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={newSale.paymentMethod} onValueChange={(value) => setNewSale({...newSale, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                    placeholder="Optional notes"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewSaleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNewSale}>
                    Record Sale
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers, products, SKU..."
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
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
              <Button variant="outline" onClick={loadSalesData}>
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.today.total)}</div>
                <p className="text-xs text-muted-foreground">{stats.today.count} transactions</p>
                <p className={`text-xs flex items-center ${getChangeColor(stats.today.change)}`}>
                  {getChangeIcon(stats.today.change)}
                  <span className="ml-1">{stats.today.change >= 0 ? '+' : ''}{stats.today.change}% from yesterday</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.week.total)}</div>
                <p className="text-xs text-muted-foreground">{stats.week.count} transactions</p>
                <p className={`text-xs flex items-center ${getChangeColor(stats.week.change)}`}>
                  {getChangeIcon(stats.week.change)}
                  <span className="ml-1">{stats.week.change >= 0 ? '+' : ''}{stats.week.change}% from last week</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.month.total)}</div>
                <p className="text-xs text-muted-foreground">{stats.month.count} transactions</p>
                <p className={`text-xs flex items-center ${getChangeColor(stats.month.change)}`}>
                  {getChangeIcon(stats.month.change)}
                  <span className="ml-1">{stats.month.change >= 0 ? '+' : ''}{stats.month.change}% from last month</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>All sales transactions with details</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading sales data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.customer.name}</div>
                          <div className="text-sm text-gray-500">{sale.customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {sale.product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>{sale.floor.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatCurrency(sale.totalAmount)}</div>
                          {sale.discount > 0 && (
                            <div className="text-sm text-gray-500">
                              Discount: ₹{sale.discount}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && filteredSales.length === 0 && (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sales found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 