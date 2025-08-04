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
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { useAuth } from '@/contexts/auth-context';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Package,
  Users,
  Filter,
  Search,
  Eye,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Mock approval data for demonstration
const mockApprovals = [
  {
    id: '1',
    actionType: 'SALE_CREATE',
    requester: {
      name: 'Priya Sharma',
      email: 'priya.sharma@jewellery.com',
      role: 'FLOOR_MANAGER',
      floor: 'Floor 1'
    },
    status: 'PENDING',
    priority: 'HIGH',
    requestData: {
      amount: 75000,
      customerName: 'Amit Patel',
      products: ['Gold Necklace', 'Diamond Ring'],
      notes: 'High-value customer, urgent sale'
    },
    createdAt: '2024-12-15T10:30:00Z',
    approvalNotes: null
  },
  {
    id: '2',
    actionType: 'CUSTOMER_CREATE',
    requester: {
      name: 'Kavya Singh',
      email: 'kavya.singh@jewellery.com',
      role: 'FLOOR_MANAGER',
      floor: 'Floor 2'
    },
    status: 'PENDING',
    priority: 'MEDIUM',
    requestData: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      incomeRange: 'HIGH',
      notes: 'Premium customer, high potential'
    },
    createdAt: '2024-12-15T09:15:00Z',
    approvalNotes: null
  },
  {
    id: '3',
    actionType: 'SALE_CREATE',
    requester: {
      name: 'Neha Gupta',
      email: 'neha.gupta@jewellery.com',
      role: 'FLOOR_MANAGER',
      floor: 'Floor 3'
    },
    status: 'APPROVED',
    priority: 'HIGH',
    requestData: {
      amount: 120000,
      customerName: 'Vikram Malhotra',
      products: ['Platinum Chain', 'Ruby Earrings'],
      notes: 'VIP customer, bulk purchase'
    },
    createdAt: '2024-12-14T16:45:00Z',
    approvedAt: '2024-12-14T17:30:00Z',
    approvalNotes: 'Approved - VIP customer, good relationship'
  }
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ESCALATED: 'bg-orange-100 text-orange-800'
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-red-100 text-red-800',
  URGENT: 'bg-purple-100 text-purple-800'
};

const actionTypeIcons = {
  SALE_CREATE: DollarSign,
  CUSTOMER_CREATE: Users,
  PRODUCT_UPDATE: Package,
  DISCOUNT_APPLY: TrendingUp
};

