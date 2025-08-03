'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Building2,
  Calendar,
  Clock,
  Bell,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  ChevronDown,
  AlertTriangle,
  Star,
  Target,
  Award,
  Clock4,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Enhanced mock data for business admin dashboard
const visitorMetrics = {
  today: 156,
  thisWeek: 892,
  thisMonth: 3247,
  change: 12.5
};

const salesMetrics = {
  today: 45000,
  thisWeek: 285000,
  thisMonth: 1250000,
  change: 8.3
};

const floorCustomers = {
  floor1: [
    { name: 'Priya Sharma', number: '+91 98765 43210', interest: 'Gold Necklace', status: 'hot' },
    { name: 'Amit Patel', number: '+91 87654 32109', interest: 'Diamond Ring', status: 'warm' },
    { name: 'Kavya Singh', number: '+91 76543 21098', interest: 'Silver Bracelet', status: 'cold' },
    { name: 'Rahul Verma', number: '+91 65432 10987', interest: 'Platinum Chain', status: 'hot' }
  ],
  floor2: [
    { name: 'Neha Gupta', number: '+91 54321 09876', interest: 'Pearl Set', status: 'warm' },
    { name: 'Vikram Malhotra', number: '+91 43210 98765', interest: 'Ruby Earrings', status: 'hot' },
    { name: 'Sneha Reddy', number: '+91 32109 87654', interest: 'Emerald Ring', status: 'cold' },
    { name: 'Rajesh Kumar', number: '+91 21098 76543', interest: 'Sapphire Necklace', status: 'warm' }
  ],
  floor3: [
    { name: 'Anjali Desai', number: '+91 10987 65432', interest: 'Gold Bangle', status: 'hot' },
    { name: 'Mohan Singh', number: '+91 09876 54321', interest: 'Diamond Pendant', status: 'warm' },
    { name: 'Pooja Sharma', number: '+91 98765 43210', interest: 'Silver Ring', status: 'cold' },
    { name: 'Arjun Mehta', number: '+91 87654 32109', interest: 'Platinum Earrings', status: 'hot' }
  ]
};

// New data for enhanced features
const recentActivities = [
  {
    id: 1,
    type: 'sale',
    message: 'Sale completed: Gold Necklace - ₹45,000',
    time: '2 minutes ago',
    user: 'Priya Patel',
    floor: 'Floor 1'
  },
  {
    id: 2,
    type: 'customer',
    message: 'New customer registered: Rahul Sharma',
    time: '15 minutes ago',
    user: 'Amit Kumar',
    floor: 'Floor 2'
  },
  {
    id: 3,
    type: 'followup',
    message: 'Follow-up scheduled: Neha Gupta',
    time: '1 hour ago',
    user: 'Priya Patel',
    floor: 'Floor 1'
  },
  {
    id: 4,
    type: 'inventory',
    message: 'Low stock alert: Diamond Rings',
    time: '2 hours ago',
    user: 'System',
    floor: 'All Floors'
  }
];

const topPerformers = [
  {
    name: 'Priya Patel',
    sales: 1250000,
    customers: 45,
    conversion: 78,
    avatar: 'PP'
  },
  {
    name: 'Amit Kumar',
    sales: 980000,
    customers: 38,
    conversion: 72,
    avatar: 'AK'
  },
  {
    name: 'Rajesh Verma',
    sales: 850000,
    customers: 32,
    conversion: 68,
    avatar: 'RV'
  }
];

const inventoryAlerts = [
  {
    product: 'Gold Necklace 22K',
    current: 5,
    threshold: 10,
    status: 'critical'
  },
  {
    product: 'Diamond Ring 1ct',
    current: 8,
    threshold: 15,
    status: 'warning'
  },
  {
    product: 'Silver Bracelet',
    current: 12,
    threshold: 20,
    status: 'normal'
  }
];

const salesData = [
  { month: 'Jan', sales: 850000, visitors: 1200 },
  { month: 'Feb', sales: 920000, visitors: 1350 },
  { month: 'Mar', sales: 780000, visitors: 1100 },
  { month: 'Apr', sales: 1050000, visitors: 1500 },
  { month: 'May', sales: 1250000, visitors: 1800 },
  { month: 'Jun', sales: 1150000, visitors: 1700 }
];

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'customer': return <Users className="h-4 w-4 text-blue-600" />;
      case 'followup': return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'inventory': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/admin/visitors">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorMetrics.thisMonth.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    +{visitorMetrics.change}% from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/admin/sales">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(salesMetrics.thisMonth)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    +{salesMetrics.change}% from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/admin/customers">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.4%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sales Chart and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly sales and visitor trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest store activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time} • {activity.user}</p>
                        <p className="text-xs text-gray-400">{activity.floor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Performers and Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best performing sales staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.name} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                          {performer.avatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(performer.sales)} • {performer.customers} customers</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="secondary">{performer.conversion}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inventory Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Low stock notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.product}</p>
                        <p className="text-xs text-gray-500">Current: {alert.current} • Threshold: {alert.threshold}</p>
                      </div>
                      <Badge 
                        variant={alert.status === 'critical' ? 'destructive' : alert.status === 'warning' ? 'secondary' : 'default'}
                        className={getAlertColor(alert.status)}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Floor Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(floorCustomers).map(([floor, customers], index) => (
            <motion.div
              key={floor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{floor.replace('floor', 'Floor ')} customers</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 flex justify-between">
                      <span>Name</span>
                      <span>Interest</span>
                      <span>Status</span>
                    </div>
                    {customers.map((customer, customerIndex) => (
                      <div key={customerIndex} className="text-sm flex justify-between items-center py-1 border-b border-gray-100">
                        <div className="flex-1">
                          <span className="font-medium">{customer.name}</span>
                          <p className="text-xs text-gray-500">{customer.number}</p>
                        </div>
                        <span className="text-gray-500 text-xs">{customer.interest}</span>
                        <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 