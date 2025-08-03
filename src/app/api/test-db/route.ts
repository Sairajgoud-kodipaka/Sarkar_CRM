import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection by trying to get stores count
    const storesCount = await prisma.store.count();
    
    // Test getting a few stores
    const stores = await prisma.store.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Test getting users count
    const usersCount = await prisma.user.count();

    // Test getting customers count
    const customersCount = await prisma.customer.count();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        storesCount,
        usersCount,
        customersCount,
        sampleStores: stores,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Database connection failed',
        details: error.stack
      },
      { status: 500 }
    );
  }
} 