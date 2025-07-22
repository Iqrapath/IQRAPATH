import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title?: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: string;
    avatar?: string;
    phone_number?: string;
    location?: string;
    status?: 'active' | 'inactive' | 'pending' | 'suspended';
    registration_date?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}
