import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { getPageTitle, formatAvatarUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { AdminLeftSidenav } from './ui/admin-left-sidenav';

// Custom Message Icon
const MessageIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={className}
    >
        <path d="M8.5 18.396V15.5h-2a1 1 0 01-1-1v-7a1 1 0 011-1h11a1 1 0 011 1v7a1 1 0 01-1 1H12l-3.073 3.073a.25.25 0 01-.427-.177z"></path>
        <path strokeLinecap="round" d="M8.5 12.5h7M8.5 9.5h7"></path>
    </svg>
);

// Custom Bell Icon
const BellIcon = ({ className }: { className?: string }) => (
    <svg
        width="24px"
        height="24px"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
        className={className}
    >
        <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);

interface StudentHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    pageTitle?: string;
}

export function StudentHeader({ breadcrumbs = [], pageTitle }: StudentHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    // Get the page title using the helper
    const title = getPageTitle(pageTitle, breadcrumbs);

    return (
        <>
            <div className="border-sidebar-border/80 border-b bg-gradient-to-b from-[#FFF7E4]  to-[#FFF7E4]">
                <div className="mx-auto flex h-15 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start bg-[#2c7870]">
                                    <AppLogoIcon className="flex-1 justify-center h-auto w-30" />
                                </SheetHeader>
                                <div className="flex-1 flex justify-center">
                                    <AdminLeftSidenav className="h-full rounded-none w-full" />
                                </div>
                                <SheetFooter className="flex justify-start items-start bg-[#2c7870]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-start space-x-1 rounded-full px-2 py-1">
                                                <Avatar className="size-8 overflow-hidden rounded-full">
                                                    <AvatarImage src={formatAvatarUrl(auth.user.avatar)} alt={auth.user.name} />
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(auth.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* User name and role */}
                                                <div className=" flex flex-col items-start mr-2">
                                                    <span className="text-sm font-medium text-white">{auth.user.name}</span>
                                                    <span className="text-xs text-gray-100">Admin</span>
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            <div className="flex items-center px-2 py-2">
                                                <div className="ml-2">
                                                    <p className="text-sm font-medium">{auth.user.name}</p>
                                                    <p className="text-xs text-gray-500">{auth.user.role}</p>
                                                </div>
                                            </div>
                                            <UserMenuContent user={auth.user} />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/admin/dashboard" prefetch className="hidden sm:flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Page Title (Centered) */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-xl font-medium text-gray-800">{title}</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Bell Icon */}
                        <Button variant="ghost" size="icon" className="hidden sm:flex group h-9 w-9 cursor-pointer">
                            <BellIcon className="!size-6 opacity-80 group-hover:opacity-100" />
                        </Button>

                        {/* Message Icon */}
                        <Button variant="ghost" size="icon" className="hidden sm:flex group h-9 w-9 cursor-pointer mr-2">
                            <MessageIcon className="!size-8 opacity-80 group-hover:opacity-100" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-1 rounded-full px-2 py-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={formatAvatarUrl(auth.user.avatar)} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User name and role */}
                                    <div className="hidden md:flex flex-col items-start mr-2">
                                        <span className="text-sm font-medium">{auth.user.name}</span>
                                        <span className="text-xs text-gray-500">{auth.user.role}</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="flex items-center px-2 py-2">
                                    <div className="ml-2">
                                        <p className="text-sm font-medium">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500">{auth.user.role}</p>
                                    </div>
                                </div>
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
