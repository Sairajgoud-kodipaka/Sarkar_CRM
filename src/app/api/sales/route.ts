import { NextRequest, NextResponse } from 'next/server';

// Temporary mock data to get frontend working
const mockSales = [
  {
    id: '1',
    customer_id: '1',
    customer: { id: '1', name: 'John Doe', email: 'john@example.com' },
    product_id: '1',
    product: { id: '1', name: 'Diamond Ring', price: 2500.00 },
    amount: 2500.00,
    quantity: 1,
    status: 'COMPLETED',
    payment_method: 'CREDIT_CARD',
    salesperson_id: '1',
    salesperson: { id: '1', name: 'Salesperson 1' },
    floor_id: '1',
    floor: { id: '1', name: 'Floor 1' },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    customer_id: '2',
    customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    product_id: '2',
    product: { id: '2', name: 'Sapphire Necklace', price: 1200.00 },
    amount: 1200.00,
    quantity: 1,
    status: 'PENDING',
    payment_method: 'CASH',
    salesperson_id: '2',
    salesperson: { id: '2', name: 'Salesperson 2' },
    floor_id: '2',
    floor: { id: '2', name: 'Floor 2' },
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    customer_id: '3',
    customer: { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    product_id: '3',
    product: { id: '3', name: 'Emerald Earrings', price: 1800.00 },
    amount: 1800.00,
    quantity: 1,
    status: 'COMPLETED',
    payment_method: 'BANK_TRANSFER',
    salesperson_id: '1',
    salesperson: { id: '1', name: 'Salesperson 1' },
    floor_id: '1',
    floor: { id: '1', name: 'Floor 1' },
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || '';
    const floorId = searchParams.get('floorId') || '';
    const salespersonId = searchParams.get('salespersonId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // Filter sales based on parameters
    let filteredSales = mockSales;

    if (status) {
      filteredSales = filteredSales.filter(sale => sale.status === status);
    }

    if (floorId) {
      filteredSales = filteredSales.filter(sale => sale.floor_id === floorId);
    }

    if (salespersonId) {
      filteredSales = filteredSales.filter(sale => sale.salesperson_id === salespersonId);
    }

    if (startDate && endDate) {
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return saleDate >= start && saleDate <= end;
      });
    }

    // Calculate pagination
    const total = filteredSales.length;
    const skip = (page - 1) * limit;
    const paginatedSales = filteredSales.slice(skip, skip + limit);

    // Calculate stats
    const stats = {
      total: mockSales.length,
      completed: mockSales.filter(s => s.status === 'COMPLETED').length,
      pending: mockSales.filter(s => s.status === 'PENDING').length,
      totalRevenue: mockSales.reduce((sum, s) => sum + s.amount, 0),
      averageSale: mockSales.reduce((sum, s) => sum + s.amount, 0) / mockSales.length
    };

    return NextResponse.json({
      success: true,
      data: paginatedSales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error: any) {
    console.error('Sales GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      productId,
      amount,
      quantity = 1,
      status = 'PENDING',
      paymentMethod,
      salespersonId,
      floorId,
      notes
    } = body;

    // Validate required fields
    if (!customerId || !productId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Customer ID, Product ID, and Amount are required' },
        { status: 400 }
      );
    }

    // Create new sale (mock)
    const newSale = {
      id: Date.now().toString(),
      customer_id: customerId,
      customer: { id: customerId, name: 'Customer Name', email: 'customer@example.com' },
      product_id: productId,
      product: { id: productId, name: 'Product Name', price: amount },
      amount: parseFloat(amount),
      quantity,
      status,
      payment_method: paymentMethod || 'CASH',
      salesperson_id: salespersonId,
      salesperson: { id: salespersonId, name: 'Salesperson Name' },
      floor_id: floorId,
      floor: { id: floorId, name: 'Floor Name' },
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockSales.push(newSale);

    return NextResponse.json({
      success: true,
      data: newSale,
      message: 'Sale created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Sales POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create sale' },
      { status: 500 }
    );
  }
} 