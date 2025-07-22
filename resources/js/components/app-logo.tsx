import React from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <div className={cn("flex items-center", className)}>
                <img
                    src="/Logo.png"
                    alt="IqraPath Logo"
                    className="h-8 w-auto"
                />
                <div className="ml-1 grid flex-1 text-left text-sm">
                    {/* <span className="mb-0.5 truncate leading-none font-semibold">IqraPath</span> */}
                </div>
            </div>
        </>
    );
}
