'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from './breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: boolean;
  actions?: ReactNode;
  className?: string;
  titleIcon?: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  onBack?: () => void;
  variant?: 'default' | 'compact' | 'hero';
}

export function PageHeader({
  title,
  description,
  breadcrumbs = true,
  actions,
  className,
  titleIcon: TitleIcon,
  showBackButton = false,
  onBack,
  variant = 'default'
}: PageHeaderProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'py-4';
      case 'hero':
        return 'py-6 sm:py-8 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200';
      default:
        return 'py-4 sm:py-6';
    }
  };

  return (
    <div className={cn(
      'mb-4 sm:mb-6',
      getVariantClasses(),
      className
    )}>
      <div className="flex flex-col space-y-3 sm:space-y-4">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <Breadcrumb />
        )}

        {/* Header content */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Back button */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mb-2 -ml-2"
              >
                ← Back
              </Button>
            )}

            {/* Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {TitleIcon && (
                <TitleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              )}
              <h1 className={cn(
                'text-xl sm:text-2xl font-bold text-gray-900 leading-tight',
                variant === 'hero' && 'text-2xl sm:text-3xl'
              )}>
                {title}
              </h1>
            </div>

            {/* Description */}
            {description && (
              <p className={cn(
                'mt-2 text-sm sm:text-base text-gray-600 leading-relaxed',
                variant === 'hero' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              )}>
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerPageHeader({
  title,
  description,
  actions,
  showBackButton = false,
  onBack
}: Omit<PageHeaderProps, 'titleIcon'>) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      showBackButton={showBackButton}
      onBack={onBack}
      className="border-b border-gray-200 bg-white"
    />
  );
}

export function ProductPageHeader({
  title,
  description,
  actions,
  showBackButton = false,
  onBack
}: Omit<PageHeaderProps, 'titleIcon'>) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      showBackButton={showBackButton}
      onBack={onBack}
      className="border-b border-gray-200 bg-white"
    />
  );
}

export function AnalyticsPageHeader({
  title,
  description,
  actions,
  showBackButton = false,
  onBack
}: Omit<PageHeaderProps, 'titleIcon'>) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      showBackButton={showBackButton}
      onBack={onBack}
      className="border-b border-gray-200 bg-white"
    />
  );
}

export function TeamPageHeader({
  title,
  description,
  actions,
  showBackButton = false,
  onBack
}: Omit<PageHeaderProps, 'titleIcon'>) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      showBackButton={showBackButton}
      onBack={onBack}
      className="border-b border-gray-200 bg-white"
    />
  );
} 