import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BreadcrumbItem } from '@/types';
import AdminLayout from '@/layouts/admin-layout';
import { Calendar } from 'lucide-react';
import { StatsOverview, RevenueChart, StudentList, BookingsList } from '@/components/dashboard';

interface AdminDashboardProps extends PageProps {
  breadcrumbs?: BreadcrumbItem[];
  statsData: Array<{
    title: string;
    value: number;
    icon: string;
    gradient: string;
  }>;
  revenueData: Array<{
    name: string;
    value: number;
  }>;
  students: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
  totalStudents: number;
  bookings: Array<{
    id: number;
    user: {
      name: string;
      avatar: string;
    };
    action: string;
    subject: string;
  }>;
  totalBookings: number;
}

export default function AdminDashboard({
  auth,
  breadcrumbs,
  statsData,
  revenueData,
  students,
  totalStudents,
  bookings,
  totalBookings
}: AdminDashboardProps) {
  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />

      <div className="py-4 px-6">
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Overview</h1>

        {/* Stats Overview */}
        <StatsOverview stats={statsData.map(stat => ({
          ...stat,
          // Parse SVG string back to React component
          icon: <div dangerouslySetInnerHTML={{ __html: stat.icon }} />
        }))} />

        {/* Bottom Section - Revenue Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Summary Chart */}
          <RevenueChart data={revenueData} />

          {/* Right Column - Recent Students and Bookings */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            {/* Recent Students Section */}
            <StudentList students={students} totalCount={totalStudents} />

            {/* Recent Bookings Section */}
            <BookingsList bookings={bookings} totalCount={totalBookings} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
