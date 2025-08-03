'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to admin dashboard
    // Later this will check user role and redirect accordingly
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
} 