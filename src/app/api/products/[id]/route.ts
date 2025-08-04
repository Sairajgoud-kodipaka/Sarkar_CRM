import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Get product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      isActive,
      categoryId
    } = body;

    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const product = await prisma.products.update({
      where: { id: params.id },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        cost_price: costPrice ? parseFloat(costPrice) : existingProduct.cost_price,
        weight: weight ? parseFloat(weight) : existingProduct.weight,
        material: material || existingProduct.material,
        gemstone: gemstone || existingProduct.gemstone,
        purity: purity || existingProduct.purity,
        images: images || existingProduct.images,
        specifications: specifications || existingProduct.specifications,
        is_active: isActive !== undefined ? isActive : existingProduct.is_active,
        category_id: categoryId || existingProduct.category_id,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    await prisma.products.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 