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
import { Package, Search, Filter, Eye, DollarSign, Tag, Star, TrendingUp } from 'lucide-react';

// Mock product data for salesperson
const mockProducts = [
  {
    id: 'PROD-001',
    name: 'Diamond Ring',
    category: 'Rings',
    price: 2500,
    stock: 15,
    status: 'IN_STOCK',
    description: 'Beautiful diamond ring with 1 carat diamond',
    image: '/images/diamond-ring.jpg',
    rating: 4.8,
    salesCount: 45,
    floor: 'Floor 2'
  },
  {
    id: 'PROD-002',
    name: 'Gold Necklace',
    category: 'Necklaces',
    price: 1800,
    stock: 8,
    status: 'LOW_STOCK',
    description: 'Elegant gold necklace with pendant',
    image: '/images/gold-necklace.jpg',
    rating: 4.6,
    salesCount: 32,
    floor: 'Floor 2'
  },
  {
    id: 'PROD-003',
    name: 'Platinum Watch',
    category: 'Watches',
    price: 3200,
    stock: 5,
    status: 'LOW_STOCK',
    description: 'Luxury platinum watch with leather strap',
    image: '/images/platinum-watch.jpg',
    rating: 4.9,
    salesCount: 28,
    floor: 'Floor 2'
  },
  {
    id: 'PROD-004',
    name: 'Silver Bracelet',
    category: 'Bracelets',
    price: 950,
    stock: 25,
    status: 'IN_STOCK',
    description: 'Delicate silver bracelet with charms',
    image: '/images/silver-bracelet.jpg',
    rating: 4.4,
    salesCount: 67,
    floor: 'Floor 2'
  },
  {
    id: 'PROD-005',
    name: 'Pearl Earrings',
    category: 'Earrings',
    price: 1200,
    stock: 0,
    status: 'OUT_OF_STOCK',
    description: 'Classic pearl earrings for formal occasions',
    image: '/images/pearl-earrings.jpg',
    rating: 4.7,
    salesCount: 23,
    floor: 'Floor 2'
  },
  {
    id: 'PROD-006',
    name: 'Ruby Pendant',
    category: 'Pendants',
    price: 2100,
    stock: 12,
    status: 'IN_STOCK',
    description: 'Stunning ruby pendant with gold setting',
    image: '/images/ruby-pendant.jpg',
    rating: 4.5,
    salesCount: 19,
    floor: 'Floor 2'
  }
];

export default function SalespersonProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      IN_STOCK: { variant: 'default', color: 'text-green-600' },
      LOW_STOCK: { variant: 'outline', color: 'text-orange-600' },
      OUT_OF_STOCK: { variant: 'destructive', color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.IN_STOCK;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === 'IN_STOCK').length,
    lowStock: products.filter(p => p.status === 'LOW_STOCK').length,
    outOfStock: products.filter(p => p.status === 'OUT_OF_STOCK').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    averagePrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Product Catalog"
        description="Browse and manage product inventory"
        breadcrumbs={true}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Request Stock
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {categories.length} categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStock} low stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per product
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Search and filter product catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            {filteredProducts.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${product.price.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.stock}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{product.salesCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(product)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedProduct.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-sm font-medium text-green-600">${selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock</Label>
                  <p className="text-sm text-muted-foreground">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedProduct.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{selectedProduct.rating}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sales Count</Label>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProduct.salesCount}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Floor</Label>
                  <p className="text-sm text-muted-foreground">{selectedProduct.floor}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedProduct.description}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  Add to Sale
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 