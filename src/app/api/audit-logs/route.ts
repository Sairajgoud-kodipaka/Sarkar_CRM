import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/audit-logs - Get audit logs with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    const action = searchParams.get('action');
    const resourceType = searchParams.get('resourceType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (userRole) {
      where.userRole = userRole;
    }
    if (action) {
      where.action = action;
    }
    if (resourceType) {
      where.resourceType = resourceType;
    }
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // Get audit logs with pagination
    const auditLogs = await prisma.audit_logs.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.audit_logs.count({ where });

    return NextResponse.json({
      success: true,
      data: auditLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// POST /api/audit-logs - Create audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userRole,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    } = body;

    // Validate required fields
    if (!userId || !userRole || !action || !resourceType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create audit log
    const auditLog = await prisma.audit_logs.create({
      data: {
        userId,
        userRole,
        action,
        resourceType,
        resourceId: resourceId || null,
        details: details || {},
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
        timestamp: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: auditLog,
      message: 'Audit log created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
} 