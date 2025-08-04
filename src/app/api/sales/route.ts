import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const floorId = searchParams.get('floorId') || '';
    const customerId = searchParams.get('customerId') || '';
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      store_id: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
    };

    if (status) where.status = status;
    if (floorId) where.floor_id = floorId;
    if (customerId) where.customer_id = customerId;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = startDate;
      if (endDate) where.created_at.lte = endDate;
    }

    // Get sales with pagination
    const sales = await prisma.sales.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count
    const total = await prisma.sales.count({ where });

    // Fetch related data for each sale
    const salesWithRelations = await Promise.all(
      sales.map(async (sale) => {
        const [customer, product, floor, user] = await Promise.all([
          prisma.customers.findUnique({
            where: { id: sale.customer_id },
            select: { id: true, name: true, phone: true }
          }),
          prisma.products.findUnique({
            where: { id: sale.product_id },
            select: { id: true, name: true, sku: true }
          }),
          prisma.floors.findUnique({
            where: { id: sale.floor_id },
            select: { id: true, name: true }
          }),
          prisma.users.findUnique({
            where: { id: sale.user_id },
            select: { id: true, name: true }
          })
        ]);

        return {
          ...sale,
          customer,
          product,
          floor,
          user
        };
      })
    );

    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);

    return NextResponse.json({
      success: true,
      data: salesWithRelations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      totalRevenue
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
      floorId,
      amount,
      quantity = 1,
      discount = 0,
      paymentMethod = 'CASH',
      notes = '',
      storeId = '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
    } = body;

    // Validation
    if (!customerId || !productId || !floorId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerId, productId, floorId, amount' },
        { status: 400 }
      );
    }

    if (amount <= 0 || quantity <= 0 || discount < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount, quantity, or discount values' },
        { status: 400 }
      );
    }

    // Verify customer, product, and floor exist
    const [customer, product, floor] = await Promise.all([
      prisma.customers.findUnique({ where: { id: customerId } }),
      prisma.products.findUnique({ where: { id: productId } }),
      prisma.floors.findUnique({ where: { id: floorId } })
    ]);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!floor) {
      return NextResponse.json(
        { success: false, error: 'Floor not found' },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = (parseFloat(amount) * parseInt(quantity)) - parseFloat(discount);
    
    // Create the sale
    const sale = await prisma.sales.create({
      data: {
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
        discount: parseFloat(discount),
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'COMPLETED',
        notes,
        store_id: storeId,
        floor_id: floorId,
        customer_id: customerId,
        product_id: productId,
        user_id: '550e8400-e29b-41d4-a716-446655440008' // Use proper UUID for user
      }
    });

    // Fetch related data for the created sale
    const [saleCustomer, saleProduct, saleFloor, saleUser] = await Promise.all([
      prisma.customers.findUnique({
        where: { id: sale.customer_id },
        select: { id: true, name: true, phone: true, email: true }
      }),
      prisma.products.findUnique({
        where: { id: sale.product_id },
        select: { id: true, name: true, sku: true, price: true }
      }),
      prisma.floors.findUnique({
        where: { id: sale.floor_id },
        select: { id: true, name: true, number: true }
      }),
      prisma.users.findUnique({
        where: { id: sale.user_id },
        select: { id: true, name: true, email: true }
      })
    ]);

    const saleWithRelations = {
      ...sale,
      customer: saleCustomer,
      product: saleProduct,
      floor: saleFloor,
      user: saleUser
    };

    // Create interaction record for this sale
    await prisma.interactions.create({
      data: {
        type: 'SALE',
        description: `Sale recorded: ${saleProduct?.name} for ₹${saleWithRelations.total_amount}`,
        outcome: 'COMPLETED',
        next_action: 'Follow up for future purchases',
        customer_id: customerId,
        user_id: '550e8400-e29b-41d4-a716-446655440008'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sale recorded successfully',
      data: saleWithRelations
    });
  } catch (error: any) {
    console.error('Sales POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create sale' },
      { status: 500 }
    );
  }
} 