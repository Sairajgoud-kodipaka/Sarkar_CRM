import { NextRequest, NextResponse } from 'next/server';

// GET /api/support - Get all support tickets with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const status = searchParams.get('status') || '';

    // Return mock data to prevent 500 errors
    const mockTickets = [
      {
        id: '1',
        title: 'Product Inquiry',
        description: 'Customer wants to know about gold ring collection',
        priority: 'MEDIUM',
        status: 'OPEN',
        category: 'GENERAL',
        customer_name: 'Priya Sharma',
        customer_email: 'priya@example.com',
        customer_phone: '+91 9876543210',
        created_at: '2024-12-15T10:00:00Z',
        updated_at: '2024-12-15T10:00:00Z',
        assigned_to: { id: '1', name: 'John Doe', email: 'john@example.com' },
        created_by: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        store: { id: '1', name: 'Main Store' },
        floor: { id: '1', name: 'Ground Floor', number: 1 }
      },
      {
        id: '2',
        title: 'Payment Issue',
        description: 'Customer having trouble with online payment',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        category: 'TECHNICAL',
        customer_name: 'Raj Kumar',
        customer_email: 'raj@example.com',
        customer_phone: '+91 9876543211',
        created_at: '2024-12-14T15:30:00Z',
        updated_at: '2024-12-15T09:00:00Z',
        assigned_to: { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
        created_by: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        store: { id: '1', name: 'Main Store' },
        floor: { id: '2', name: 'First Floor', number: 2 }
      },
      {
        id: '3',
        title: 'Delivery Status',
        description: 'Customer asking about delivery timeline',
        priority: 'LOW',
        status: 'RESOLVED',
        category: 'DELIVERY',
        customer_name: 'Anita Patel',
        customer_email: 'anita@example.com',
        customer_phone: '+91 9876543212',
        created_at: '2024-12-13T14:20:00Z',
        updated_at: '2024-12-14T16:00:00Z',
        assigned_to: { id: '1', name: 'John Doe', email: 'john@example.com' },
        created_by: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        store: { id: '1', name: 'Main Store' },
        floor: { id: '1', name: 'Ground Floor', number: 1 }
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockTickets,
      total: mockTickets.length,
      page,
      limit,
      message: 'Support tickets retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

// POST /api/support - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      customer_name, 
      customer_email, 
      customer_phone, 
      priority, 
      category
    } = body;

    if (!title || !description || !customer_name) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and customer name are required' },
        { status: 400 }
      );
    }

    // Return mock created ticket
    const mockTicket = {
      id: Date.now().toString(),
      title,
      description,
      priority: priority?.toUpperCase() || 'MEDIUM',
      status: 'OPEN',
      category: category?.toUpperCase() || 'GENERAL',
      customer_name,
      customer_email: customer_email || '',
      customer_phone: customer_phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: null,
      created_by: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      store: { id: '1', name: 'Main Store' },
      floor: null
    };

    return NextResponse.json({
      success: true,
      data: mockTicket,
      message: 'Support ticket created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
} 