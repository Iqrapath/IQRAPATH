import StudentLayout from '@/layouts/student-layout';
import { StudentStatsCard } from '@/components/ui/student-stats-card';
import { StudentUpcomingClasses } from '@/components/ui/student-upcoming-classes';
import { StudentTeacherCards } from '@/components/ui/student-teacher-cards';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const userName = auth.user.name;
    
    // Stats state
    const [stats, setStats] = useState({
        totalClasses: 0,
        completedClasses: 0,
        upcomingClasses: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Upcoming classes state
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [classesError, setClassesError] = useState<string | null>(null);
    
    // Fetch stats
    useEffect(() => {
        // Fetch student stats when the component mounts
        setLoading(true);
        axios.get('/student/stats')
            .then(response => {
                console.log('API Response:', response.data);
                // All responses now use the unified format
                if (response.data && response.data.success && response.data.data && response.data.data.stats) {
                    setStats(response.data.data.stats);
                    setLoading(false);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid response from server');
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching student stats:', error);
                setError('Failed to load stats. Please try again later.');
                setLoading(false);
            });
    }, []);
    
    // Fetch upcoming classes
    useEffect(() => {
        setLoadingClasses(true);
        axios.get('/student/upcoming-classes')
            .then(response => {
                console.log('Classes Response:', response.data);
                if (response.data && response.data.success && 
                    response.data.data && response.data.data.upcomingClasses) {
                    setUpcomingClasses(response.data.data.upcomingClasses);
                } else {
                    console.error('Invalid classes response format:', response.data);
                    setClassesError('Invalid response from server');
                }
                setLoadingClasses(false);
            })
            .catch(error => {
                console.error('Error fetching upcoming classes:', error);
                setClassesError('Failed to load upcoming classes');
                setLoadingClasses(false);
            });
    }, []);
    
    return (
        <StudentLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex justify-center w-full">
                <div className="w-full max-w-3xl px-3 mx-auto sm:mx-2 sm:px-0">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {loading ? (
                            <div className="p-6 bg-white rounded-lg shadow text-center">
                                <p className="text-gray-500">Loading stats...</p>
                            </div>
                        ) : error ? (
                            <div className="p-6 bg-white rounded-lg shadow text-center">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : (
                            <StudentStatsCard 
                                userName={userName}
                                totalClasses={stats.totalClasses}
                                completedClasses={stats.completedClasses}
                                upcomingClasses={stats.upcomingClasses}
                            />
                        )}
                        
                        {loadingClasses ? (
                            <div className="p-6 bg-white rounded-lg shadow text-center">
                                <p className="text-gray-500">Loading upcoming classes...</p>
                            </div>
                        ) : classesError ? (
                            <div className="p-6 bg-white rounded-lg shadow text-center">
                                <p className="text-red-500">{classesError}</p>
                            </div>
                        ) : upcomingClasses.length === 0 ? (
                            <div className="p-6 bg-white rounded-lg shadow text-center">
                                <p className="text-gray-500">No upcoming classes found</p>
                            </div>
                        ) : (
                            <StudentUpcomingClasses classes={upcomingClasses} />
                        )}
                        
                        <StudentTeacherCards title="Recommended Teachers" />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}