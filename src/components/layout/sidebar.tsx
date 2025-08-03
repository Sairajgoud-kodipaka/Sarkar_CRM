'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  UserPlus,
  DollarSign,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
  userFloor?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users, badge: 'New' },
  { name: 'Visitors', href: '/admin/visitors', icon: Users },
  { name: 'Sales', href: '/admin/sales', icon: DollarSign },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Sales & Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Team Management', href: '/admin/team', icon: UserPlus },
  { name: 'Floors', href: '/admin/floors', icon: Building2 },
  { name: 'Support', href: '/admin/support', icon: HelpCircle },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ isOpen, onToggle, userRole = 'BUSINESS_ADMIN', userFloor }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-navy-800">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Sarkar CRM</h1>
          <p className="text-sm text-navy-300">Jewellery Store</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-navy-700 text-white">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-navy-300">{user?.floor || userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-navy-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-navy-300 hover:bg-navy-800 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
} 