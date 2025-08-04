import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sale = await prisma.sales.findUnique({
      where: { id: id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        },
        floor: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

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
  } catch (error: any) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sale' },
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
    const existingSale = await prisma.sales.findUnique({
      where: { id: id }
    });

    if (!existingSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Update sale
    const updatedSale = await prisma.sales.update({
      where: { id: id },
      data: {
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
        updated_at: new Date()
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        },
        floor: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSale,
      message: 'Sale updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update sale' },
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
    const existingSale = await prisma.sales.findUnique({
      where: { id: id }
    });

    if (!existingSale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Delete sale
    await prisma.sales.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete sale' },
      { status: 500 }
    );
  }
} 