export default function AdminApprovals() {
  const { user } = useAuth();
  const { getPendingApprovals, approveRequest, rejectRequest, escalateRequest } = useWorkflowAPI();
  
  const [approvals, setApprovals] = useState(mockApprovals);
  const [filteredApprovals, setFilteredApprovals] = useState(mockApprovals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Load approvals on component mount
  useEffect(() => {
    loadApprovals();
  }, []);

  // Filter approvals based on search and filters
  useEffect(() => {
    let filtered = approvals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(approval => 
        approval.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.requestData.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(approval => approval.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(approval => approval.priority === priorityFilter);
    }

    setFilteredApprovals(filtered);
  }, [approvals, searchQuery, statusFilter, priorityFilter]);

  const loadApprovals = async () => {
    try {
      // In real implementation, this would call the API
      // const data = await getPendingApprovals(user?.id, 'BUSINESS_ADMIN');
      // setApprovals(data);
      console.log('Loading approvals...');
    } catch (error) {
      console.error('Error loading approvals:', error);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      await approveRequest(approvalId, approvalNotes);
      // Update local state
      setApprovals(prev => prev.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: 'APPROVED', approvalNotes, approvedAt: new Date().toISOString() }
          : approval
      ));
      setIsReviewDialogOpen(false);
      setApprovalNotes('');
      setSelectedApproval(null);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      await rejectRequest(approvalId, approvalNotes);
      // Update local state
      setApprovals(prev => prev.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: 'REJECTED', approvalNotes }
          : approval
      ));
      setIsReviewDialogOpen(false);
      setApprovalNotes('');
      setSelectedApproval(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleEscalate = async (approvalId: string) => {
    try {
      await escalateRequest(approvalId, approvalNotes);
      // Update local state
      setApprovals(prev => prev.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: 'ESCALATED', approvalNotes }
          : approval
      ));
      setIsReviewDialogOpen(false);
      setApprovalNotes('');
      setSelectedApproval(null);
    } catch (error) {
      console.error('Error escalating request:', error);
    }
  };

  const openReviewDialog = (approval: any) => {
    setSelectedApproval(approval);
    setIsReviewDialogOpen(true);
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

  const getActionTypeDisplay = (actionType: string) => {
    const displays = {
      SALE_CREATE: 'New Sale',
      CUSTOMER_CREATE: 'New Customer',
      PRODUCT_UPDATE: 'Product Update',
      DISCOUNT_APPLY: 'Discount Application'
    };
    return displays[actionType] || actionType;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      case 'ESCALATED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;
  const approvedCount = approvals.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = approvals.filter(a => a.status === 'REJECTED').length;

  return (
    <DashboardLayout userRole="BUSINESS_ADMIN" userFloor="All Floors">
      <PageHeader
        title="Approval Management"
        description="Review and manage approval requests from Floor Managers"
        breadcrumbs={true}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Notifications
            </Button>
          </div>
        }
      />

      {/* Approval Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              Require follow-up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.5h</div>
            <p className="text-xs text-muted-foreground">
              Within SLA target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search approvals..."
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadApprovals}>
              <Filter className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>
            Review and take action on pending approval requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.map((approval) => {
                const ActionIcon = actionTypeIcons[approval.actionType] || Package;
                return (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/avatars/${approval.requester.name.toLowerCase().replace(' ', '-')}.jpg`} />
                          <AvatarFallback>{approval.requester.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{approval.requester.name}</div>
                          <div className="text-sm text-muted-foreground">{approval.requester.floor}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ActionIcon className="h-4 w-4 text-blue-600" />
                        <span>{getActionTypeDisplay(approval.actionType)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs">
                        {approval.actionType === 'SALE_CREATE' && (
                          <div>
                            <div className="font-medium">{approval.requestData.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(approval.requestData.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {approval.requestData.products.join(', ')}
                            </div>
                          </div>
                        )}
                        {approval.actionType === 'CUSTOMER_CREATE' && (
                          <div>
                            <div className="font-medium">{approval.requestData.name}</div>
                            <div className="text-sm text-muted-foreground">{approval.requestData.email}</div>
                            <div className="text-xs text-muted-foreground">
                              Income: {approval.requestData.incomeRange}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={priorityColors[approval.priority]}>
                        {approval.priority}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColors[approval.status]}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(approval.status)}
                          <span>{approval.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(approval.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(approval)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {approval.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(approval.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(approval.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredApprovals.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No approval requests found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Approval Request</DialogTitle>
            <DialogDescription>
              Review the details and take appropriate action
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-6">
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Requester Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedApproval.requester.name}</p>
                    <p><strong>Email:</strong> {selectedApproval.requester.email}</p>
                    <p><strong>Floor:</strong> {selectedApproval.requester.floor}</p>
                    <p><strong>Role:</strong> {selectedApproval.requester.role}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Request Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Action:</strong> {getActionTypeDisplay(selectedApproval.actionType)}</p>
                    <p><strong>Priority:</strong> {selectedApproval.priority}</p>
                    <p><strong>Status:</strong> {selectedApproval.status}</p>
                    <p><strong>Created:</strong> {formatDate(selectedApproval.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Request Data */}
              <div>
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedApproval.requestData, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Approval Notes */}
              <div>
                <h4 className="font-medium mb-2">Approval Notes</h4>
                <Textarea
                  placeholder="Add notes for your decision..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                
                {selectedApproval.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-orange-600 hover:text-orange-700"
                      onClick={() => handleEscalate(selectedApproval.id)}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Escalate
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleReject(selectedApproval.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApprove(selectedApproval.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 