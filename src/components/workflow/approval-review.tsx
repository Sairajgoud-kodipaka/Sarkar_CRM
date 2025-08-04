'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ApprovalWorkflow } from '@/lib/workflow';

interface ApprovalReviewProps {
  approval: ApprovalWorkflow;
  onApprove: (approvalId: string, notes?: string) => void;
  onReject: (approvalId: string, notes?: string) => void;
  onEscalate: (approvalId: string, notes?: string) => void;
  isLoading?: boolean;
}

export function ApprovalReview({ 
  approval, 
  onApprove, 
  onReject, 
  onEscalate, 
  isLoading = false 
}: ApprovalReviewProps) {
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'escalate' | null>(null);

  const handleAction = (actionType: 'approve' | 'reject' | 'escalate') => {
    setAction(actionType);
    switch (actionType) {
      case 'approve':
        onApprove(approval.id, notes);
        break;
      case 'reject':
        onReject(approval.id, notes);
        break;
      case 'escalate':
        onEscalate(approval.id, notes);
        break;
    }
  };

  const getActionTypeLabel = (type: string) => {
    const labels = {
      'CUSTOMER_CREATE': 'Create Customer',
      'CUSTOMER_UPDATE': 'Update Customer',
      'SALE_CREATE': 'Create Sale',
      'SALE_UPDATE': 'Update Sale',
      'PRODUCT_UPDATE': 'Update Product',
      'DISCOUNT_APPLY': 'Apply Discount',
      'FLOOR_ASSIGNMENT': 'Floor Assignment'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'ESCALATED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Review Approval Request
            </CardTitle>
            <CardDescription>
              Review and take action on the approval request
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
            <Badge variant="secondary" className={getPriorityColor(approval.priority)}>
              {approval.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Action Type</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{getActionTypeLabel(approval.actionType)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Requested On</Label>
            <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(approval.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Requested By</Label>
          <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-navy-700 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Floor Manager</div>
              <div className="text-sm text-gray-600">Floor 1</div>
            </div>
          </div>
        </div>

        {/* Request Data */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Request Details</Label>
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(approval.requestData, null, 2)}</pre>
          </div>
        </div>

        {/* Requester Notes */}
        {approval.approvalNotes && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Requester Notes</Label>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm">{approval.approvalNotes}</p>
            </div>
          </div>
        )}

        {/* Approval Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Your Notes (Optional)</Label>
          <Textarea
            placeholder="Add notes about your decision..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        {approval.status === 'PENDING' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => handleAction('approve')} 
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button 
              onClick={() => handleAction('reject')} 
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => handleAction('escalate')} 
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Escalate
            </Button>
          </div>
        )}

        {/* Status-specific alerts */}
        {approval.status === 'APPROVED' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              This request has been approved.
            </AlertDescription>
          </Alert>
        )}

        {approval.status === 'REJECTED' && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              This request has been rejected.
            </AlertDescription>
          </Alert>
        )}

        {approval.status === 'ESCALATED' && (
          <Alert className="border-purple-200 bg-purple-50">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              This request has been escalated for further review.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ApprovalWorkflow } from '@/lib/workflow';

interface ApprovalReviewProps {
  approval: ApprovalWorkflow;
  onApprove: (approvalId: string, notes?: string) => void;
  onReject: (approvalId: string, notes?: string) => void;
  onEscalate: (approvalId: string, notes?: string) => void;
  isLoading?: boolean;
}

export function ApprovalReview({ 
  approval, 
  onApprove, 
  onReject, 
  onEscalate, 
  isLoading = false 
}: ApprovalReviewProps) {
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'escalate' | null>(null);

  const handleAction = (actionType: 'approve' | 'reject' | 'escalate') => {
    setAction(actionType);
    switch (actionType) {
      case 'approve':
        onApprove(approval.id, notes);
        break;
      case 'reject':
        onReject(approval.id, notes);
        break;
      case 'escalate':
        onEscalate(approval.id, notes);
        break;
    }
  };

  const getActionTypeLabel = (type: string) => {
    const labels = {
      'CUSTOMER_CREATE': 'Create Customer',
      'CUSTOMER_UPDATE': 'Update Customer',
      'SALE_CREATE': 'Create Sale',
      'SALE_UPDATE': 'Update Sale',
      'PRODUCT_UPDATE': 'Update Product',
      'DISCOUNT_APPLY': 'Apply Discount',
      'FLOOR_ASSIGNMENT': 'Floor Assignment'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'ESCALATED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Review Approval Request
            </CardTitle>
            <CardDescription>
              Review and take action on the approval request
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
            <Badge variant="secondary" className={getPriorityColor(approval.priority)}>
              {approval.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Action Type</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{getActionTypeLabel(approval.actionType)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Requested On</Label>
            <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(approval.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Requested By</Label>
          <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-navy-700 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Floor Manager</div>
              <div className="text-sm text-gray-600">Floor 1</div>
            </div>
          </div>
        </div>

        {/* Request Data */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Request Details</Label>
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(approval.requestData, null, 2)}</pre>
          </div>
        </div>

        {/* Requester Notes */}
        {approval.approvalNotes && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Requester Notes</Label>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm">{approval.approvalNotes}</p>
            </div>
          </div>
        )}

        {/* Approval Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Your Notes (Optional)</Label>
          <Textarea
            placeholder="Add notes about your decision..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        {approval.status === 'PENDING' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => handleAction('approve')} 
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button 
              onClick={() => handleAction('reject')} 
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => handleAction('escalate')} 
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Escalate
            </Button>
          </div>
        )}

        {/* Status-specific alerts */}
        {approval.status === 'APPROVED' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              This request has been approved.
            </AlertDescription>
          </Alert>
        )}

        {approval.status === 'REJECTED' && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              This request has been rejected.
            </AlertDescription>
          </Alert>
        )}

        {approval.status === 'ESCALATED' && (
          <Alert className="border-purple-200 bg-purple-50">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              This request has been escalated for further review.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 