import React from 'react';
import { Spinner } from './ui/spinner';
import { cn } from '@/lib/utils';
import AppLogo from './app-logo';

interface LoadingScreenProps {
  /**
   * Show a message below the spinner
   */
  message?: string;

  /**
   * Show a logo above the spinner
   */
  showLogo?: boolean;

  /**
   * Optional className for additional styling
   */
  className?: string;

  /**
   * Optional size for the spinner
   */
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Optional color for the spinner
   */
  spinnerColor?: 'primary' | 'white';
}

export function LoadingScreen({
  message,
  showLogo = true,
  className,
  spinnerSize = 'lg',
  spinnerColor = 'primary'
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center bg-background z-50',
        className
      )}
    >
      {showLogo && (
        <div className="mb-8">
          <AppLogo className="h-10 w-auto" />
        </div>
      )}

      <Spinner size={spinnerSize} color={spinnerColor} />

      {message && (
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      )}
    </div>
  );
}

/**
 * A loading overlay that can be used within a container
 * (has absolute positioning instead of fixed)
 */
export function LoadingOverlay({
  message,
  className,
  spinnerSize = 'md',
  spinnerColor = 'primary'
}: Omit<LoadingScreenProps, 'showLogo'>) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10',
        className
      )}
    >
      <Spinner size={spinnerSize} color={spinnerColor} />

      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
