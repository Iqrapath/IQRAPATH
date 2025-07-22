import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface StudentStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    userName?: string;
    totalClasses?: number;
    completedClasses?: number;
    upcomingClasses?: number;
}

export function StudentStatsCard({
    className,
    userName = "Ahmed",
    totalClasses = 7,
    completedClasses = 5,
    upcomingClasses = 2,
    ...props
}: StudentStatsCardProps) {
    return (
        <div
            className={cn(
                "relative w-full overflow-visible",
                className
            )}
            {...props}
        >
            {/* Background gradient card */}
            <div className="relative w-full overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-md">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2c7870] to-[#a3d4bb]"></div>

                {/* Curved shape decoration */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 500 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-0 right-0 opacity-20"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M500 0V300H0C0 300 148.5 211 204.5 145.5C260.5 80 344 36.5 500 0Z"
                            fill="white"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 mb-25">
                    <h2 className="text-lg sm:text-xl font-normal mb-1">Welcome {userName}!</h2>
                    <h1 className="text-2xl sm:text-3xl font-light">Ready to start learning?</h1>
                </div>
            </div>

            {/* Stats Card - Positioned to overlap the gradient card */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl text-gray-800 mx-2 sm:mx-4 -mt-25">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Your Stats</h2>
                    <Link href="/teachers" className="text-teal-600 hover:underline font-medium">
                        Browse Teachers
                    </Link>
                </div>

                {/* Stat Circles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {/* Total Class Stat */}
                    <div>
                        <div className="relative bg-gradient-to-r from-white to-purple-50 h-20 sm:h-24 w-full sm:w-40 mb-3 rounded-full overflow-hidden pl-4 sm:pl-5 pr-8 sm:pr-12">
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="flex h-4/5 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" className="w-auto sm:w-10 h-auto sm:h-10 text-teal-600"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M6 6v28h22.387v-2H8V8h27v2.12h2V6zm31 10a2 2 0 1 1-4 0a2 2 0 0 1 4 0m2 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0" /><path d="M30.093 21.83a3 3 0 0 1 2.07-.83h4.082c1.464 0 2.827.498 3.877 1.49c1.01.954 1.536 2.177 1.751 3.336c.338 1.822-.012 3.813-.873 5.578V39.5a2.5 2.5 0 0 1-4.966.411l-.534-3.204l-.534 3.204A2.5 2.5 0 0 1 30 39.5v-9.407a3 3 0 0 1-1.5.402h-5.102a3 3 0 0 1 0-6h3.9zM32 33.475V39.5a.5.5 0 0 0 .993.082l1.043-6.256a1 1 0 0 1 .986-.836h.956a1 1 0 0 1 .986.836l1.043 6.256A.5.5 0 0 0 39 39.5v-8.333a1 1 0 0 1 .112-.46c.772-1.491 1.053-3.124.795-4.516c-.157-.846-.524-1.648-1.158-2.247c-.647-.611-1.505-.944-2.504-.944h-4.081c-.257 0-.505.099-.691.276l-3.084 2.942a1 1 0 0 1-.69.277h-4.301a1 1 0 0 0 0 2H28.5a1 1 0 0 0 .69-.277l1.12-1.068a1 1 0 0 1 1.69.724z" /></g></svg>
                                        </div>
                                        <div className="h-1/2">
                                            <span className="text-xs font-medium text-gray-600">Total Class</span>
                                        </div>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-medium text-teal-600">{totalClasses}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Class Completed Stat */}
                    <div>
                        <div className="relative bg-gradient-to-r from-white to-teal-50 h-20 sm:h-24 w-full sm:w-50 mb-3 rounded-full overflow-hidden pl-4 sm:pl-5 pr-8 sm:pr-12">
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="flex h-4/5 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" className="w-auto sm:w-10 h-auto sm:h-10 text-teal-600">
                                                <path fill="currentColor" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z" />
                                            </svg>
                                        </div>
                                        <div className="h-1/2">
                                            <span className="text-xs font-medium text-gray-600">Class Completed</span>
                                        </div>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-medium text-teal-600">{completedClasses}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Class Stat */}
                    <div>
                        <div className="relative bg-gradient-to-r from-white to-yellow-50 h-20 sm:h-24 w-full sm:w-50 mb-3 rounded-full overflow-hidden pl-4 sm:pl-5 pr-8 sm:pr-12">
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="flex h-4/5 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-auto sm:w-10 h-auto sm:h-10 text-teal-600">
                                                <path fill="currentColor" d="M7 13.5q.625 0 1.063-.437T8.5 12t-.437-1.062T7 10.5t-1.062.438T5.5 12t.438 1.063T7 13.5m5 0q.625 0 1.063-.437T13.5 12t-.437-1.062T12 10.5t-1.062.438T10.5 12t.438 1.063T12 13.5m5 0q.625 0 1.063-.437T18.5 12t-.437-1.062T17 10.5t-1.062.438T15.5 12t.438 1.063T17 13.5M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
                                            </svg>
                                        </div>
                                        <div className="h-1/2">
                                            <span className="text-xs font-medium text-gray-600">Upcoming Class</span>
                                        </div>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-medium text-teal-600">{upcomingClasses}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Details link */}
                <div className="mt-2 pl-2 sm:pl-4">
                    <Link href="/student/stats" className="text-teal-600 hover:underline font-medium">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}