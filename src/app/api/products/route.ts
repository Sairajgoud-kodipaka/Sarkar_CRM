import { NextRequest, NextResponse } from 'next/server';

// Temporary mock data to get frontend working
const mockProducts = [
  {
    id: '1',
    name: 'Diamond Ring',
    description: 'Beautiful 18K gold diamond ring',
    price: 2500.00,
    cost_price: 1800.00,
    weight: 3.5,
    material: '18K Gold',
    gemstone: 'Diamond',
    purity: 'VS1',
    images: ['/images/diamond-ring-1.jpg'],
    specifications: { carat: '1.5', clarity: 'VS1', color: 'D' },
    is_active: true,
    category_id: '1',
    store_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sapphire Necklace',
    description: 'Elegant sapphire necklace with white gold',
    price: 1200.00,
    cost_price: 800.00,
    weight: 2.8,
    material: 'White Gold',
    gemstone: 'Sapphire',
    purity: 'VVS2',
    images: ['/images/sapphire-necklace-1.jpg'],
    specifications: { carat: '2.0', clarity: 'VVS2', color: 'Blue' },
    is_active: true,
    category_id: '2',
    store_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    name: 'Emerald Earrings',
    description: 'Stunning emerald drop earrings',
    price: 1800.00,
    cost_price: 1200.00,
    weight: 4.2,
    material: 'Platinum',
    gemstone: 'Emerald',
    purity: 'VS2',
    images: ['/images/emerald-earrings-1.jpg'],
    specifications: { carat: '1.8', clarity: 'VS2', color: 'Green' },
    is_active: true,
    category_id: '3',
    store_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    // Filter products based on search and filters
    let filteredProducts = mockProducts;

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        product.material?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category_id === category
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(product =>
        product.is_active === (status === 'ACTIVE')
      );
    }

    // Calculate pagination
    const total = filteredProducts.length;
    const skip = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    // Calculate stats
    const stats = {
      total: mockProducts.length,
      active: mockProducts.filter(p => p.is_active).length,
      inactive: mockProducts.filter(p => !p.is_active).length,
      totalValue: mockProducts.reduce((sum, p) => sum + p.price, 0),
      averagePrice: mockProducts.reduce((sum, p) => sum + p.price, 0) / mockProducts.length
    };

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error: any) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      costPrice,
      weight,
      material,
      gemstone,
      purity,
      images,
      specifications,
      categoryId,
      isActive = true
    } = body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create new product (mock)
    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price),
      cost_price: costPrice ? parseFloat(costPrice) : 0,
      weight: weight ? parseFloat(weight) : 0,
      material,
      gemstone,
      purity,
      images: images || [],
      specifications: specifications || {},
      is_active: isActive,
      category_id: categoryId,
      store_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockProducts.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
} 