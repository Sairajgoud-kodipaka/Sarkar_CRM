'use client';

import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export default function FloorManagerSalesAnalytics() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Floor Sales & Analytics"
          description="Track sales performance and analytics for your floor"
          breadcrumbs={true}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Analytics
            </CardTitle>
            <CardDescription>
              Floor-specific sales performance and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Sales analytics dashboard coming soon...</p>
              <Button className="mt-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Sales Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 