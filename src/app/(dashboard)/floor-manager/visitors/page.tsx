'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Eye,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

export default function FloorManagerVisitors() {
  const [currentFloor] = useState('Floor 1');
  const [timeRange, setTimeRange] = useState('today');

  // Mock floor-specific visitor data
  const visitorStats = {
    today: 45,
    thisWeek: 234,
    thisMonth: 892,
    conversionRate: 68,
    averageTime: 12,
    peakHours: '2-4 PM'
  };

  const visitorTrends = [
    { period: 'Today', visitors: 45, change: '+12.5%', trend: 'up' },
    { period: 'Yesterday', visitors: 40, change: '+8.3%', trend: 'up' },
    { period: 'This Week', visitors: 234, change: '+15.7%', trend: 'up' },
    { period: 'Last Week', visitors: 202, change: '-2.1%', trend: 'down' }
  ];

  const hourlyData = [
    { hour: '9 AM', visitors: 8, conversion: 2 },
    { hour: '10 AM', visitors: 12, conversion: 3 },
    { hour: '11 AM', visitors: 15, conversion: 4 },
    { hour: '12 PM', visitors: 18, conversion: 5 },
    { hour: '1 PM', visitors: 22, conversion: 6 },
    { hour: '2 PM', visitors: 25, conversion: 8 },
    { hour: '3 PM', visitors: 28, conversion: 9 },
    { hour: '4 PM', visitors: 20, conversion: 7 },
    { hour: '5 PM', visitors: 15, conversion: 4 },
    { hour: '6 PM', visitors: 10, conversion: 3 }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title={`${currentFloor} Visitor Analytics`}
          description="Track visitor data and performance on your floor"
          breadcrumbs={true}
          actions={
            <Button
              variant="outline"
              onClick={() => console.log('Export report')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          }
        />

        {/* Visitor Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorStats.today}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorStats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.3%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorStats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.2%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitorStats.averageTime}m</div>
              <p className="text-xs text-muted-foreground">
                Peak hours: {visitorStats.peakHours}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
              <CardDescription>
                Visitor count trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitorTrends.map((trend) => (
                  <div key={trend.period} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {trend.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{trend.period}</div>
                        <div className="text-sm text-gray-500">{trend.visitors} visitors</div>
                      </div>
                    </div>
                    <Badge className={trend.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {trend.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Visitor Distribution</CardTitle>
              <CardDescription>
                Visitor patterns throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyData.map((data) => (
                  <div key={data.hour} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.hour}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{data.visitors}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">{data.conversion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Floor Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators for your floor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{visitorStats.today}</div>
                <div className="text-sm text-gray-500">Today's Visitors</div>
                <div className="text-xs text-green-600 mt-1">+12.5% from yesterday</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{visitorStats.conversionRate}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
                <div className="text-xs text-green-600 mt-1">+5.2% from last week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{visitorStats.averageTime}m</div>
                <div className="text-sm text-gray-500">Average Time</div>
                <div className="text-xs text-blue-600 mt-1">Peak: {visitorStats.peakHours}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 