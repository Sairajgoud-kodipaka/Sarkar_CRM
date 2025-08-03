'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userFloor?: string;
  notifications?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function DashboardLayout({
  children,
  userRole = 'BUSINESS_ADMIN',
  userFloor,
  notifications = 3,
  searchPlaceholder = "Search customers, products",
  onSearch
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  // Use actual user data if available, otherwise fall back to props
  const actualUserRole = user?.role || userRole;
  const actualUserFloor = user?.floor || userFloor;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
    // Close sidebar on mobile after search
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleMenuToggle}
          userRole={actualUserRole}
          userFloor={actualUserFloor}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? 'ml-64' : 'ml-0'
      )}>
        {/* Header */}
        <Header
          onMenuToggle={handleMenuToggle}
          userRole={actualUserRole}
          userFloor={actualUserFloor}
          notifications={notifications}
          searchPlaceholder={searchPlaceholder}
          onSearch={handleSearch}
        />

        {/* Main Content Area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 