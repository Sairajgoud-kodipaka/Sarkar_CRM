import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';
    const actionType = searchParams.get('actionType') || '';
    const requesterId = searchParams.get('requesterId') || '';
    const approverId = searchParams.get('approverId') || '';
    const priority = searchParams.get('priority') || '';

    // Build where clause
    const where: any = {};

    if (status) where.status = status;
    if (actionType) where.actionType = actionType;
    if (requesterId) where.requester_id = requesterId;
    if (approverId) where.approver_id = approverId;
    if (priority) where.priority = priority;

    // Get approvals with pagination
    const approvals = await prisma.approval_workflows.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        users_approval_workflows_requester_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        users_approval_workflows_approver_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Get total count
    const total = await prisma.approval_workflows.count({ where });

    return NextResponse.json({
      success: true,
      data: approvals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      actionType,
      requesterId,
      requestData,
      approvalNotes,
      priority = 'MEDIUM'
    } = body;

    // Validation
    if (!actionType || !requesterId || !requestData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: actionType, requesterId, requestData' },
        { status: 400 }
      );
    }

    // Verify requester exists
    const requester = await prisma.users.findUnique({
      where: { id: requesterId }
    });

    if (!requester) {
      return NextResponse.json(
        { success: false, error: 'Requester not found' },
        { status: 404 }
      );
    }

    // Create approval request
    const approval = await prisma.approval_workflows.create({
      data: {
        actionType: actionType,
        requester_id: requesterId,
        requestData: requestData,
        approval_notes: approvalNotes,
        priority,
        status: 'PENDING'
      },
      include: {
        users_approval_workflows_requester_idTousers: {
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
    await prisma.audit_logs.create({
      data: {
        user_id: requesterId,
        action: 'APPROVAL_REQUEST_CREATED',
        entity_type: 'APPROVAL_WORKFLOW',
        entity_id: approval.id,
        oldData: {},
        newData: requestData,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: approval,
      message: 'Approval request created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating approval:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create approval' },
      { status: 500 }
    );
  }
} 

