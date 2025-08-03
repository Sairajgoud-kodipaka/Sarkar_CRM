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
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      storeId: 'store-001' // Default store for now
    };

    if (status) where.status = status;
    if (floorId) where.floorId = floorId;
    if (customerId) where.customerId = customerId;

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Get sales with related data
    const sales = await prisma.sale.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Fetch related data separately
    const salesWithRelations = await Promise.all(
      sales.map(async (sale) => {
        const [customer, product, floor, user] = await Promise.all([
          prisma.customer.findUnique({
            where: { id: sale.customerId },
            select: { id: true, name: true, phone: true, email: true }
          }),
          prisma.product.findUnique({
            where: { id: sale.productId },
            select: { id: true, name: true, sku: true, price: true }
          }),
          prisma.floor.findUnique({
            where: { id: sale.floorId },
            select: { id: true, name: true, number: true }
          }),
          prisma.user.findUnique({
            where: { id: sale.userId },
            select: { id: true, name: true, email: true }
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

    // Get total count
    const total = await prisma.sale.count({ where });

    // Calculate total revenue
    const totalRevenue = await prisma.sale.aggregate({
      where,
      _sum: {
        totalAmount: true
      }
    });

    return NextResponse.json({
      success: true,
      data: salesWithRelations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      totalRevenue: totalRevenue._sum.totalAmount || 0
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
      storeId = 'store-001' // Default store
    } = body;

    // Validation
    if (!customerId || !productId || !floorId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerId, productId, floorId, amount' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (discount < 0) {
      return NextResponse.json(
        { success: false, error: 'Discount cannot be negative' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = (amount * quantity) - discount;

    if (totalAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Total amount cannot be negative after discount' },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorId }
    });

    if (!floor) {
      return NextResponse.json(
        { success: false, error: 'Floor not found' },
        { status: 404 }
      );
    }

    // Create the sale
    const sale = await prisma.sale.create({
      data: {
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
        discount: parseFloat(discount),
        totalAmount: totalAmount,
        paymentMethod,
        status: 'COMPLETED',
        notes,
        storeId,
        floorId,
        customerId,
        productId,
        userId: 'user-001' // Default user for now - should come from auth context
      }
    });

    // Fetch related data for the created sale
    const [saleCustomer, saleProduct, saleFloor, saleUser] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: sale.customerId },
        select: { id: true, name: true, phone: true, email: true }
      }),
      prisma.product.findUnique({
        where: { id: sale.productId },
        select: { id: true, name: true, sku: true, price: true }
      }),
      prisma.floor.findUnique({
        where: { id: sale.floorId },
        select: { id: true, name: true, number: true }
      }),
      prisma.user.findUnique({
        where: { id: sale.userId },
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
    await prisma.interaction.create({
      data: {
        type: 'SALE',
        description: `Sale recorded: ${product.name} for ₹${totalAmount}`,
        outcome: 'COMPLETED',
        nextAction: 'Follow up for future purchases',
        customerId,
        userId: 'user-001'
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