import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const approval = await prisma.approval_workflows.findUnique({
      where: { id: params.id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!approval) {
      return NextResponse.json(
        { success: false, error: 'Approval not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: approval
    });
  } catch (error: any) {
    console.error('Error fetching approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch approval' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, approverId, notes } = body;

    // Validation
    if (!action || !approverId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: action, approverId' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED', 'ESCALATED'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be APPROVED, REJECTED, or ESCALATED' },
        { status: 400 }
      );
    }

    // Get current approval
    const currentApproval = await prisma.approval_workflows.findUnique({
      where: { id: params.id }
    });

    if (!currentApproval) {
      return NextResponse.json(
        { success: false, error: 'Approval not found' },
        { status: 404 }
      );
    }

    if (currentApproval.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Approval is not in pending status' },
        { status: 400 }
      );
    }

    // Verify approver exists
    const approver = await prisma.user.findUnique({
      where: { id: approverId }
    });

    if (!approver) {
      return NextResponse.json(
        { success: false, error: 'Approver not found' },
        { status: 404 }
      );
    }

    // Update approval
    const updateData: any = {
      status: action,
      approverId,
      updatedAt: new Date()
    };

    if (action === 'APPROVED') {
      updateData.approvedAt = new Date();
    }

    const approval = await prisma.approval_workflow.update({
      where: { id: params.id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Create audit log
    await prisma.audit_log.create({
      data: {
        userId: approverId,
        action: `APPROVAL_${action}`,
        entityType: 'APPROVAL_WORKFLOW',
        entityId: approval.id,
        oldData: currentApproval,
        newData: approval,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // If approved, execute the original action
    if (action === 'APPROVED') {
      await executeApprovedAction(approval);
    }

    return NextResponse.json({
      success: true,
      data: approval,
      message: `Approval ${action.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update approval' },
      { status: 500 }
    );
  }
}

// Function to execute the original action when approved
async function executeApprovedAction(approval: any) {
  try {
    const { actionType, requestData } = approval;

    switch (actionType) {
      case 'CUSTOMER_CREATE':
        await prisma.customer.create({
          data: {
            ...requestData,
            storeId: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
          }
        });
        break;

      case 'CUSTOMER_UPDATE':
        await prisma.customer.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'SALE_CREATE':
        await prisma.sale.create({
          data: {
            ...requestData,
            storeId: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
          }
        });
        break;

      case 'SALE_UPDATE':
        await prisma.sale.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'PRODUCT_UPDATE':
        await prisma.product.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'DISCOUNT_APPLY':
        // Handle discount application logic
        console.log('Applying discount:', requestData);
        break;

      default:
        console.warn('Unknown action type:', actionType);
    }
  } catch (error) {
    console.error('Error executing approved action:', error);
    // You might want to create a failed execution log here
  }
} 
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const approval = await prisma.approval_workflow.findUnique({
      where: { id: params.id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!approval) {
      return NextResponse.json(
        { success: false, error: 'Approval not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: approval
    });
  } catch (error: any) {
    console.error('Error fetching approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch approval' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, approverId, notes } = body;

    // Validation
    if (!action || !approverId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: action, approverId' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED', 'ESCALATED'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be APPROVED, REJECTED, or ESCALATED' },
        { status: 400 }
      );
    }

    // Get current approval
    const currentApproval = await prisma.approval_workflow.findUnique({
      where: { id: params.id }
    });

    if (!currentApproval) {
      return NextResponse.json(
        { success: false, error: 'Approval not found' },
        { status: 404 }
      );
    }

    if (currentApproval.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Approval is not in pending status' },
        { status: 400 }
      );
    }

    // Verify approver exists
    const approver = await prisma.user.findUnique({
      where: { id: approverId }
    });

    if (!approver) {
      return NextResponse.json(
        { success: false, error: 'Approver not found' },
        { status: 404 }
      );
    }

    // Update approval
    const updateData: any = {
      status: action,
      approverId,
      updatedAt: new Date()
    };

    if (action === 'APPROVED') {
      updateData.approvedAt = new Date();
    }

    const approval = await prisma.approval_workflow.update({
      where: { id: params.id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Create audit log
    await prisma.audit_log.create({
      data: {
        userId: approverId,
        action: `APPROVAL_${action}`,
        entityType: 'APPROVAL_WORKFLOW',
        entityId: approval.id,
        oldData: currentApproval,
        newData: approval,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // If approved, execute the original action
    if (action === 'APPROVED') {
      await executeApprovedAction(approval);
    }

    return NextResponse.json({
      success: true,
      data: approval,
      message: `Approval ${action.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update approval' },
      { status: 500 }
    );
  }
}

// Function to execute the original action when approved
async function executeApprovedAction(approval: any) {
  try {
    const { actionType, requestData } = approval;

    switch (actionType) {
      case 'CUSTOMER_CREATE':
        await prisma.customer.create({
          data: {
            ...requestData,
            storeId: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
          }
        });
        break;

      case 'CUSTOMER_UPDATE':
        await prisma.customer.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'SALE_CREATE':
        await prisma.sale.create({
          data: {
            ...requestData,
            storeId: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
          }
        });
        break;

      case 'SALE_UPDATE':
        await prisma.sale.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'PRODUCT_UPDATE':
        await prisma.product.update({
          where: { id: requestData.id },
          data: requestData
        });
        break;

      case 'DISCOUNT_APPLY':
        // Handle discount application logic
        console.log('Applying discount:', requestData);
        break;

      default:
        console.warn('Unknown action type:', actionType);
    }
  } catch (error) {
    console.error('Error executing approved action:', error);
    // You might want to create a failed execution log here
  }
} 