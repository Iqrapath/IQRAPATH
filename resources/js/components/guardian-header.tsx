import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { getPageTitle, formatAvatarUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu, MessageSquare } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

interface GuardianHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    pageTitle?: string;
}

export function GuardianHeader({ breadcrumbs = [], pageTitle }: GuardianHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    // Get the page title using the helper
    const title = getPageTitle(pageTitle, breadcrumbs);

    return (
        <>
            <div className="border-sidebar-border/80 border-b bg-gradient-to-b from-[#FFF7E4]  to-[#FFF7E4]">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
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
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/guardian/dashboard" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Page Title (Centered) */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-xl font-medium text-gray-800">{title}</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Bell Icon */}
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                            <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>

                        {/* Message Icon */}
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer mr-2">
                            <MessageSquare className="!size-5 opacity-80 group-hover:opacity-100" />
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
                                        <span className="text-xs text-gray-500">Guardian</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="flex items-center px-2 py-2">
                                    <div className="ml-2">
                                        <p className="text-sm font-medium">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500">Guardian</p>
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
