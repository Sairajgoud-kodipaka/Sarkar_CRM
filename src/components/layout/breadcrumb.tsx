'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  className?: string;
  showHome?: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Breadcrumb({ className, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/dashboard',
        icon: Home,
      });
    }
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Don't make the last item a link
      const isLast = index === segments.length - 1;
      
      // Special handling for Admin breadcrumb
      let href = isLast ? undefined : currentPath;
      if (segment === 'admin' && !isLast) {
        href = '/admin/dashboard';
      }
      
      breadcrumbs.push({
        label,
        href,
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <nav className={cn('flex items-center space-x-1 text-xs sm:text-sm text-gray-600 overflow-x-auto', className)}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = item.icon;
        
        return (
          <div key={item.href || item.label} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 text-gray-400 flex-shrink-0" />
            )}
            
            {isLast ? (
              <span className="font-medium text-gray-900 truncate">
                {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 flex-shrink-0" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}</span>
              </span>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  'hover:text-primary-600 transition-colors duration-200 flex-shrink-0',
                  'flex items-center space-x-1'
                )}
              >
                {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Specialized breadcrumb for specific pages
export function PageBreadcrumb({ 
  items, 
  className 
}: { 
  items: BreadcrumbItem[]; 
  className?: string; 
}) {
  return (
    <nav className={cn('flex items-center space-x-1 text-xs sm:text-sm text-gray-600 overflow-x-auto', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;
        
        return (
          <div key={item.href || item.label} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 text-gray-400 flex-shrink-0" />
            )}
            
            {isLast ? (
              <span className="font-medium text-gray-900 truncate">
                {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 flex-shrink-0" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}</span>
              </span>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  'hover:text-primary-600 transition-colors duration-200 flex-shrink-0',
                  'flex items-center space-x-1'
                )}
              >
                {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
} 