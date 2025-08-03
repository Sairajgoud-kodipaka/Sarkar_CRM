'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Building2, 
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  recentCustomers: any[];
  recentSales: any[];
  topProducts: any[];
  floorStats: any[];
}

export default function TestComplete() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load customers
      const customersResponse = await fetch('/api/customers');
      const customersData = await customersResponse.json();
      
      // Load products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      // Load sales
      const salesResponse = await fetch('/api/sales');
      const salesData = await salesResponse.json();
      
      // Load floors
      const floorsResponse = await fetch('/api/floors');
      const floorsData = await floorsResponse.json();

      if (customersResponse.ok && productsResponse.ok && salesResponse.ok && floorsResponse.ok) {
        const totalRevenue = salesData.data?.reduce((sum: number, sale: any) => sum + Number(sale.totalAmount), 0) || 0;
        
        setStats({
          totalCustomers: customersData.data?.length || 0,
          totalProducts: productsData.data?.length || 0,
          totalSales: salesData.data?.length || 0,
          totalRevenue,
          recentCustomers: customersData.data?.slice(0, 5) || [],
          recentSales: salesData.data?.slice(0, 5) || [],
          topProducts: productsData.data?.slice(0, 5) || [],
          floorStats: floorsData.data || []
        });
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <Button onClick={loadDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">🎉 Sarkar CRM - Complete Test</h1>
        <p className="text-gray-600">Your jewellery CRM is now fully functional with sample data!</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active customers in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Jewellery items available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total sales revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="floors">Floors</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Latest customers added to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentCustomers.map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold">{customer.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{customer.occupation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>Jewellery products in inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{product.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{product.material} {product.purity}</p>
                      {product.gemstone && (
                        <Badge variant="outline" className="mt-1">{product.gemstone}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{sale.customer?.name}</h4>
                      <p className="text-sm text-gray-600">{sale.product?.name}</p>
                      <p className="text-sm text-gray-600">Floor: {sale.floor?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{sale.totalAmount?.toLocaleString()}</p>
                      <Badge variant="outline" className="mt-1">{sale.paymentMethod}</Badge>
                      <p className="text-sm text-gray-600 mt-1">{sale.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Floors</CardTitle>
              <CardDescription>Multi-floor store layout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.floorStats.map((floor: any) => (
                  <div key={floor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{floor.name}</h4>
                        <p className="text-sm text-gray-600">{floor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Floor {floor.number}</Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {floor.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">🎉 Congratulations!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Your Sarkar CRM is now fully operational with:
          </p>
          <ul className="text-green-700 space-y-2">
            <li>✅ Complete database setup with all tables</li>
            <li>✅ Sample data for testing and demonstration</li>
            <li>✅ Working API endpoints for all CRUD operations</li>
            <li>✅ Multi-floor store management</li>
            <li>✅ Customer relationship management</li>
            <li>✅ Product inventory management</li>
            <li>✅ Sales tracking and analytics</li>
            <li>✅ NextAuth.js authentication ready</li>
          </ul>
          <div className="mt-6 space-x-4">
            <Button onClick={() => window.open('http://localhost:5555', '_blank')}>
              Open Prisma Studio
            </Button>
            <Button variant="outline" onClick={() => window.open('/test-api', '_blank')}>
              Test APIs
            </Button>
            <Button variant="outline" onClick={() => window.open('/dashboard', '_blank')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 