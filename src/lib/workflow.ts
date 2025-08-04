// Workflow Management System for Sarkar CRM
// Handles approval workflows, escalations, and role-based permissions

export interface ApprovalWorkflow {
  id: string;
  actionType: 'CUSTOMER_CREATE' | 'CUSTOMER_UPDATE' | 'SALE_CREATE' | 'SALE_UPDATE' | 'PRODUCT_UPDATE' | 'DISCOUNT_APPLY' | 'FLOOR_ASSIGNMENT';
  requesterId: string;
  approverId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'CANCELLED';
  requestData: any;
  approvalNotes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
}

export interface Escalation {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  requesterId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Permission Matrix
export const PERMISSION_MATRIX = {
  BUSINESS_ADMIN: {
    customers: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    sales: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    products: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    floors: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
    team: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'],
    analytics: ['READ', 'EXPORT', 'CONFIGURE'],
    settings: ['READ', 'UPDATE', 'CONFIGURE'],
    approvals: ['READ', 'APPROVE', 'REJECT', 'ESCALATE'],
    escalations: ['READ', 'ASSIGN', 'RESOLVE', 'CLOSE'],
    audit: ['READ', 'EXPORT']
  },
  FLOOR_MANAGER: {
    customers: ['READ', 'CREATE_PENDING', 'UPDATE_PENDING'],
    sales: ['READ', 'CREATE_PENDING', 'UPDATE_PENDING'],
    products: ['READ'],
    floors: ['READ'],
    team: ['READ'],
    analytics: ['READ_FLOOR_ONLY'],
    settings: ['READ'],
    approvals: ['READ_OWN', 'REQUEST'],
    escalations: ['READ_OWN', 'CREATE'],
    audit: ['READ_OWN']
  },
  SALESPERSON: {
    customers: ['READ', 'CREATE_PENDING', 'UPDATE_PENDING'],
    sales: ['READ', 'CREATE_PENDING', 'UPDATE_PENDING'],
    products: ['READ'],
    floors: ['READ'],
    team: ['READ'],
    analytics: ['READ_OWN_ONLY'],
    settings: ['READ'],
    approvals: ['READ_OWN', 'REQUEST'],
    escalations: ['READ_OWN', 'CREATE'],
    audit: ['READ_OWN']
  }
} as const;

// Approval Thresholds
export const APPROVAL_THRESHOLDS = {
  SALE_AMOUNT: 50000, // ₹50,000 - Sales above this require approval
  DISCOUNT_PERCENTAGE: 15, // 15% - Discounts above this require approval
  CUSTOMER_UPDATE: 'HIGH_VALUE', // High-value customer updates require approval
  PRODUCT_PRICE_CHANGE: 10, // 10% - Price changes above this require approval
} as const;

// Workflow Service
export class WorkflowService {
  // Check if action requires approval
  static requiresApproval(actionType: string, data: any): boolean {
    switch (actionType) {
      case 'SALE_CREATE':
        return data.amount > APPROVAL_THRESHOLDS.SALE_AMOUNT;
      case 'DISCOUNT_APPLY':
        return data.discountPercentage > APPROVAL_THRESHOLDS.DISCOUNT_PERCENTAGE;
      case 'PRODUCT_UPDATE':
        return this.calculatePriceChange(data.oldPrice, data.newPrice) > APPROVAL_THRESHOLDS.PRODUCT_PRICE_CHANGE;
      case 'CUSTOMER_UPDATE':
        return data.customerValue === 'HIGH_VALUE';
      default:
        return false;
    }
  }

  // Calculate price change percentage
  private static calculatePriceChange(oldPrice: number, newPrice: number): number {
    return Math.abs((newPrice - oldPrice) / oldPrice) * 100;
  }

  // Get approval priority
  static getApprovalPriority(actionType: string, data: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    switch (actionType) {
      case 'SALE_CREATE':
        if (data.amount > 100000) return 'URGENT';
        if (data.amount > 75000) return 'HIGH';
        return 'MEDIUM';
      case 'ESCALATION':
        return data.priority || 'MEDIUM';
      default:
        return 'MEDIUM';
    }
  }

  // Check user permissions
  static hasPermission(userRole: string, resource: string, action: string): boolean {
    const permissions = PERMISSION_MATRIX[userRole as keyof typeof PERMISSION_MATRIX];
    if (!permissions) return false;
    
    const resourcePermissions = permissions[resource as keyof typeof permissions];
    if (!resourcePermissions) return false;
    
    return (resourcePermissions as readonly string[]).includes(action);
  }

  // Get pending approvals for user
  static async getPendingApprovals(userId: string, userRole: string): Promise<ApprovalWorkflow[]> {
    // This would be implemented with actual database calls
    // For now, return mock data
    return [];
  }

  // Get escalations for user
  static async getEscalations(userId: string, userRole: string): Promise<Escalation[]> {
    // This would be implemented with actual database calls
    // For now, return mock data
    return [];
  }

  // Create approval request
  static async createApprovalRequest(workflow: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApprovalWorkflow> {
    // This would be implemented with actual database calls
    // For now, return mock data
    return {
      ...workflow,
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Create escalation
  static async createEscalation(escalation: Omit<Escalation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Escalation> {
    // This would be implemented with actual database calls
    // For now, return mock data
    return {
      ...escalation,
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Create audit log
  static async createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    // This would be implemented with actual database calls
    // For now, return mock data
    return {
      ...log,
      id: 'mock-id',
      createdAt: new Date()
    };
  }
}

// Hook for workflow functionality
export function useWorkflow() {
  const checkPermission = (resource: string, action: string, userRole?: string) => {
    if (!userRole) return false;
    return WorkflowService.hasPermission(userRole, resource, action);
  };

  const requiresApproval = (actionType: string, data: any) => {
    return WorkflowService.requiresApproval(actionType, data);
  };

  const getApprovalPriority = (actionType: string, data: any) => {
    return WorkflowService.getApprovalPriority(actionType, data);
  };

  return {
    checkPermission,
    requiresApproval,
    getApprovalPriority,
    WorkflowService
  };
} 