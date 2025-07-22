import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import AdminLayout from '@/layouts/admin-layout';
import TeacherLayout from '@/layouts/teacher-layout';
import StudentLayout from '@/layouts/student-layout';
import GuardianLayout from '@/layouts/guardian-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User;
    header?: ReactNode;
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role?.toLowerCase() || 'unassigned';

    // Choose the appropriate layout based on user role
    switch(userRole) {
        case 'admin':
            return (
                <AdminLayout breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AdminLayout>
            );
        case 'teacher':
            return (
                <TeacherLayout breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </TeacherLayout>
            );
        case 'student':
            return (
                <StudentLayout breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </StudentLayout>
            );
        case 'guardian':
            return (
                <GuardianLayout breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </GuardianLayout>
            );
        default:
            return (
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            );
    }
}
