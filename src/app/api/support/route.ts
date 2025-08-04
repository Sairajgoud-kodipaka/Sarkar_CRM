import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/support - Get all support tickets with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (priority) {
      where.priority = priority.toUpperCase();
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    // Get support tickets with related data
    const tickets = await prisma.support_tickets.findMany({
      where,
      skip,
      take: limit,
      include: {
        assigned_to: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        floor: {
          select: {
            id: true,
            name: true,
            number: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Get total count
    const total = await prisma.support_tickets.count({ where });

    return NextResponse.json({
      success: true,
      data: tickets,
      total,
      page,
      limit,
      message: 'Support tickets retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

// POST /api/support - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      customer_name, 
      customer_email, 
      customer_phone, 
      priority, 
      category,
      assigned_to_id,
      store_id,
      floor_id,
      created_by_id
    } = body;

    if (!title || !description || !customer_name || !store_id || !created_by_id) {
      return NextResponse.json(
        { success: false, error: 'Title, description, customer name, store_id, and created_by_id are required' },
        { status: 400 }
      );
    }

    const ticket = await prisma.support_tickets.create({
      data: {
        title,
        description,
        priority: priority?.toUpperCase() || 'MEDIUM',
        status: 'OPEN',
        category: category?.toUpperCase() || 'GENERAL',
        customer_name,
        customer_email: customer_email || '',
        customer_phone: customer_phone || '',
        assigned_to_id: assigned_to_id || null,
        store_id,
        floor_id: floor_id || null,
        created_by_id,
      },
      include: {
        assigned_to: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        floor: {
          select: {
            id: true,
            name: true,
            number: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
} 