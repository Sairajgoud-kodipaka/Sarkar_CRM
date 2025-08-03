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
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Settings,
  Eye,
  Reply
} from 'lucide-react';

// Mock support tickets data
const supportTickets = [
  {
    id: 1,
    title: 'System login issue',
    description: 'Unable to access the dashboard after password reset',
    customer: 'Priya Sharma',
    customerEmail: 'priya.sharma@jewellery.com',
    customerPhone: '+91 98765 43210',
    priority: 'high',
    status: 'open',
    category: 'Technical',
    assignedTo: 'Amit Patel',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-15T14:20:00Z',
    floor: 'Floor 1'
  },
  {
    id: 2,
    title: 'Product catalog update needed',
    description: 'Need to add new diamond collection to the catalog',
    customer: 'Kavya Singh',
    customerEmail: 'kavya.singh@jewellery.com',
    customerPhone: '+91 87654 32109',
    priority: 'medium',
    status: 'in_progress',
    category: 'Product',
    assignedTo: 'Neha Gupta',
    createdAt: '2024-01-14T15:45:00Z',
    lastUpdated: '2024-01-15T09:15:00Z',
    floor: 'Floor 2'
  },
  {
    id: 3,
    title: 'Sales report generation error',
    description: 'Monthly sales report is not generating properly',
    customer: 'Rahul Verma',
    customerEmail: 'rahul.verma@jewellery.com',
    customerPhone: '+91 76543 21098',
    priority: 'high',
    status: 'resolved',
    category: 'Reports',
    assignedTo: 'Priya Sharma',
    createdAt: '2024-01-13T11:20:00Z',
    lastUpdated: '2024-01-14T16:30:00Z',
    floor: 'Floor 3'
  },
  {
    id: 4,
    title: 'Customer data sync issue',
    description: 'New customer data not syncing across floors',
    customer: 'Anjali Desai',
    customerEmail: 'anjali.desai@jewellery.com',
    customerPhone: '+91 65432 10987',
    priority: 'low',
    status: 'open',
    category: 'Data',
    assignedTo: 'Unassigned',
    createdAt: '2024-01-15T08:15:00Z',
    lastUpdated: '2024-01-15T08:15:00Z',
    floor: 'Floor 1'
  }
];

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

export default function AdminSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600">Manage customer support tickets and inquiries</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
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
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supportTickets.length}</div>
                <p className="text-xs text-muted-foreground">All tickets</p>
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
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {supportTickets.filter(t => t.status === 'open').length}
                </div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
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
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {supportTickets.filter(t => t.status === 'in_progress').length}
                </div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
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
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {supportTickets.filter(t => t.status === 'resolved').length}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
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
                    placeholder="Search tickets..."
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
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        #{ticket.id}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription className="mt-1">{ticket.description}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getTimeAgo(ticket.lastUpdated)}
                    </div>
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(ticket.customer)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{ticket.customer}</div>
                      <div className="text-xs text-gray-500">{ticket.customerEmail}</div>
                    </div>
                    <div className="text-sm text-gray-500">{ticket.floor}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{ticket.customerPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Created {formatDate(ticket.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Updated {formatDate(ticket.lastUpdated)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <span>Assigned to {ticket.assignedTo}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
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