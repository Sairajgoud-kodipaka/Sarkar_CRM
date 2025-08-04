import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'customers';

    // Mock data for testing frontend integration
    const mockData = {
      customers: {
        success: true,
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 98765 43210',
            status: 'ACTIVE',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+91 98765 43211',
            status: 'ACTIVE',
            created_at: new Date().toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          pages: 1
        },
        stats: {
          total: 2,
          active: 2,
          inactive: 0
        }
      },
      products: {
        success: true,
        data: [
          {
            id: '1',
            name: 'Gold Ring',
            sku: 'SKU-001',
            price: 25000,
            category_id: '1',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Diamond Necklace',
            sku: 'SKU-002',
            price: 150000,
            category_id: '2',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      },
      sales: {
        success: true,
        data: [
          {
            id: '1',
            amount: 25000,
            total_amount: 25000,
            status: 'COMPLETED',
            created_at: new Date().toISOString(),
            customer: { name: 'John Doe' },
            product: { name: 'Gold Ring' }
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          pages: 1
        },
        totalRevenue: 25000
      }
    };

    return NextResponse.json(mockData[type as keyof typeof mockData] || mockData.customers);
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { success: false, error: 'Test API failed' },
      { status: 500 }
    );
  }
} 