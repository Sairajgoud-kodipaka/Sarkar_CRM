import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || 'test-store-id';
    const role = searchParams.get('role') || undefined;

    // Build query
    let where: any = { isActive: true };

    if (storeId) {
      where.storeId = storeId;
    }

    if (role) {
      where.role = role;
    }

    // Get users
    const users = await prisma.user.findMany({
      where,
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        },
        floor: {
          select: {
            id: true,
            name: true,
            number: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 