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
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Award,
  TrendingUp,
  UserPlus,
  Settings,
  Eye
} from 'lucide-react';

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@jewellery.com',
    phone: '+91 98765 43210',
    role: 'FLOOR_MANAGER',
    floor: 'Floor 1',
    avatar: '/avatars/priya.jpg',
    status: 'active',
    performance: 95,
    joinDate: '2023-01-15',
    sales: 1250000,
    customers: 234
  },
  {
    id: 2,
    name: 'Amit Patel',
    email: 'amit.patel@jewellery.com',
    phone: '+91 87654 32109',
    role: 'SALESPERSON',
    floor: 'Floor 1',
    avatar: '/avatars/amit.jpg',
    status: 'active',
    performance: 88,
    joinDate: '2023-03-20',
    sales: 890000,
    customers: 156
  },
  {
    id: 3,
    name: 'Kavya Singh',
    email: 'kavya.singh@jewellery.com',
    phone: '+91 76543 21098',
    role: 'FLOOR_MANAGER',
    floor: 'Floor 2',
    avatar: '/avatars/kavya.jpg',
    status: 'active',
    performance: 92,
    joinDate: '2022-11-10',
    sales: 1450000,
    customers: 289
  },
  {
    id: 4,
    name: 'Rahul Verma',
    email: 'rahul.verma@jewellery.com',
    phone: '+91 65432 10987',
    role: 'SALESPERSON',
    floor: 'Floor 2',
    avatar: '/avatars/rahul.jpg',
    status: 'inactive',
    performance: 75,
    joinDate: '2023-06-05',
    sales: 450000,
    customers: 89
  },
  {
    id: 5,
    name: 'Neha Gupta',
    email: 'neha.gupta@jewellery.com',
    phone: '+91 54321 09876',
    role: 'SALESPERSON',
    floor: 'Floor 3',
    avatar: '/avatars/neha.jpg',
    status: 'active',
    performance: 96,
    joinDate: '2022-08-15',
    sales: 1670000,
    customers: 312
  }
];

const roleColors = {
  BUSINESS_ADMIN: 'bg-purple-100 text-purple-800',
  FLOOR_MANAGER: 'bg-blue-100 text-blue-800',
  SALESPERSON: 'bg-green-100 text-green-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800'
};

export default function AdminTeam() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
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
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage your sales team and track performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
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
                <CardTitle className="text-sm font-medium">Total Team</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">Active members</p>
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
                <CardTitle className="text-sm font-medium">Floor Managers</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.filter(m => m.role === 'FLOOR_MANAGER').length}
                </div>
                <p className="text-xs text-muted-foreground">Managing floors</p>
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
                <CardTitle className="text-sm font-medium">Salespeople</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.filter(m => m.role === 'SALESPERSON').length}
                </div>
                <p className="text-xs text-muted-foreground">Active sales</p>
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
                  {Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Team average</p>
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
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="BUSINESS_ADMIN">Business Admin</option>
                  <option value="FLOOR_MANAGER">Floor Manager</option>
                  <option value="SALESPERSON">Salesperson</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                    <Badge className={statusColors[member.status as keyof typeof statusColors]}>
                      {member.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{member.floor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span>{member.performance}% Performance</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-500">Total Sales</div>
                      <div className="font-semibold">{formatCurrency(member.sales)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Customers</div>
                      <div className="font-semibold">{member.customers}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
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