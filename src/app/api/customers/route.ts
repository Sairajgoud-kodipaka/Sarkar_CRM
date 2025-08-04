import { NextRequest, NextResponse } from 'next/server';

// Temporary mock data to get frontend working
const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    city: 'New York',
    state: 'NY',
    status: 'ACTIVE',
    floor: { id: '1', name: 'Floor 1' },
    assignedTo: { id: '1', name: 'Salesperson 1' },
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    city: 'Los Angeles',
    state: 'CA',
    status: 'PROSPECT',
    floor: { id: '2', name: 'Floor 2' },
    assignedTo: { id: '2', name: 'Salesperson 2' },
    created_at: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1234567892',
    city: 'Chicago',
    state: 'IL',
    status: 'CONVERTED',
    floor: { id: '1', name: 'Floor 1' },
    assignedTo: { id: '1', name: 'Salesperson 1' },
    created_at: '2024-01-17T12:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Filter customers based on search and status
    let filteredCustomers = mockCustomers;

    if (search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }

    if (status) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.status === status
      );
    }

    // Calculate pagination
    const total = filteredCustomers.length;
    const skip = (page - 1) * limit;
    const paginatedCustomers = filteredCustomers.slice(skip, skip + limit);

    // Calculate stats
    const stats = {
      total: mockCustomers.length,
      active: mockCustomers.filter(c => c.status === 'ACTIVE').length,
      inactive: mockCustomers.filter(c => c.status === 'INACTIVE').length,
      prospect: mockCustomers.filter(c => c.status === 'PROSPECT').length,
      converted: mockCustomers.filter(c => c.status === 'CONVERTED').length
    };

    return NextResponse.json({
      success: true,
      data: paginatedCustomers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error: any) {
    console.error('Customers GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      dateOfBirth,
      gender,
      occupation,
      incomeRange,
      socialCircle,
      occasions,
      budgetRange,
      notes,
      status = 'ACTIVE',
      floorId,
      assignedToId
    } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Create new customer (mock)
    const newCustomer = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      date_of_birth: dateOfBirth,
      gender,
      occupation,
      income_range: incomeRange,
      social_circle: socialCircle,
      occasions,
      budget_range: budgetRange,
      notes,
      status,
      floor: { id: floorId || '1', name: 'Floor 1' },
      assignedTo: { id: assignedToId || '1', name: 'Salesperson 1' },
      created_at: new Date().toISOString()
    };

    // Add to mock data
    mockCustomers.push(newCustomer);

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Customers POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
} 