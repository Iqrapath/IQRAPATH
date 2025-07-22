import React, { useState } from 'react';
import { LoadingOverlay } from './loading-screen';
import { Button } from './ui/button';

interface LoadingStateExampleProps {
  /** Optional child content */
  children?: React.ReactNode;
  /** Height of the container in px (default: 200) */
  height?: number;
}

/**
 * This is an example component that demonstrates how to use the LoadingOverlay
 * within your own components when they have loading states.
 */
export function LoadingStateExample({ children, height = 200 }: LoadingStateExampleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Loading State Example</h2>
        <Button onClick={simulateLoading} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Simulate Loading'}
        </Button>
      </div>

      <div
        className="relative bg-gray-100 rounded-md flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        {isLoading && <LoadingOverlay message="Loading content..." />}

        {/* Default content or passed children */}
        {children || (
          <div className="text-gray-500">
            Content will be loaded here
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Click the button above to simulate a loading state that will last for 2 seconds.
      </p>
    </div>
  );
}
