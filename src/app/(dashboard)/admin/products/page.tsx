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
  Package, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  RefreshCw,
  Tag,
  DollarSign,
  Hash
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: 1,
    name: 'Gold Ring - 22K',
    sku: 'GR-22K-001',
    category: 'Gold Jewellery',
    price: 45000,
    stock: 15,
    status: 'active',
    floor: 'Floor 1',
    weight: '8.5g',
    purity: '22K',
  },
  {
    id: 2,
    name: 'Diamond Necklace',
    sku: 'DN-001',
    category: 'Diamond Jewellery',
    price: 125000,
    stock: 8,
    status: 'active',
    floor: 'Floor 2',
    weight: '12.3g',
    purity: '18K',
  },
  {
    id: 3,
    name: 'Silver Anklet',
    sku: 'SA-001',
    category: 'Silver Jewellery',
    price: 8500,
    stock: 25,
    status: 'active',
    floor: 'Floor 1',
    weight: '15.2g',
    purity: '925',
  },
  {
    id: 4,
    name: 'Platinum Ring',
    sku: 'PR-001',
    category: 'Platinum Jewellery',
    price: 89000,
    stock: 5,
    status: 'low-stock',
    floor: 'Floor 3',
    weight: '6.8g',
    purity: '950',
  },
  {
    id: 5,
    name: 'Pearl Earrings',
    sku: 'PE-001',
    category: 'Pearl Jewellery',
    price: 22000,
    stock: 12,
    status: 'active',
    floor: 'Floor 2',
    weight: '4.2g',
    purity: '18K',
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState(mockProducts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic
    console.log('Search query:', query);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-100 text-success-700">Active</Badge>;
      case 'low-stock':
        return <Badge className="bg-warning-100 text-warning-700">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-error-100 text-error-700">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout
      userRole="BUSINESS_ADMIN"
      searchPlaceholder="Search products by name or SKU..."
      onSearch={handleSearch}
    >
      <PageHeader
        title="Products"
        description="Manage your product catalog and inventory"
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
            <Link href="/products/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Total Products</p>
                <p className="text-2xl font-bold text-navy-900">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Active Products</p>
                <p className="text-2xl font-bold text-navy-900">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-navy-900">
                  {products.filter(p => p.status === 'low-stock').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-600">Total Value</p>
                <p className="text-2xl font-bold text-navy-900">
                  {formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-navy-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Gold Jewellery">Gold Jewellery</SelectItem>
                  <SelectItem value="Diamond Jewellery">Diamond Jewellery</SelectItem>
                  <SelectItem value="Silver Jewellery">Silver Jewellery</SelectItem>
                  <SelectItem value="Platinum Jewellery">Platinum Jewellery</SelectItem>
                  <SelectItem value="Pearl Jewellery">Pearl Jewellery</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>
                Showing {filteredProducts.length} of {products.length} products
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-navy-900">{product.name}</p>
                        <p className="text-sm text-navy-600">{product.weight} | {product.purity}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Hash className="mr-1 h-3 w-3 text-navy-400" />
                        {product.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Tag className="mr-1 h-3 w-3 text-navy-400" />
                        {product.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-navy-900">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-navy-600">{product.stock} units</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-navy-600">{product.floor}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy-600">
                        <p>Weight: {product.weight}</p>
                        <p>Purity: {product.purity}</p>
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
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-error-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
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