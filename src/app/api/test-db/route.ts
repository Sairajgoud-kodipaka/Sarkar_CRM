import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to get a simple count
    const customerCount = await prisma.customers.count();
    const productCount = await prisma.products.count();
    const userCount = await prisma.users.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        customerCount,
        productCount,
        userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'
      }
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Database connection failed',
        details: {
          databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 