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
      },
      users: {
        success: true,
        data: [
          {
            id: '1',
            name: 'Business Admin',
            email: 'admin@example.com',
            role: 'BUSINESS_ADMIN',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Floor Manager',
            email: 'manager@example.com',
            role: 'FLOOR_MANAGER',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Salesperson',
            email: 'sales@example.com',
            role: 'SALESPERSON',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 3,
          pages: 1
        }
      },
      floors: {
        success: true,
        data: [
          {
            id: '1',
            name: 'Floor 1',
            number: 1,
            is_active: true,
            staff_count: 5,
            customer_count: 25,
            total_sales: 500000,
            performance: 85,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Floor 2',
            number: 2,
            is_active: true,
            staff_count: 3,
            customer_count: 18,
            total_sales: 350000,
            performance: 78,
            created_at: new Date().toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          pages: 1
        }
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