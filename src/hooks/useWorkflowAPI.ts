import { useState } from 'react';
import { ApprovalWorkflow, Escalation } from '@/lib/workflow';

export function useWorkflowAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create approval request
  const createApprovalRequest = async (approvalData: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create approval request');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get pending approvals
  const getPendingApprovals = async (userId: string, userRole: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/approvals?status=PENDING&requesterId=${userId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch pending approvals');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get approval by ID
  const getApprovalById = async (approvalId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/approvals/${approvalId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch approval');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve request
  const approveRequest = async (approvalId: string, approverId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'APPROVED',
          approverId,
          notes
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve request');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject request
  const rejectRequest = async (approvalId: string, approverId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'REJECTED',
          approverId,
          notes
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject request');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Escalate request
  const escalateRequest = async (approvalId: string, approverId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ESCALATED',
          approverId,
          notes
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to escalate request');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create customer with workflow check
  const createCustomerWithWorkflow = async (customerData: any, requesterId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': requesterId,
        },
        body: JSON.stringify(customerData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create customer');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create sale with workflow check
  const createSaleWithWorkflow = async (saleData: any, requesterId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': requesterId,
        },
        body: JSON.stringify(saleData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create sale');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create escalation
  const createEscalation = async (escalationData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/escalations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(escalationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create escalation');
      }
      
      return { success: true, data: data.data };
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create escalation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get escalations
  const getEscalations = async (filters?: {
    status?: string;
    priority?: string;
    floor?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.floor) params.append('floor', filters.floor);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await fetch(`/api/escalations?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch escalations');
      }
      
      return { success: true, data: data.data, pagination: data.pagination };
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch escalations';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createApprovalRequest,
    getPendingApprovals,
    getApprovalById,
    approveRequest,
    rejectRequest,
    escalateRequest,
    createCustomerWithWorkflow,
    createSaleWithWorkflow,
    createEscalation,
    getEscalations,
  };
} 