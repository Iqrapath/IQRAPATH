import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface ClassSession {
    id: string;
    title: string;
    teacher: string;
    date: string;
    timeRange: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    image: string;
}

interface StudentUpcomingClassesProps extends React.HTMLAttributes<HTMLDivElement> {
    classes?: ClassSession[];
}

export function StudentUpcomingClasses({
    className,
    classes = [],
    ...props
}: StudentUpcomingClassesProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl w-full",
                className
            )}
            {...props}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Upcoming Classes</h2>
                <Link href="/classes" className="text-teal-600 hover:underline font-medium">
                    View All Classes
                </Link>
            </div>

            {classes.length === 0 ? (
                <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No upcoming classes</h3>
                    <p className="text-gray-500 mb-4">You don't have any classes scheduled.</p>
                    <Link 
                        href="/classes/browse" 
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Browse Classes
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {classes.map((session: ClassSession) => (
                        <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b pb-4 last:border-0">
                            <div className="flex items-start sm:items-center w-full sm:w-auto">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0 bg-gray-100">
                                    <img
                                        src={session.image}
                                        alt={session.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback image if the real one fails to load
                                            (e.target as HTMLImageElement).src = '/assets/images/classes/default.png';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{session.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">By {session.teacher}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs text-gray-500">
                                        <span>{session.date}</span>
                                        <span className="text-gray-300 hidden sm:inline">|</span>
                                        <span>{session.timeRange}</span>
                                        {session.status === 'confirmed' && (
                                            <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-xs">Confirmed</span>
                                        )}
                                        {session.status === 'pending' && (
                                            <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-xs">Pending</span>
                                        )}
                                        {session.status === 'cancelled' && (
                                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs">Cancelled</span>
                                        )}
                                        {session.status === 'completed' && (
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">Completed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                                <Link 
                                    href={`/classes/${session.id}/details`}
                                    className="text-teal-600 hover:text-teal-700 px-3 py-1 text-sm border border-teal-600 rounded-full hover:bg-teal-50 transition-colors"
                                >
                                    Details
                                </Link>
                                {session.status === 'confirmed' && (
                                    <Link 
                                        href={`/classes/${session.id}/join`}
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        Join Class
                                    </Link>
                                )}
                                {session.status === 'pending' && (
                                    <button 
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
                                        onClick={() => window.location.href = `/classes/${session.id}/confirm`}
                                    >
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}