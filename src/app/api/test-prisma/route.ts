import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test 1: Check if PrismaClient can be imported
    let PrismaClient;
    try {
      const { PrismaClient: PC } = await import('@prisma/client');
      PrismaClient = PC;
    } catch (importError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to import PrismaClient',
        details: importError
      }, { status: 500 });
    }

    // Test 2: Check if we can create a new instance
    let prisma;
    try {
      prisma = new PrismaClient();
    } catch (createError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create PrismaClient instance',
        details: createError
      }, { status: 500 });
    }

    // Test 3: Check environment variables
    const databaseUrl = process.env.DATABASE_URL;
    
    // Test 4: Try a simple query
    let result;
    try {
      result = await prisma.$queryRaw`SELECT 1 as test`;
    } catch (queryError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to execute database query',
        details: queryError,
        databaseUrl: databaseUrl ? 'Set' : 'Not set'
      }, { status: 500 });
    }

    // Clean up
    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Prisma client test successful',
      data: {
        result,
        databaseUrl: databaseUrl ? 'Set' : 'Not set',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Prisma test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Prisma test failed',
      details: error.stack
    }, { status: 500 });
  }
} 