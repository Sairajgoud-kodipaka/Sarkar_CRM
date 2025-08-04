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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { useWorkflow } from '@/lib/workflow';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, ArrowUp } from 'lucide-react';

// Mock data for approval requests
const mockApprovalRequests = [
  {
    id: '1',
    actionType: 'CUSTOMER_CREATE',
    requestData: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      floor: 'Floor 1'
    },
    priority: 'MEDIUM',
    status: 'PENDING',
    notes: 'New VIP customer registration',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: '2',
    actionType: 'SALE_CREATE',
    requestData: {
      customerName: 'Jane Smith',
      amount: 2500,
      discount: 10,
      floor: 'Floor 2'
    },
    priority: 'HIGH',
    status: 'APPROVED',
    notes: 'High-value sale with discount',
    createdAt: '2024-12-14T15:45:00Z',
    updatedAt: '2024-12-14T16:20:00Z'
  },
  {
    id: '3',
    actionType: 'SALE_UPDATE',
    requestData: {
      saleId: 'SALE-001',
      newAmount: 3000,
      reason: 'Price adjustment'
    },
    priority: 'LOW',
    status: 'REJECTED',
    notes: 'Price adjustment request',
    createdAt: '2024-12-13T09:15:00Z',
    updatedAt: '2024-12-13T11:30:00Z'
  }
];

// Mock escalation data
const mockEscalations = [
  {
    id: '1',
    title: 'Urgent Customer Complaint',
    description: 'Customer demanding immediate resolution',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2024-12-15T14:20:00Z'
  },
  {
    id: '2',
    title: 'System Downtime',
    description: 'POS system not working',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    createdAt: '2024-12-15T13:10:00Z'
  }
];

export default function FloorManagerApprovals() {
  const { user } = useAuth();
  const { createApprovalRequest, createEscalation } = useWorkflowAPI();
  const { requiresApproval, calculatePriority } = useWorkflow();
  
  const [approvalRequests, setApprovalRequests] = useState(mockApprovalRequests);
  const [escalations, setEscalations] = useState(mockEscalations);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Form states for approval request
  const [requestForm, setRequestForm] = useState({
    actionType: '',
    priority: 'MEDIUM',
    notes: '',
    requestData: {}
  });

  // Form states for escalation
  const [escalationForm, setEscalationForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  });

  const handleCreateApprovalRequest = async () => {
    try {
      const newRequest = {
        ...requestForm,
        requesterId: user?.id,
        requesterRole: user?.role,
        floor: user?.floor
      };

      const response = await createApprovalRequest(newRequest);
      
      if (response.success) {
        setApprovalRequests(prev => [response.data, ...prev]);
        setIsRequestDialogOpen(false);
        setRequestForm({
          actionType: '',
          priority: 'MEDIUM',
          notes: '',
          requestData: {}
        });
      }
    } catch (error) {
      console.error('Error creating approval request:', error);
    }
  };

  const handleCreateEscalation = async () => {
    try {
      const newEscalation = {
        ...escalationForm,
        requesterId: user?.id,
        requesterRole: user?.role,
        floor: user?.floor
      };

      const response = await createEscalation(newEscalation);
      
      if (response.success) {
        setEscalations(prev => [response.data, ...prev]);
        setIsEscalationDialogOpen(false);
        setEscalationForm({
          title: '',
          description: '',
          priority: 'MEDIUM'
        });
      }
    } catch (error) {
      console.error('Error creating escalation:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', icon: Clock },
      APPROVED: { variant: 'default', icon: CheckCircle },
      REJECTED: { variant: 'destructive', icon: XCircle },
      ESCALATED: { variant: 'outline', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { variant: 'secondary', color: 'text-gray-600' },
      MEDIUM: { variant: 'default', color: 'text-blue-600' },
      HIGH: { variant: 'outline', color: 'text-orange-600' },
      CRITICAL: { variant: 'destructive', color: 'text-red-600' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {priority}
      </Badge>
    );
  };

  const filteredApprovalRequests = approvalRequests.filter(request => {
    const matchesSearch = request.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: approvalRequests.length,
    pending: approvalRequests.filter(r => r.status === 'PENDING').length,
    approved: approvalRequests.filter(r => r.status === 'APPROVED').length,
    rejected: approvalRequests.filter(r => r.status === 'REJECTED').length,
    escalated: escalations.filter(e => e.status === 'OPEN').length
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Approval Management"
        description="Submit approval requests and track their status"
        breadcrumbs={true}
        actions={
          <div className="flex gap-2">
            <Dialog open={isEscalationDialogOpen} onOpenChange={setIsEscalationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Escalate Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Escalate Issue</DialogTitle>
                  <DialogDescription>
                    Escalate an urgent issue to Business Admin for immediate attention.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="escalation-title">Title</Label>
                    <Input
                      id="escalation-title"
                      value={escalationForm.title}
                      onChange={(e) => setEscalationForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief title of the issue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="escalation-description">Description</Label>
                    <Textarea
                      id="escalation-description"
                      value={escalationForm.description}
                      onChange={(e) => setEscalationForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the issue"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="escalation-priority">Priority</Label>
                    <Select
                      value={escalationForm.priority}
                      onValueChange={(value) => setEscalationForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEscalationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEscalation}>
                      Escalate Issue
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  New Approval Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Approval Request</DialogTitle>
                  <DialogDescription>
                    Submit a request for Business Admin approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="action-type">Action Type</Label>
                    <Select
                      value={requestForm.actionType}
                      onValueChange={(value) => setRequestForm(prev => ({ ...prev, actionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER_CREATE">Create Customer</SelectItem>
                        <SelectItem value="CUSTOMER_UPDATE">Update Customer</SelectItem>
                        <SelectItem value="SALE_CREATE">Create Sale</SelectItem>
                        <SelectItem value="SALE_UPDATE">Update Sale</SelectItem>
                        <SelectItem value="SALE_DELETE">Delete Sale</SelectItem>
                        <SelectItem value="PRODUCT_UPDATE">Update Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(value) => setRequestForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={requestForm.notes}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes for the approval request"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateApprovalRequest}>
                      Submit Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.escalated}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">Approval Requests</TabsTrigger>
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>
                Track your submitted approval requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Priority</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.actionType.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(request.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.notes}
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(request.updatedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredApprovalRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No approval requests found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalations</CardTitle>
              <CardDescription>
                Track escalated issues and their resolution status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escalations.map((escalation) => (
                      <TableRow key={escalation.id}>
                        <TableCell className="font-medium">
                          {escalation.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {escalation.description}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(escalation.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(escalation.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(escalation.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {escalations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No escalations found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
} 