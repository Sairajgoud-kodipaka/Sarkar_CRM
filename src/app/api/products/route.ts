import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const floor = searchParams.get('floor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {
      store_id: '550e8400-e29b-41d4-a716-446655440000' // Use proper UUID
    };
    if (category && category !== 'ALL') {
      where.category_id = category;
    }
    if (status && status !== 'ALL') {
      where.is_active = status === 'IN_STOCK';
    }

    // Get products with pagination
    const products = await prisma.products.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.products.count({ where });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      stock,
      status,
      floor,
      image,
      rating,
      salesCount
    } = body;

    // Validate required fields
    if (!name || !category || !price || !floor) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.products.create({
      data: {
        name,
        sku: `SKU-${Date.now()}`, // Generate unique SKU
        description: description || '',
        price: parseFloat(price),
        cost_price: null,
        weight: null,
        material: null,
        gemstone: null,
        purity: null,
        images: image ? [image] : [],
        specifications: {},
        is_active: true,
        store_id: '550e8400-e29b-41d4-a716-446655440000', // Use proper UUID
        category_id: category
      }
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 