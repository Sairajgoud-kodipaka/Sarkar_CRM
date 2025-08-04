'use client';

import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users } from 'lucide-react';

export default function FloorManagerFloors() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Floor Management"
          description="Manage floor operations and settings"
          breadcrumbs={true}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Floor Operations
            </CardTitle>
            <CardDescription>
              Floor-specific operations and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Floor management features coming soon...</p>
              <Button className="mt-4">
                <Users className="h-4 w-4 mr-2" />
                Manage Floor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 