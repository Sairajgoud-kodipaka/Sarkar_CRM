'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No user logged in, redirect to login
        router.push('/login');
        return;
      }

      // Redirect based on user role
      switch (user.role) {
        case 'BUSINESS_ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'FLOOR_MANAGER':
          router.push('/floor-manager/dashboard');
          break;
        case 'SALESPERSON':
          router.push('/salesperson/dashboard');
          break;
        default:
          // Default fallback to admin dashboard
          router.push('/admin/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 