import { cn } from '@/lib/utils';
import React from 'react';
import { usePage } from '@inertiajs/react';

interface AdminRightSidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminRightSidebarNav({ className, ...props }: AdminRightSidebarNavProps) {
    const { url } = usePage();
    const isEditPage = url.includes('/edit');
    const isCreatePage = url.includes('/create');

    return (
        <div
            className={cn(
                "flex flex-col h-full border-l border-gray-100 text-gray-800 overflow-hidden w-80",
                className
            )}
            {...props}
        >
            <div className="p-5">
                <div className="bg-gradient-to-t from-[#F3E5C3] to-[#338078] rounded-lg overflow-hidden text-white">
                    <div className="p-5 pb-4">
                        <div className="flex justify-center mb-4">
                            <img 
                                src="/assets/images/quran.png" 
                                alt="Quran" 
                                className="w-32 h-auto"
                            />
                        </div>
                        
                        <h2 className="text-2xl font-semibold mb-1">
                            Full Quran Memorization
                        </h2>
                        
                        <p className="text-sm text-white/90 mb-4">
                            A comprehensive memorization program for students aiming to memorize the entire Quran.
                        </p>
                        
                        <div className="inline-block bg-[#D8F5DA] text-[#338078] rounded-md px-3 py-1 text-sm mb-5">
                            #50,000 / Month
                        </div>
                        
                        <h3 className="text-lg font-medium mb-2">
                            Plan Features
                        </h3>
                        
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span className="text-sm">Daily Quran Sessions</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span className="text-sm">Weekly Assessments</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span className="text-sm">Final Certificate on Completion</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span className="text-sm">Personalized Learning Plan</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}