import { TeacherHeader } from '@/components/teacher-header';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { PropsWithChildren, useState, useEffect } from 'react';
import { TeacherLeftSidenav } from '@/components/ui/teacher-left-sidenav';
import { TeacherRightSidebarNav } from '@/components/ui/teacher-right-sidebar-nav';
import { TeacherVerificationSuccessModal } from '@/components/ui/teacher-verification-success-modal';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Toaster } from '@/components/ui/use-toast';

export default function TeacherLayout({
    children,
    breadcrumbs,
    hideBreadcrumb = false
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    hideBreadcrumb?: boolean;
}>) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    
    // Get teacher profile from page props
    const teacherProfile = page.props.teacherProfile as { is_verified?: boolean } | undefined;
    
    // Ensure we're using a boolean value for verification status
    const isVerified = teacherProfile?.is_verified === true;
    
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    
    // Debug log to check verification status
    console.log('Teacher verification status:', { 
        isVerified, 
        teacherProfileExists: Boolean(teacherProfile),
        teacherProfileValue: teacherProfile?.is_verified
    });
    
    useEffect(() => {
        // Always show the modal for non-verified teachers
        if (!isVerified) {
            setShowVerificationModal(true);
            return;
        }
        
        // For verified teachers, check if they've seen the welcome message before
        const modalShownKey = `teacher-welcome-shown-${auth.user.id}`;
        const hasModalBeenShown = localStorage.getItem(modalShownKey);
        
        if (!hasModalBeenShown) {
            setShowVerificationModal(true);
        }
    }, [auth.user.id, isVerified]);

    const handleCloseVerificationModal = () => {
        // Only mark as shown if verified
        if (isVerified) {
            const modalShownKey = `teacher-welcome-shown-${auth.user.id}`;
            localStorage.setItem(modalShownKey, 'true');
        }
        setShowVerificationModal(false);
    };

    return (
        <AppShell>
            <div className="flex flex-col h-screen overflow-hidden">
                <TeacherHeader breadcrumbs={hideBreadcrumb ? [] : breadcrumbs} />
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="hidden lg:flex w-64 items-center justify-center">
                        <div className="w-10 h-full py-2">
                            <TeacherLeftSidenav className="h-full" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto px-2 py-2">
                        <AppContent className="max-w-6xl mx-auto md:ml-10 lg:ml-23">{children}</AppContent>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block w-95 py-2">
                        <TeacherRightSidebarNav className="h-full" />
                    </div>
                </div>
                
                {/* Teacher Verification Success Modal */}
                <TeacherVerificationSuccessModal
                    isOpen={showVerificationModal}
                    onClose={handleCloseVerificationModal}
                    teacherName={auth.user.name}
                    isVerified={isVerified}
                />
                
                {/* Toast Provider */}
                <Toaster />
            </div>
        </AppShell>
    );
}
