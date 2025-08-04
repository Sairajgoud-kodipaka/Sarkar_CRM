import { NextResponse } from 'next/server';

// Centralized API error handling
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response handler
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  });

  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: 'Duplicate entry found',
            statusCode: 409,
            timestamp: new Date().toISOString()
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: 'Record not found',
            statusCode: 404,
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          {
            success: false,
            error: 'Foreign key constraint failed',
            statusCode: 400,
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Database operation failed',
            statusCode: 500,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.message,
        statusCode: 400,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }

  // Handle network/connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        statusCode: 503,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      statusCode: 500,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

// Wrapper for API route handlers
export function withErrorHandler(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      return handleApiError(error);
    }
  };
}

// Validation helper
export function validateRequiredFields(data: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400
    );
  }
}

// Pagination helper
export function getPaginationParams(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    search,
    skip: (page - 1) * limit
  };
}

// Success response helper
export function createSuccessResponse(data: any, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message: message || 'Operation completed successfully',
    timestamp: new Date().toISOString()
  });
} 