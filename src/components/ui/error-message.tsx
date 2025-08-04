'use client';

import { AlertTriangle, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface ErrorMessageProps {
  error: string | Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
  variant?: 'default' | 'card' | 'inline';
}

export function ErrorMessage({ 
  error, 
  onRetry, 
  title = 'Error occurred',
  description = 'Something went wrong while loading the data.',
  showRetry = true,
  variant = 'default'
}: ErrorMessageProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
  const isApiError = errorMessage.includes('API Error') || errorMessage.includes('500');

  const getErrorIcon = () => {
    if (isNetworkError) return <AlertCircle className="h-5 w-5 text-orange-500" />;
    if (isApiError) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  const getErrorColor = () => {
    if (isNetworkError) return 'border-orange-200 bg-orange-50 text-orange-800';
    if (isApiError) return 'border-red-200 bg-red-50 text-red-800';
    return 'border-red-200 bg-red-50 text-red-800';
  };

  if (variant === 'card') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            {getErrorIcon()}
            <CardTitle className="text-red-800">{title}</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center space-x-2 rounded-md border p-2 ${getErrorColor()}`}>
        {getErrorIcon()}
        <span className="text-sm font-medium">{errorMessage}</span>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry} 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`rounded-lg border p-4 ${getErrorColor()}`}>
      <div className="flex items-start space-x-3">
        {getErrorIcon()}
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm">{errorMessage}</p>
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}