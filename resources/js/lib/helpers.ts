import { usePage } from '@inertiajs/react';
import { SharedData, BreadcrumbItem } from '@/types';

/**
 * Format a component name or route into a page title
 *
 * Examples:
 * - "admin/dashboard" => "Dashboard"
 * - "teacher/courses/index" => "Courses"
 * - "student/profile/edit" => "Edit Profile"
 * - "settings/profile" => "Profile"
 */
export function getPageTitleFromRoute(componentPath: string): string {
    if (!componentPath) return 'Dashboard';

    // Extract the last part of the component path (after the last slash)
    const parts = componentPath.split('/');
    let pageName = parts[parts.length - 1];

    // Remove common suffixes that might be part of component names
    pageName = pageName
        .replace(/\.tsx$/, '')
        .replace(/\.jsx$/, '')
        .replace(/\.js$/, '')
        .replace(/Page$/, '')
        .replace(/Component$/, '');

    // Handle index pages
    if (pageName === 'index') {
        // Use the second-to-last part if available
        pageName = parts.length > 1 ? parts[parts.length - 2] : 'List';
    }

    // Handle special cases
    if (pageName === 'show') pageName = 'Details';

    // Format the page name (capitalize first letter, add spaces before capital letters)
    pageName = pageName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

    return pageName;
}

/**
 * Get the current page title from Inertia page data
 *
 * @param customTitle Optional custom title to override defaults
 * @param breadcrumbs Optional breadcrumbs to extract title from
 * @returns The page title
 */
export function getPageTitle(customTitle?: string, breadcrumbs?: BreadcrumbItem[] | any[]): string {
    const page = usePage<SharedData>();

    // Use the provided custom title if available
    if (customTitle) return customTitle;

    // Use the last breadcrumb title if available
    if (breadcrumbs && breadcrumbs.length > 0) {
        const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
        if (lastBreadcrumb && typeof lastBreadcrumb === 'object' && 'title' in lastBreadcrumb && lastBreadcrumb.title) {
            return lastBreadcrumb.title;
        }
    }

    // Try to extract title from Head component in the page source
    try {
        // Access the page component's source content
        const pageSource = page.component || '';

        // Use regex to find Head title="..." pattern
        const headTitleMatch = /<Head\s+title=["']([^"']+)["']/i.exec(pageSource);
        if (headTitleMatch && headTitleMatch[1]) {
            // Remove "- IQRAPATH" suffix if present
            return headTitleMatch[1].replace(/\s*-\s*IQRAPATH\s*$/i, '');
        }
    } catch (error) {
        console.error('Error extracting title from Head component:', error);
    }

    // If no title is found in Head component, try to extract it from document title
    if (typeof document !== 'undefined' && document.title) {
        // Remove any site name suffix like "| IQRAPATH" or "- IQRAPATH"
        return document.title
            .replace(/\s*\|\s*IQRAPATH\s*$/i, '')
            .replace(/\s*-\s*IQRAPATH\s*$/i, '')
            .trim();
    }

    // Use the component name to generate a title as fallback
    return getPageTitleFromRoute(page.component || '');
}

/**
 * Format avatar URL to handle different formats and ensure proper path
 */
export function formatAvatarUrl(path?: string | null): string {
    if (!path) return '';
    
    // Check if it's already an absolute URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Remove storage/ prefix if it exists
    const cleanPath = path.replace(/^storage\//, '');
    
    // Return the proper URL
    return `/storage/${cleanPath}`;
}

/**
 * Format file URL for documents and other uploaded files
 */
export function formatFileUrl(path?: string | null): string {
    if (!path) return '';
    
    // Check if it's already an absolute URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Handle teacher document paths 
    const teacherDocPattern = /^teacher_documents\/(\d+)\/([^\/]+)\/(.+)$/;
    const match = path.match(teacherDocPattern);
    
    if (match) {
        const [_, teacherId, docType, filename] = match;
        // Use the direct document route
        return `/document/${docType}/${teacherId}/${filename}`;
    }
    
    // Remove storage/ prefix if it exists
    const cleanPath = path.replace(/^storage\//, '');
    
    // Remove leading slash if it exists
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    
    // Return the proper URL
    return `/storage/${normalizedPath}`;
}
