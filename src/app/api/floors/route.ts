import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || 'test-store-id';

    // Get floors for the store
    const floors = await prisma.floor.findMany({
      where: {
        storeId,
        isActive: true
      },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        number: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: floors
    });

  } catch (error: any) {
    console.error('Error fetching floors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch floors' },
      { status: 500 }
    );
  }
} 