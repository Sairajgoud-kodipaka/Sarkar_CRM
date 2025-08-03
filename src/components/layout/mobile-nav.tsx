'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  User,
  Home,
  Store,
  Building2,
  FileText,
  HelpCircle,
  Cog,
  UserPlus,
  Database,
  Upload,
  DollarSign,
  TrendingUp,
  PieChart,
  Users2,
  Shield,
  Activity,
  Target,
  UserCheck,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Star,
  Award,
  Zap,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Grid,
  List,
  Columns,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Edit,
  Trash2,
  Copy,
  Share,
  Bookmark,
  Heart,
  Video,
  Camera,
  Mic,
  MicOff,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  PiggyBank,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  BarChart,
  LineChart,
  ScatterChart,
  AreaChart,
  Gauge,
  Thermometer,
  Timer,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  Clock4,
  AlarmClock,
  Hourglass,
  TimerReset,
  TimerOff,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume1,
  Speaker,
  HeadphonesIcon,
  Radio,
  Tv,
  MonitorSpeaker,
  MonitorSmartphone,
  MonitorCheck,
  MonitorX,
  MonitorOff,
  MonitorPause,
  MonitorPlay,
  MonitorStop,
} from 'lucide-react';

interface MobileNavProps {
  userRole?: string;
  userFloor?: string;
  notifications?: number;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
}

const mobileNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'],
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    badge: 'New',
    roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'],
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    roles: ['BUSINESS_ADMIN'],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'],
  },
  {
    title: 'More',
    href: '/more',
    icon: MoreHorizontal,
    roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'],
  },
];

export function MobileNav({ userRole = 'BUSINESS_ADMIN', userFloor, notifications = 3 }: MobileNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (href === '/more') {
      return isMoreOpen;
    }
    return pathname.startsWith(href);
  };

  const filteredItems = mobileNavItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const moreMenuItems = [
    { title: 'Team', href: '/team', icon: Users2, roles: ['BUSINESS_ADMIN'] },
    { title: 'Floors', href: '/floors', icon: Building2, roles: ['BUSINESS_ADMIN'] },
    { title: 'Support', href: '/support', icon: HelpCircle, roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'] },
    { title: 'Settings', href: '/settings', icon: Settings, roles: ['BUSINESS_ADMIN', 'FLOOR_MANAGER'] },
  ].filter(item => !item.roles || item.roles.includes(userRole));

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {filteredItems.map((item) => {
            const active = isActive(item.href);
            
            if (item.href === '/more') {
              return (
                <button
                  key={item.href}
                  onClick={handleMoreClick}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200',
                    active ? 'text-primary-600' : 'text-navy-600 hover:text-navy-900'
                  )}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200',
                  active ? 'text-primary-600' : 'text-navy-600 hover:text-navy-900'
                )}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* More Menu Overlay */}
      {isMoreOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* More Menu */}
      <div className={cn(
        'fixed bottom-20 left-4 right-4 z-50 bg-white rounded-lg shadow-strong border border-gray-200 transition-all duration-300 lg:hidden',
        isMoreOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {moreMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <item.icon className="h-6 w-6 text-navy-600" />
                <span className="text-sm font-medium text-navy-900">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Close button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsMoreOpen(false)}
            className="w-full py-2 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Bottom padding for content */}
      <div className="h-16 lg:hidden" />
    </>
  );
}

// Floating Action Button for mobile
export function MobileFAB({ 
  onClick, 
  icon: Icon = Plus,
  label = "Add",
  className 
}: {
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 lg:hidden',
        'w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-strong',
        'flex items-center justify-center transition-all duration-200',
        'hover:scale-105 active:scale-95',
        className
      )}
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

// Mobile Quick Actions
export function MobileQuickActions({ 
  actions 
}: { 
  actions: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    color?: string;
  }>;
}) {
  return (
    <div className="fixed bottom-20 left-4 z-40 lg:hidden">
      <div className="flex flex-col space-y-2">
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              'w-12 h-12 rounded-full shadow-strong flex items-center justify-center',
              'transition-all duration-200 hover:scale-105 active:scale-95',
              action.color || 'bg-white text-navy-600 hover:bg-gray-50'
            )}
            aria-label={action.label}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <action.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
} 