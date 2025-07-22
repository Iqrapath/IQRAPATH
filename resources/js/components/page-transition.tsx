import { useEffect, useState } from 'react';
import { LoadingScreen } from './loading-screen';

export default function PageTransition() {
  const [showLoader, setShowLoader] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Handle start of navigation
    const handleStart = () => {
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => {
        setShowLoader(true);
      }, 150);
      setTimer(newTimer);
    };

    // Hide loader when navigation finishes
    const handleFinish = () => {
      if (timer) clearTimeout(timer);
      setShowLoader(false);
    };

    // Add event listeners with the correct Inertia event names
    document.addEventListener('inertia:start', handleStart);
    document.addEventListener('inertia:finish', handleFinish);

    // Clean up
    return () => {
      document.removeEventListener('inertia:start', handleStart);
      document.removeEventListener('inertia:finish', handleFinish);
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  if (!showLoader) return null;

  return <LoadingScreen spinnerColor="primary" />;
}
