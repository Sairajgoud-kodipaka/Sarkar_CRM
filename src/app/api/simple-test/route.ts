import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Simple API is working!',
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    console.error('Simple test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Simple test failed',
        stack: error.stack 
      },
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
    console.error('Simple POST test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Simple POST test failed',
        stack: error.stack 
      },
      { status: 500 }
    );
  }
} 