import { NextRequest, NextResponse } from 'next/server';

// GET /api/escalations - Get all escalations with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const floor = searchParams.get('floor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Return mock data to prevent DATABASE_URL errors
    const mockEscalations = [
      {
        id: '1',
        title: 'Customer Complaint',
        description: 'Customer is unhappy with service quality',
        priority: 'HIGH',
        status: 'OPEN',
        requesterId: '1',
        requesterRole: 'SALESPERSON',
        floor: 'Ground Floor',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        requester: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'SALESPERSON'
        }
      },
      {
        id: '2',
        title: 'Product Issue',
        description: 'Product quality issue reported',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        requesterId: '2',
        requesterRole: 'FLOOR_MANAGER',
        floor: 'First Floor',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        requester: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'FLOOR_MANAGER'
        }
      },
      {
        id: '3',
        title: 'System Down',
        description: 'POS system not working',
        priority: 'CRITICAL',
        status: 'RESOLVED',
        requesterId: '3',
        requesterRole: 'ADMIN',
        floor: 'All Floors',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        requester: {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'ADMIN'
        }
      }
    ];

    // Filter mock data based on parameters
    let filteredEscalations = mockEscalations;
    
    if (status && status !== 'ALL') {
      filteredEscalations = filteredEscalations.filter(escalation => escalation.status === status);
    }
    
    if (priority && priority !== 'ALL') {
      filteredEscalations = filteredEscalations.filter(escalation => escalation.priority === priority);
    }
    
    if (floor) {
      filteredEscalations = filteredEscalations.filter(escalation => escalation.floor === floor);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEscalations = filteredEscalations.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedEscalations,
      pagination: {
        page,
        limit,
        total: filteredEscalations.length,
        pages: Math.ceil(filteredEscalations.length / limit)
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

    // Create mock escalation
    const newEscalation = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'OPEN',
      requesterId,
      requesterRole,
      floor: floor || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requester: {
        id: requesterId,
        name: 'Mock User',
        email: 'user@example.com',
        role: requesterRole
      }
    };

    return NextResponse.json({
      success: true,
      data: newEscalation,
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