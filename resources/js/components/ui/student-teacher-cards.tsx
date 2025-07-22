import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatAvatarUrl } from '@/lib/helpers';

interface Teacher {
    id: string;
    name: string;
    image: string;
    subjects: string[];
    rating: number;
    reviews: number;
    availability: string;
    hourlyRate: number;
    currency?: string;
    amountPerSession?: number;
    location?: string;
}

interface StudentTeacherCardsProps extends React.HTMLAttributes<HTMLDivElement> {
    teachers?: Teacher[];
    title?: string;
}

export function StudentTeacherCards({
    className,
    teachers: initialTeachers,
    title = "Featured Teachers",
    ...props
}: StudentTeacherCardsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers || []);
    const [loading, setLoading] = useState(!initialTeachers);
    const [error, setError] = useState<string | null>(null);
    const getInitials = useInitials();

    useEffect(() => {
        if (!initialTeachers) {
            setLoading(true);
            axios.get('/student/recommended-teachers')
                .then(response => {
                    if (response.data && response.data.success && 
                        response.data.data && response.data.data.teachers) {
                        setTeachers(response.data.data.teachers);
                    } else {
                        console.error('Invalid teachers response format:', response.data);
                        setError('Invalid response from server');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching recommended teachers:', error);
                    setError('Failed to load recommended teachers');
                    setLoading(false);
                });
        }
    }, [initialTeachers]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className={cn("w-full bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl", className)} {...props}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500">Loading teachers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("w-full bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl", className)} {...props}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="flex justify-center items-center h-48">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (teachers.length === 0) {
        return (
            <div className={cn("w-full bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl", className)} {...props}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500">No teachers found</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "w-full bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl",
                className
            )}
            {...props}
        >
            {title && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={scrollLeft}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                            aria-label="Scroll left"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                            aria-label="Scroll right"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={scrollRef}
                className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {teachers.map((teacher: Teacher) => (
                    <div
                        key={teacher.id}
                        className="flex-shrink-0 w-full max-w-md bg-white rounded-3xl shadow-md overflow-hidden"
                    >
                        <div className="p-5">
                            <div className="flex items-start">
                                <div className="mr-6">
                                    <Avatar className="h-24 w-24 rounded-full border-2 border-teal-50">
                                        <AvatarImage 
                                            src={teacher.image} 
                                            alt={teacher.name} 
                                            className="h-full w-full object-cover"
                                        />
                                        <AvatarFallback className="text-xl">
                                            {getInitials(teacher.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {teacher.name.startsWith('Ustadah') || teacher.name.startsWith('Ustadh') ? 
                                          teacher.name : 
                                          teacher.name}
                                    </h3>
                                    
                                    <div className="mt-3">
                                        <div className="text-gray-600">
                                            <span className="text-gray-500">Subject:</span> {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? teacher.subjects.join(', ') : 'Not specified'}
                                        </div>
                                        
                                        <div className="flex items-center mt-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="ml-2">{teacher.location || 'Online'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center mt-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={i < Math.floor(teacher.rating) ? "fill-current" : "stroke-current"}
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                                                        fill={i < Math.floor(teacher.rating) ? "currentColor" : "none"}
                                                        stroke={i < Math.floor(teacher.rating) ? "none" : "currentColor"}
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-2 font-medium">{teacher.rating}/5</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="text-gray-600">
                                    <span className="font-medium">Availability:</span> {teacher.availability}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="bg-teal-50 rounded-full px-4 py-2 text-teal-600">
                                    <span className="font-bold text-lg">{teacher.currency === 'USD' ? '$' : '₦'}{typeof teacher.amountPerSession === 'number' ? teacher.amountPerSession.toFixed(0) : (teacher.hourlyRate * 1.5).toFixed(0)}</span>
                                    <span className="text-sm text-gray-500"> / {teacher.currency === 'USD' ? '' : '₦'}{typeof teacher.hourlyRate === 'number' ? Math.round(teacher.hourlyRate).toLocaleString() : 0}</span>
                                    <div className="text-xs text-gray-500">Per session</div>
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        href={`/teachers/${teacher.id}`}
                                        className="text-teal-600 hover:underline text-lg font-medium"
                                    >
                                        View Profile
                                    </Link>
                                    
                                    <button className="bg-teal-50 rounded-full p-2 text-teal-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}