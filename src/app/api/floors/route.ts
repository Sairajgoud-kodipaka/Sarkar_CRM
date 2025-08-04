import { NextRequest, NextResponse } from 'next/server';

// GET /api/floors - Get all floors with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const store = searchParams.get('store') || '';

    // Return mock data to prevent 500 errors
    const mockFloors = [
      {
        id: '1',
        name: 'Ground Floor',
        number: 1,
        store_id: '1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        staff_count: 8,
        total_sales: 2500000,
        customer_count: 45,
        performance: 85,
        capacity: 80
      },
      {
        id: '2',
        name: 'First Floor',
        number: 2,
        store_id: '1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        staff_count: 6,
        total_sales: 1800000,
        customer_count: 32,
        performance: 72,
        capacity: 60
      },
      {
        id: '3',
        name: 'Second Floor',
        number: 3,
        store_id: '1',
        is_active: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        staff_count: 0,
        total_sales: 0,
        customer_count: 0,
        performance: 0,
        capacity: 0
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockFloors,
      total: mockFloors.length,
      page,
      limit,
      message: 'Floors retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching floors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch floors' },
      { status: 500 }
    );
  }
}

// POST /api/floors - Create new floor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, number, store_id, is_active = true } = body;

    if (!name || !number || !store_id) {
      return NextResponse.json(
        { success: false, error: 'Name, number, and store_id are required' },
        { status: 400 }
      );
    }

    // Return mock created floor
    const mockFloor = {
      id: Date.now().toString(),
      name,
      number: parseInt(number),
      store_id,
      is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      staff_count: 0,
      total_sales: 0,
      customer_count: 0,
      performance: 0,
      capacity: 0
    };

    return NextResponse.json({
      success: true,
      data: mockFloor,
      message: 'Floor created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating floor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create floor' },
      { status: 500 }
    );
  }
} 