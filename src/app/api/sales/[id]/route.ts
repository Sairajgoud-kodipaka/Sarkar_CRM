import { NextRequest, NextResponse } from 'next/server';

// Mock sales data
const mockSales = [
  {
    id: '1',
    customer_id: '1',
    product_id: '1',
    amount: 2500.00,
    quantity: 1,
    discount: 0,
    total_amount: 2500.00,
    payment_method: 'CASH',
    status: 'COMPLETED',
    floor_id: '1',
    user_id: '1',
    notes: 'Diamond ring sale',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    product: {
      id: '1',
      name: 'Diamond Ring',
      price: 2500.00,
      images: ['/images/diamond-ring.jpg']
    },
    floor: {
      id: '1',
      name: 'Ground Floor'
    },
    user: {
      id: '1',
      name: 'Salesperson 1',
      email: 'sales1@example.com'
    }
  },
  {
    id: '2',
    customer_id: '2',
    product_id: '2',
    amount: 1200.00,
    quantity: 1,
    discount: 100,
    total_amount: 1100.00,
    payment_method: 'CREDIT_CARD',
    status: 'COMPLETED',
    floor_id: '2',
    user_id: '2',
    notes: 'Sapphire necklace with discount',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    customer: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891'
    },
    product: {
      id: '2',
      name: 'Sapphire Necklace',
      price: 1200.00,
      images: ['/images/sapphire-necklace.jpg']
    },
    floor: {
      id: '2',
      name: 'First Floor'
    },
    user: {
      id: '2',
      name: 'Salesperson 2',
      email: 'sales2@example.com'
    }
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sale = mockSales.find(s => s.id === id);

    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sale' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerId || !body.productId || !body.amount) {
      return NextResponse.json(
        { success: false, error: 'Customer ID, Product ID, and Amount are required' },
        { status: 400 }
      );
    }

    // Check if sale exists
    const existingSale = mockSales.find(s => s.id === id);

    if (!existingSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Create updated sale object
    const updatedSale = {
      ...existingSale,
      customer_id: body.customerId,
      product_id: body.productId,
      amount: parseFloat(body.amount),
      quantity: body.quantity || 1,
      discount: body.discount ? parseFloat(body.discount) : 0,
      total_amount: body.totalAmount ? parseFloat(body.totalAmount) : parseFloat(body.amount),
      payment_method: body.paymentMethod,
      status: body.status,
      floor_id: body.floorId,
      user_id: body.userId || existingSale.user_id,
      notes: body.notes,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedSale,
      message: 'Sale updated successfully'
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sale' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if sale exists
    const existingSale = mockSales.find(s => s.id === id);

    if (!existingSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
} 