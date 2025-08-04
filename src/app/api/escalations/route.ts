import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/escalations - Get all escalations with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const floor = searchParams.get('floor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }
    if (floor) {
      where.floor = floor;
    }

    // Get escalations with pagination
    const escalations = await prisma.escalations.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.escalations.count({ where });

    return NextResponse.json({
      success: true,
      data: escalations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching escalations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch escalations' },
      { status: 500 }
    );
  }
}

// POST /api/escalations - Create new escalation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      requesterId,
      requesterRole,
      floor
    } = body;

    // Validate required fields
    if (!title || !description || !priority || !requesterId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create escalation
    const escalation = await prisma.escalations.create({
      data: {
        title,
        description,
        priority,
        status: 'OPEN',
        requesterId,
        requesterRole,
        floor: floor || null,
        createdAt: new Date(),
        updatedAt: new Date()
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
    await prisma.audit_logs.create({
      data: {
        userId: requesterId,
        userRole: requesterRole,
        action: 'ESCALATION_CREATE',
        resourceType: 'ESCALATION',
        resourceId: escalation.id,
        details: {
          title,
          priority,
          floor
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: escalation,
      message: 'Escalation created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating escalation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create escalation' },
      { status: 500 }
    );
  }
} 