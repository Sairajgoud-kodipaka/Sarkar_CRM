import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Simple connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('Database connection successful:', result);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Database connection failed',
        details: error.toString()
      },
      { status: 500 }
    );
  }
} 