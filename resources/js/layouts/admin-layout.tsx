import { AdminHeader } from '@/components/admin-header';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminLeftSidenav } from '@/components/ui/admin-left-sidenav';
import { AdminRightSidebarNav } from '@/components/ui/admin-right-sidebar-nav';
import { Toaster } from '@/components/ui/use-toast';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({
    children,
    breadcrumbs,
    hideBreadcrumb = false
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    hideBreadcrumb?: boolean;
}>) {
    // Get current page URL to determine if we're on the subscription plan edit page
    const { url } = usePage();
    const isSubscriptionPlanEditPage = url.includes('/admin/subscription-plans/') && 
        (url.includes('/edit') || url.includes('/create'));

    return (
        <AppShell>
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                <AdminHeader breadcrumbs={hideBreadcrumb ? [] : breadcrumbs} />
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="hidden lg:flex w-64 items-center justify-center">
                        <div className="w-10 h-full py-2">
                            <AdminLeftSidenav className="h-full" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto px-2 py-2">
                        <AppContent className="max-w-6xl mx-auto lg:ml-20">{children}</AppContent>
                    </div>

                    {/* Right Sidebar - Only show on subscription plan edit page */}
                    {isSubscriptionPlanEditPage && (
                        <div className="hidden lg:block w-95 py-16">
                            <AdminRightSidebarNav className="h-full" />
                        </div>
                    )}
                </div>
                <Toaster />
            </div>
        </AppShell>
    );
}
