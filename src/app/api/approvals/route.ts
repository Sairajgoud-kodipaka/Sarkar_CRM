import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkflowService } from '@/lib/workflow';

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
    if (requesterId) where.requesterId = requesterId;
    if (approverId) where.approverId = approverId;
    if (priority) where.priority = priority;

    // Get approvals with pagination
    const approvals = await prisma.approval_workflows.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
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
    const requester = await prisma.user.findUnique({
      where: { id: requesterId }
    });

    if (!requester) {
      return NextResponse.json(
        { success: false, error: 'Requester not found' },
        { status: 404 }
      );
    }

    // Create approval workflow
    const approval = await prisma.approval_workflows.create({
      data: {
        actionType,
        requesterId,
        status: 'PENDING',
        requestData,
        approvalNotes,
        priority
      },
      include: {
        requester: {
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
        userId: requesterId,
        action: 'APPROVAL_REQUEST_CREATED',
        entityType: 'APPROVAL_WORKFLOW',
        entityId: approval.id,
        newData: approval,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: approval,
      message: 'Approval request created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating approval request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create approval request' },
      { status: 500 }
    );
  }
} 
import { prisma } from '@/lib/prisma';
import { WorkflowService } from '@/lib/workflow';

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
    if (requesterId) where.requesterId = requesterId;
    if (approverId) where.approverId = approverId;
    if (priority) where.priority = priority;

    // Get approvals with pagination
    const approvals = await prisma.approval_workflows.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
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
    const requester = await prisma.user.findUnique({
      where: { id: requesterId }
    });

    if (!requester) {
      return NextResponse.json(
        { success: false, error: 'Requester not found' },
        { status: 404 }
      );
    }

    // Create approval workflow
    const approval = await prisma.approval_workflows.create({
      data: {
        actionType,
        requesterId,
        status: 'PENDING',
        requestData,
        approvalNotes,
        priority
      },
      include: {
        requester: {
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
        userId: requesterId,
        action: 'APPROVAL_REQUEST_CREATED',
        entityType: 'APPROVAL_WORKFLOW',
        entityId: approval.id,
        newData: approval,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: approval,
      message: 'Approval request created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating approval request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create approval request' },
      { status: 500 }
    );
  }
} 

