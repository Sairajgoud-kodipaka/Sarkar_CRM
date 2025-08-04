import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const floorId = searchParams.get('floorId') || '';
    const assignedToId = searchParams.get('assignedToId') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      store_id: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (floorId) where.floor_id = floorId;
    if (assignedToId) where.assigned_to_id = assignedToId;

    // Get customers with pagination
    const customers = await prisma.customers.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count
    const total = await prisma.customers.count({ where });

    // Fetch related data for each customer
    const customersWithRelations = await Promise.all(
      customers.map(async (customer) => {
        const [floor, assignedTo] = await Promise.all([
          customer.floor_id ? prisma.floors.findUnique({
            where: { id: customer.floor_id },
            select: { id: true, name: true, number: true }
          }) : null,
          customer.assigned_to_id ? prisma.users.findUnique({
            where: { id: customer.assigned_to_id },
            select: { id: true, name: true, email: true }
          }) : null
        ]);

        return {
          ...customer,
          floor,
          assignedTo
        };
      })
    );

    // Calculate stats
    const stats = {
      total: await prisma.customers.count({ where: { store_id: '550e8400-e29b-41d4-a716-446655440000' } }),
      active: await prisma.customers.count({ where: { store_id: '550e8400-e29b-41d4-a716-446655440000', status: 'ACTIVE' } }),
      inactive: await prisma.customers.count({ where: { store_id: '550e8400-e29b-41d4-a716-446655440000', status: 'INACTIVE' } })
    };

    return NextResponse.json({
      success: true,
      data: customersWithRelations,
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
      floorId,
      assignedToId,
      storeId = '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
    } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Check if customer with same phone already exists
    const existingCustomer = await prisma.customers.findFirst({
      where: {
        phone,
        store_id: storeId
      }
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this phone number already exists' },
        { status: 400 }
      );
    }

    // Create customer
    const customer = await prisma.customers.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        occupation,
        income_range: incomeRange,
        social_circle: socialCircle,
        occasions,
        budget_range: budgetRange,
        notes,
        status: 'ACTIVE',
        store_id: storeId,
        floor_id: floorId,
        assigned_to_id: assignedToId
      }
    });

    // Fetch related data for created customer
    const [floor, assignedTo] = await Promise.all([
      customer.floor_id ? prisma.floors.findUnique({
        where: { id: customer.floor_id },
        select: { id: true, name: true, number: true }
      }) : null,
      customer.assigned_to_id ? prisma.users.findUnique({
        where: { id: customer.assigned_to_id },
        select: { id: true, name: true, email: true }
      }) : null
    ]);

    const customerWithRelations = {
      ...customer,
      floor,
      assignedTo
    };

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      data: customerWithRelations
    });
  } catch (error: any) {
    console.error('Customers POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
} 