import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      data: {
        test: 'Hello from Sarkar CRM API!',
        status: 'operational'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'POST request received!',
      timestamp: new Date().toISOString(),
      receivedData: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'POST test failed' },
      { status: 500 }
    );
  }
} 