import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    featureName?: string;
}

export function ComingSoonModal({
    isOpen,
    onClose,
    title = "Coming Soon",
    description = "This feature is currently under development and will be available soon.",
    featureName,
}: ComingSoonModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-teal-600">{title}</span>
                        {featureName && <span className="text-gray-500 text-sm">({featureName})</span>}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6">
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                            src="/assets/images/coming-soon/brick-wall.gif" 
                            alt="Coming Soon" 
                            className="w-full max-w-[200px] h-auto"
                        />
                    </div>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
                        Got it, thanks!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ComingSoonModal; 