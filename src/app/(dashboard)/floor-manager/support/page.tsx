'use client';

import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle } from 'lucide-react';

export default function FloorManagerSupport() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Floor Support"
          description="Get help and support for floor operations"
          breadcrumbs={true}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support Center
            </CardTitle>
            <CardDescription>
              Get help and support for your floor operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Support features coming soon...</p>
              <Button className="mt-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 