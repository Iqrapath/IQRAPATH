import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    User,
    Star,
    Settings,
    Bell,
    LogOut,
    FileText,
    DollarSign,
    LucideIcon
} from 'lucide-react';
import React from 'react';

interface TeacherLeftSidenavProps extends React.HTMLAttributes<HTMLDivElement> {}

type IconType = LucideIcon | any;

interface NavItem {
    title: string;
    href: string;
    icon: IconType;
    divider?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

// Component to render icons
const IconRenderer = ({ icon, size = 20 }: { icon: IconType; size?: number }) => {
    const Icon = icon;
    return <Icon size={size} />;
};

export function TeacherLeftSidenav({ className, ...props }: TeacherLeftSidenavProps) {
    const { url } = usePage();
    const currentPath = url;

    // Handle logout with POST method
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/teacher/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Schedule',
            href: '/teacher/schedule',
            icon: Calendar,
        },
        {
            title: 'Requests',
            href: '/teacher/requests',
            icon: FileText,
        },
        {
            title: 'Earnings',
            href: '/teacher/earnings',
            icon: DollarSign,
        },
        {
            title: 'Messages',
            href: '/teacher/messages',
            icon: MessageSquare,
        },
        {
            title: 'Profile',
            href: '/teacher/profile',
            icon: User,
        },
        {
            title: 'Rating & Feedback',
            href: '/teacher/feedback',
            icon: Star,
        },
        {
            title: 'Settings',
            href: '/teacher/settings',
            icon: Settings,
        },
        {
            title: 'Notification',
            href: '/teacher/notifications',
            icon: Bell,
        },
        {
            title: 'Log out',
            href: '#',
            icon: LogOut,
            onClick: handleLogout,
        },
    ];

    // Check if a navigation item is active
    const isActive = (path: string) => {
        // Don't consider logout link for active state
        if (path === '#') return false;

        // Exact match
        if (currentPath === path) return true;

        // Match path pattern for nested routes
        if (path !== '/dashboard' && currentPath.startsWith(path)) return true;

        return false;
    };

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-[#2c7870] text-white rounded-xl overflow-hidden relative",
                "w-60",
                className
            )}
            {...props}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="pt-5 px-1">
                    <p className="text-xs uppercase tracking-wider text-white/80 font-medium px-3 mb-1.5">
                        MAIN
                    </p>
                    <nav className="space-y-1">
                        {navItems.map((item, index) => (
                            <React.Fragment key={item.href || index}>
                                <Link
                                    href={item.href}
                                    onClick={item.onClick}
                                    className={cn(
                                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mx-1',
                                        isActive(item.href)
                                            ? 'bg-[#F3E5C3]/50 text-white'
                                            : 'text-white/90 hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                                    )}
                                >
                                    <span className="mr-2.5 h-5 w-5 flex-shrink-0 inline-flex items-center justify-center">
                                        <IconRenderer icon={item.icon} size={20} />
                                    </span>
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                                {item.divider && (
                                    <div className="h-px bg-white/20 my-1 mx-3"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}