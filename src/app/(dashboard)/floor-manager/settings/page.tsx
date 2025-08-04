'use client';

import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';

export default function FloorManagerSettings() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Floor Settings"
          description="Manage your floor settings and preferences"
          breadcrumbs={true}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Manage your floor settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Settings features coming soon...</p>
              <Button className="mt-4">
                <User className="h-4 w-4 mr-2" />
                Manage Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 