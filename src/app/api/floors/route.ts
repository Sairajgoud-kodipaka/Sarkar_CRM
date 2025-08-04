import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/floors - Get all floors with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const store = searchParams.get('store') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.is_active = status === 'active';
    }

    if (store) {
      where.store_id = store;
    }

    // Get floors
    const floors = await prisma.floors.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        number: 'asc',
      },
    });

    // Get total count
    const total = await prisma.floors.count({ where });

    // Calculate additional metrics for each floor
    const floorsWithMetrics = await Promise.all(
      floors.map(async (floor) => {
        // Get staff count
        const staffCount = await prisma.users.count({
          where: { floor_id: floor.id },
        });

        // Get total sales for this floor
        const sales = await prisma.sales.findMany({
          where: { 
            floor_id: floor.id 
          },
          select: { total_amount: true },
        });

        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);

        // Get customer count for this floor
        const customerCount = await prisma.customers.count({
          where: { floor_id: floor.id },
        });

        return {
          ...floor,
          staff_count: staffCount,
          total_sales: totalSales,
          customer_count: customerCount,
          performance: Math.round((totalSales / 1000000) * 100), // Mock performance calculation
          capacity: Math.round((staffCount / 10) * 100), // Mock capacity calculation
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: floorsWithMetrics,
      total,
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

    const floor = await prisma.floors.create({
      data: {
        name,
        number: parseInt(number),
        store_id,
        is_active,
      },
    });

    return NextResponse.json({
      success: true,
      data: floor,
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