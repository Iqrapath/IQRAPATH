import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatAvatarUrl } from '@/lib/helpers';
import { type User } from '@/types';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
    showDetails?: boolean;
}

export function UserInfo({ user, showEmail = false, showDetails = false }: UserInfoProps) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={formatAvatarUrl(user.avatar)} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
                {showDetails && (
                    <>
                        {user.phone_number && (
                            <span className="text-muted-foreground truncate text-xs">{user.phone_number}</span>
                        )}
                        {user.location && (
                            <span className="text-muted-foreground truncate text-xs">{user.location}</span>
                        )}
                        {user.role && (
                            <span className="text-muted-foreground truncate text-xs capitalize">{user.role}</span>
                        )}
                        {user.status && (
                            <span className="text-muted-foreground truncate text-xs capitalize">
                                Status: {user.status}
                            </span>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
