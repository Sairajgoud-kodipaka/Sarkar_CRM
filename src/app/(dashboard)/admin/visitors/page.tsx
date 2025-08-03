'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Mock visitor data
const visitorData = {
  day: {
    total: 156,
    change: 12.5,
    breakdown: [
      { floor: 'Floor 1', visitors: 45, change: 8.2 },
      { floor: 'Floor 2', visitors: 38, change: 15.3 },
      { floor: 'Floor 3', visitors: 32, change: -2.1 },
      { floor: 'Online', visitors: 41, change: 25.7 }
    ]
  },
  week: {
    total: 892,
    change: 8.3,
    breakdown: [
      { floor: 'Floor 1', visitors: 245, change: 12.1 },
      { floor: 'Floor 2', visitors: 198, change: 5.8 },
      { floor: 'Floor 3', visitors: 167, change: -1.2 },
      { floor: 'Online', visitors: 282, change: 18.9 }
    ]
  },
  month: {
    total: 3247,
    change: 15.7,
    breakdown: [
      { floor: 'Floor 1', visitors: 892, change: 18.2 },
      { floor: 'Floor 2', visitors: 745, change: 12.5 },
      { floor: 'Floor 3', visitors: 623, change: 8.9 },
      { floor: 'Online', visitors: 987, change: 22.1 }
    ]
  }
};

export default function VisitorsPage() {
  const [activeTab, setActiveTab] = useState('day');

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitors Analytics</h1>
              <p className="text-gray-600">Track visitor data across all floors</p>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(visitorData.day.total)}</div>
              <p className={`text-xs flex items-center ${getChangeColor(visitorData.day.change)}`}>
                {getChangeIcon(visitorData.day.change)}
                <span className="ml-1">{visitorData.day.change >= 0 ? '+' : ''}{visitorData.day.change}% from yesterday</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(visitorData.week.total)}</div>
              <p className={`text-xs flex items-center ${getChangeColor(visitorData.week.change)}`}>
                {getChangeIcon(visitorData.week.change)}
                <span className="ml-1">{visitorData.week.change >= 0 ? '+' : ''}{visitorData.week.change}% from last week</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(visitorData.month.total)}</div>
              <p className={`text-xs flex items-center ${getChangeColor(visitorData.month.change)}`}>
                {getChangeIcon(visitorData.month.change)}
                <span className="ml-1">{visitorData.month.change >= 0 ? '+' : ''}{visitorData.month.change}% from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Breakdown</CardTitle>
            <CardDescription>Detailed visitor data by floor and time period</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              
              {Object.entries(visitorData).map(([period, data]) => (
                <TabsContent key={period} value={period} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.breakdown.map((item, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{item.floor}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{formatNumber(item.visitors)}</div>
                          <p className={`text-xs flex items-center ${getChangeColor(item.change)}`}>
                            {getChangeIcon(item.change)}
                            <span className="ml-1">{item.change >= 0 ? '+' : ''}{item.change}%</span>
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 