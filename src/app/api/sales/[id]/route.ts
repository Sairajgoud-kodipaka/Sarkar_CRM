import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkflowService } from '@/lib/workflow';

// GET /api/sales/[id] - Get a specific sale
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saleId = params.id;

    // Validate sale ID
    if (!saleId) {
      return NextResponse.json(
        { success: false, message: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Get sale with related data
    const sale = await prisma.sales.findUnique({
      where: { id: saleId },
      include: {
        customer: true,
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        floor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!sale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/sales/[id] - Update a sale
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saleId = params.id;
    const requesterId = request.headers.get('x-user-id');
    const body = await request.json();

    // Validate sale ID
    if (!saleId) {
      return NextResponse.json(
        { success: false, message: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Validate requester
    if (!requesterId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 401 }
      );
    }

    // Get the existing sale
    const existingSale = await prisma.sales.findUnique({
      where: { id: saleId },
      include: { customer: true }
    });

    if (!existingSale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    // Check if approval is required for the update
    const requiresApproval = WorkflowService.requiresApproval('SALE_UPDATE', {
      originalAmount: existingSale.amount,
      newAmount: body.amount,
      originalDiscount: existingSale.discount,
      newDiscount: body.discount,
      customerId: existingSale.customer_id,
      saleId: saleId
    });

    if (requiresApproval) {
      // Create approval request for sale update
      const approval = await prisma.approval_workflows.create({
        data: {
          actionType: 'SALE_UPDATE',
          requester_id: requesterId,
          status: 'PENDING',
          requestData: {
            saleId: saleId,
            originalData: existingSale,
            newData: body,
            updateType: 'SALE_MODIFICATION'
          },
          approval_notes: `Sale update request for sale #${saleId} - Amount: ₹${existingSale.amount} → ₹${body.amount}`,
          priority: WorkflowService.getApprovalPriority('SALE_UPDATE', {
            amountChange: Math.abs(Number(body.amount) - Number(existingSale.amount)),
            discountChange: (Number(body.discount) || 0) - (Number(existingSale.discount) || 0)
          })
        }
      });

      // Create audit log
      await prisma.audit_logs.create({
        data: {
          user_id: requesterId,
          action: 'SALE_UPDATE_APPROVAL_REQUESTED',
          entity_type: 'SALE',
          entity_id: saleId,
          oldData: existingSale,
          newData: { ...body, approvalId: approval.id },
          ip_address: request.headers.get('x-forwarded-for'),
          user_agent: request.headers.get('user-agent')
        }
      });

      return NextResponse.json({
        success: true,
        data: { approvalId: approval.id, status: 'PENDING_APPROVAL' },
        message: 'Sale update request submitted for approval',
      }, { status: 202 });
    }

    // Update sale directly if no approval required
    const updatedSale = await prisma.sales.update({
      where: { id: saleId },
      data: {
        amount: body.amount,
        discount: body.discount,
        status: body.status,
        notes: body.notes,
        updated_at: new Date()
      },
      include: {
        customer: true,
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        floor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Create audit log for direct update
    await prisma.audit_logs.create({
      data: {
        user_id: requesterId,
        action: 'SALE_UPDATED',
        entity_type: 'SALE',
        entity_id: saleId,
        oldData: existingSale,
        newData: updatedSale,
        ip_address: request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent')
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSale,
      message: 'Sale updated successfully'
    });

  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sales/[id] - Delete a sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saleId = params.id;
    const requesterId = request.headers.get('x-user-id');

    // Validate sale ID
    if (!saleId) {
      return NextResponse.json(
        { success: false, message: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Validate requester
    if (!requesterId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 401 }
      );
    }

    // Get the existing sale
    const existingSale = await prisma.sales.findUnique({
      where: { id: saleId },
      include: { customer: true }
    });

    if (!existingSale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    // Check if approval is required for deletion
    const requiresApproval = WorkflowService.requiresApproval('SALE_DELETE', {
      amount: existingSale.amount,
      customerId: existingSale.customer_id,
      saleId: saleId,
      saleAge: Date.now() - (existingSale.created_at ? new Date(existingSale.created_at).getTime() : 0)
    });

    if (requiresApproval) {
      // Create approval request for sale deletion
      const approval = await prisma.approval_workflows.create({
        data: {
          actionType: 'SALE_DELETE',
          requester_id: requesterId,
          status: 'PENDING',
          requestData: {
            saleId: saleId,
            saleData: existingSale,
            deleteReason: request.nextUrl.searchParams.get('reason') || 'No reason provided'
          },
          approval_notes: `Sale deletion request for sale #${saleId} - Amount: ₹${existingSale.amount}`,
          priority: WorkflowService.getApprovalPriority('SALE_DELETE', {
            amount: existingSale.amount,
            saleAge: Date.now() - (existingSale.created_at ? new Date(existingSale.created_at).getTime() : 0)
          })
        }
      });

      // Create audit log
      await prisma.audit_logs.create({
        data: {
          user_id: requesterId,
          action: 'SALE_DELETE_APPROVAL_REQUESTED',
          entity_type: 'SALE',
          entity_id: saleId,
          oldData: existingSale,
          newData: { approvalId: approval.id },
          ip_address: request.headers.get('x-forwarded-for'),
          user_agent: request.headers.get('user-agent')
        }
      });

      return NextResponse.json({
        success: true,
        data: { approvalId: approval.id, status: 'PENDING_APPROVAL' },
        message: 'Sale deletion request submitted for approval',
      }, { status: 202 });
    }

    // Delete sale directly if no approval required
    await prisma.sales.delete({
      where: { id: saleId }
    });

    // Create audit log for direct deletion
    await prisma.audit_logs.create({
      data: {
        user_id: requesterId,
        action: 'SALE_DELETED',
        entity_type: 'SALE',
        entity_id: saleId,
        oldData: existingSale,
                  newData: {},
        ip_address: request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent')
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 