'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useWorkflow, ApprovalWorkflow } from '@/lib/workflow';

interface ApprovalRequestProps {
  actionType: ApprovalWorkflow['actionType'];
  requestData: any;
  onSubmit: (approval: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApprovalRequest({ 
  actionType, 
  requestData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ApprovalRequestProps) {
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [notes, setNotes] = useState('');
  const { getApprovalPriority } = useWorkflow();

  const handleSubmit = () => {
    const approvalData: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'> = {
      actionType,
      requesterId: 'current-user-id', // This would come from auth context
      status: 'PENDING',
      requestData,
      approvalNotes: notes,
      priority,
    };

    onSubmit(approvalData);
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Request Approval
        </CardTitle>
        <CardDescription>
          Submit a request for Business Admin approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Type Display */}
        <div className="space-y-2">
          <Label>Action Type</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="font-medium">{getActionTypeLabel(actionType)}</span>
          </div>
        </div>

        {/* Request Data Summary */}
        <div className="space-y-2">
          <Label>Request Summary</Label>
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(requestData, null, 2)}</pre>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>
                  <span>Low Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Medium</Badge>
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="HIGH">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>
                  <span>High Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="URGENT">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">Urgent</Badge>
                  <span>Urgent Priority</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Additional Notes (Optional)</Label>
          <Textarea
            placeholder="Explain why this approval is needed..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Information Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This request will be sent to Business Admin for approval. You will be notified once the request is reviewed.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Approval Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useWorkflow, ApprovalWorkflow } from '@/lib/workflow';

interface ApprovalRequestProps {
  actionType: ApprovalWorkflow['actionType'];
  requestData: any;
  onSubmit: (approval: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApprovalRequest({ 
  actionType, 
  requestData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ApprovalRequestProps) {
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [notes, setNotes] = useState('');
  const { getApprovalPriority } = useWorkflow();

  const handleSubmit = () => {
    const approvalData: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'> = {
      actionType,
      requesterId: 'current-user-id', // This would come from auth context
      status: 'PENDING',
      requestData,
      approvalNotes: notes,
      priority,
    };

    onSubmit(approvalData);
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Request Approval
        </CardTitle>
        <CardDescription>
          Submit a request for Business Admin approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Type Display */}
        <div className="space-y-2">
          <Label>Action Type</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="font-medium">{getActionTypeLabel(actionType)}</span>
          </div>
        </div>

        {/* Request Data Summary */}
        <div className="space-y-2">
          <Label>Request Summary</Label>
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(requestData, null, 2)}</pre>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>
                  <span>Low Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Medium</Badge>
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="HIGH">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>
                  <span>High Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="URGENT">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">Urgent</Badge>
                  <span>Urgent Priority</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Additional Notes (Optional)</Label>
          <Textarea
            placeholder="Explain why this approval is needed..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Information Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This request will be sent to Business Admin for approval. You will be notified once the request is reviewed.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Approval Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 