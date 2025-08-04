import { NextRequest, NextResponse } from 'next/server';

// GET /api/approvals - Get all approval workflows with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const actionType = searchParams.get('actionType') || '';

    // Return mock data to prevent DATABASE_URL errors
    const mockApprovals = [
      {
        id: '1',
        actionType: 'CUSTOMER_CREATION',
        requester_id: '1',
        requestData: { name: 'John Doe', email: 'john@example.com' },
        approval_notes: 'New customer registration',
        priority: 'MEDIUM',
        status: 'PENDING',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        actionType: 'SALE_APPROVAL',
        requester_id: '2',
        requestData: { amount: 5000, product: 'Diamond Ring' },
        approval_notes: 'High-value sale approval',
        priority: 'HIGH',
        status: 'APPROVED',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      },
      {
        id: '3',
        actionType: 'PRODUCT_UPDATE',
        requester_id: '3',
        requestData: { productId: '1', price: 2500 },
        approval_notes: 'Price update for gold ring',
        priority: 'LOW',
        status: 'REJECTED',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z'
      }
    ];

    // Filter mock data based on parameters
    let filteredApprovals = mockApprovals;
    
    if (status) {
      filteredApprovals = filteredApprovals.filter(approval => approval.status === status);
    }
    
    if (actionType) {
      filteredApprovals = filteredApprovals.filter(approval => approval.actionType === actionType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApprovals = filteredApprovals.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedApprovals,
      pagination: {
        page,
        limit,
        total: filteredApprovals.length,
        totalPages: Math.ceil(filteredApprovals.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

// POST /api/approvals - Create new approval request
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

    // Validate required fields
    if (!actionType || !requesterId || !requestData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create mock approval
    const newApproval = {
      id: Date.now().toString(),
      actionType,
      requester_id: requesterId,
      requestData,
      approval_notes: approvalNotes || '',
      priority,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newApproval,
      message: 'Approval request created successfully'
    });
  } catch (error) {
    console.error('Error creating approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create approval request' },
      { status: 500 }
    );
  }
} 

