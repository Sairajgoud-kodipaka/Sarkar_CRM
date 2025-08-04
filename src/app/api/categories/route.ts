import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || '550e8400-e29b-41d4-a716-446655440000';

    const categories = await prisma.categories.findMany({
      where: {
        store_id: storeId,
        is_active: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, parentId, storeId = '550e8400-e29b-41d4-a716-446655440000' } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        name,
        description,
        parent_id: parentId,
        store_id: storeId,
        is_active: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error: any) {
    console.error('Categories POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
} 