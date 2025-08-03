'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Settings,
  Eye,
  UserPlus,
  Activity,
  Target,
  DollarSign
} from 'lucide-react';

// Mock floor data
const floors = [
  {
    id: 1,
    name: 'Floor 1',
    manager: 'Priya Sharma',
    managerEmail: 'priya.sharma@jewellery.com',
    managerAvatar: '/avatars/priya.jpg',
    salespeople: 4,
    customers: 156,
    sales: 1250000,
    performance: 95,
    status: 'active',
    area: 'Gold & Diamond',
    lastActivity: '2 hours ago',
    capacity: 80
  },
  {
    id: 2,
    name: 'Floor 2',
    manager: 'Kavya Singh',
    managerEmail: 'kavya.singh@jewellery.com',
    managerAvatar: '/avatars/kavya.jpg',
    salespeople: 3,
    customers: 89,
    sales: 890000,
    performance: 88,
    status: 'active',
    area: 'Silver & Platinum',
    lastActivity: '1 hour ago',
    capacity: 65
  },
  {
    id: 3,
    name: 'Floor 3',
    manager: 'Neha Gupta',
    managerEmail: 'neha.gupta@jewellery.com',
    managerAvatar: '/avatars/neha.jpg',
    salespeople: 2,
    customers: 234,
    sales: 1670000,
    performance: 96,
    status: 'active',
    area: 'Premium Collection',
    lastActivity: '30 minutes ago',
    capacity: 90
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  maintenance: 'bg-yellow-100 text-yellow-800'
};

export default function AdminFloors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredFloors = floors.filter(floor => {
    const matchesSearch = floor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         floor.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || floor.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Floor Management</h1>
            <p className="text-gray-600">Manage store floors and track performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Floor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Floors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{floors.length}</div>
                <p className="text-xs text-muted-foreground">Active floors</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(floors.reduce((acc, floor) => acc + floor.sales, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Combined revenue</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {floors.reduce((acc, floor) => acc + floor.customers, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all floors</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(floors.reduce((acc, floor) => acc + floor.performance, 0) / floors.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Floor average</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search floors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFloors.map((floor, index) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {floor.name.split(' ')[1]}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{floor.name}</CardTitle>
                        <CardDescription>{floor.area}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[floor.status as keyof typeof statusColors]}>
                      {floor.status}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      Capacity: {floor.capacity}%
                    </div>
                  </div>
                  
                  {/* Manager Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={floor.managerAvatar} />
                      <AvatarFallback>{getInitials(floor.manager)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{floor.manager}</div>
                      <div className="text-xs text-gray-500">{floor.managerEmail}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{floor.salespeople} Salespeople</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span>{floor.customers} Customers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{floor.lastActivity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span>{floor.performance}% Performance</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">Total Sales</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(floor.sales)}</div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
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