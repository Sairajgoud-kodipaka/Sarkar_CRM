import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing customers API...');
    
    // Simple test query
    const customers = await prisma.customers.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log(`Found ${customers.length} customers`);

    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error: any) {
    console.error('Customers API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch customers',
        details: error.toString()
      },
      { status: 500 }
    );
  }
} 