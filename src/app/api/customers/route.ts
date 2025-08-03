import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/lib/services/customer.service';
// import { authenticateUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as any || undefined;
    const floorId = searchParams.get('floorId') || undefined;
    const assignedToId = searchParams.get('assignedToId') || undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    // Build filters with test store ID
    const filters = {
      storeId: 'test-store-id', // Use test store ID for now
      floorId: floorId,
      assignedToId,
      status,
      search,
      dateFrom,
      dateTo,
    };

    // Get customers
    const result = await CustomerService.getCustomers(filters, page, limit);

    return NextResponse.json({
      success: true,
      data: result.customers,
      pagination: result.pagination,
    });

  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Create customer data with test store ID
    const customerData = {
      ...body,
      storeId: 'test-store-id', // Use test store ID for now
      floorId: body.floorId,
      assignedToId: body.assignedToId,
    };

    // Create customer
    const customer = await CustomerService.createCustomer(customerData);

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
} 