import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatAvatarUrl } from '@/lib/helpers';
import { router } from '@inertiajs/react';
import { User } from '@/types';

interface AvatarUploadProps {
    user: User;
}

export function AvatarUpload({ user }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const getInitials = useInitials();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setImageError(false);

        // Upload the file
        setUploading(true);

        const formData = new FormData();
        formData.append('avatar', file);

        router.post(route('profile.avatar.update'), formData, {
            onFinish: () => {
                setUploading(false);
                URL.revokeObjectURL(url);
                setPreviewUrl(null);
            },
            forceFormData: true,
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
                {previewUrl ? (
                    <AvatarImage src={previewUrl} alt={user.name} className="object-cover" />
                ) : (
                    <>
                        {user.avatar && !imageError ? (
                            <AvatarImage 
                                src={formatAvatarUrl(user.avatar)} 
                                alt={user.name} 
                                className="object-cover" 
                                onError={handleImageError}
                            />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </>
                )}
            </Avatar>

            <div className="flex flex-col gap-2 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Button
                    onClick={triggerFileInput}
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Change Avatar'}
                </Button>
                <p className="text-xs text-gray-500">Click to upload a new profile photo</p>
            </div>
        </div>
    );
}
