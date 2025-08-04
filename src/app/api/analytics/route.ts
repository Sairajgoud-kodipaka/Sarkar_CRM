import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    const floor = searchParams.get('floor');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause for date filtering
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Build floor filter
    const floorFilter = floor ? { floorId: floor } : {};

    switch (type) {
      case 'dashboard':
        return await getDashboardAnalytics(floorFilter, dateFilter);
      case 'sales':
        return await getSalesAnalytics(floorFilter, dateFilter);
      case 'customers':
        return await getCustomerAnalytics(floorFilter, dateFilter);
      case 'products':
        return await getProductAnalytics(floorFilter, dateFilter);
      default:
        return await getDashboardAnalytics(floorFilter, dateFilter);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getDashboardAnalytics(floorFilter: any, dateFilter: any) {
  // Get total sales
  const totalSales = await prisma.sales.aggregate({
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    _sum: {
      total_amount: true
    }
  });

  // Get total customers
  const totalCustomers = await prisma.customers.count({
    where: floorFilter
  });

  // Get total products
  const totalProducts = await prisma.products.count({
    where: {
      is_active: true
    }
  });

  // Get recent sales
  const recentSales = await prisma.sales.findMany({
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 10
  });

  // Get sales by month (last 6 months)
  const salesByMonth = await prisma.sales.groupBy({
    by: ['created_at'],
    where: {
      ...floorFilter,
      created_at: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
      }
    },
    _sum: {
      total_amount: true
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      totalSales: totalSales._sum.total_amount || 0,
      totalCustomers,
      totalProducts,
      recentSales,
      salesByMonth
    }
  });
}

async function getSalesAnalytics(floorFilter: any, dateFilter: any) {
  // Get sales statistics
  const salesStats = await prisma.sales.aggregate({
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    _sum: {
      total_amount: true,
      quantity: true
    },
    _avg: {
      total_amount: true
    },
    _count: true
  });

  // Get sales by status
  const salesByStatus = await prisma.sales.groupBy({
    by: ['status'],
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    _count: true
  });

  // Get top selling products
  const topProducts = await prisma.sales.groupBy({
    by: ['product_id'],
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    _sum: {
      quantity: true,
      total_amount: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 10
  });

  return NextResponse.json({
    success: true,
    data: {
      salesStats,
      salesByStatus,
      topProducts
    }
  });
}

async function getCustomerAnalytics(floorFilter: any, dateFilter: any) {
  // Get customer statistics
  const customerStats = await prisma.customers.aggregate({
    where: floorFilter,
    _count: true
  });

  // Get customers by status
  const customersByStatus = await prisma.customers.groupBy({
    by: ['status'],
    where: floorFilter,
    _count: true
  });

  // Get top customers by sales
  const topCustomers = await prisma.sales.groupBy({
    by: ['customer_id'],
    where: {
      ...floorFilter,
      created_at: dateFilter
    },
    _sum: {
      total_amount: true
    },
    orderBy: {
      _sum: {
        total_amount: 'desc'
      }
    },
    take: 10
  });

  return NextResponse.json({
    success: true,
    data: {
      customerStats,
      customersByStatus,
      topCustomers
    }
  });
}

async function getProductAnalytics(floorFilter: any, dateFilter: any) {
  // Get product statistics
  const productStats = await prisma.products.aggregate({
    where: {
      is_active: true
    },
    _count: true
  });

  // Get products by category
  const productsByCategory = await prisma.products.groupBy({
    by: ['category_id'],
    where: {
      is_active: true
    },
    _count: true
  });

  // Get low stock products
  const lowStockProducts = await prisma.products.findMany({
    where: {
      is_active: true
    },
    orderBy: {
      // Assuming there's a stock field, adjust as needed
      price: 'asc'
    },
    take: 10
  });

  return NextResponse.json({
    success: true,
    data: {
      productStats,
      productsByCategory,
      lowStockProducts
    }
  });
} 