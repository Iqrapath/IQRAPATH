import { GuardianHeader } from '@/components/guardian-header';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { GuardianLeftSidenav } from '@/components/ui/guardian-left-sidenav';
import { GuardianRightSidebarNav } from '@/components/ui/guardian-right-sidebar-nav';
import { usePage } from '@inertiajs/react';
import { GuardianOnboarding } from '@/components/auth/guardian-onboarding';

export default function GuardianLayout({
    children,
    breadcrumbs,
    hideBreadcrumb = false
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    hideBreadcrumb?: boolean;
}>) {
    const { auth } = usePage().props as any;

    return (
        <AppShell>
            <div className="flex flex-col h-screen overflow-hidden">
                <GuardianHeader breadcrumbs={hideBreadcrumb ? [] : breadcrumbs} />
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="hidden md:flex w-64 items-center justify-center">
                        <div className="w-10 h-full py-2">
                            <GuardianLeftSidenav className="h-full" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto px-2 py-2">
                        <AppContent className="max-w-6xl mx-auto md:ml-10 lg:ml-23">{children}</AppContent>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block w-95 py-2">
                        <GuardianRightSidebarNav className="h-full" />
                    </div>
                </div>

                {/* Onboarding modals */}
                {auth?.user && auth.user.role === 'guardian' && (
                    <GuardianOnboarding
                        user={auth.user}
                        hasRegisteredChildren={auth.user.hasRegisteredChildren}
                    />
                )}
            </div>
        </AppShell>
    );
}
