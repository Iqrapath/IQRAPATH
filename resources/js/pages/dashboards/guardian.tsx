import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

export default function GuardianDashboard({ auth }: PageProps) {
  return (
    <AppLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Guardian Dashboard</h2>}
    >
      <Head title="Guardian Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h3 className="text-lg font-medium mb-4">Welcome, Guardian!</h3>
              <p>This is your guardian dashboard where you can monitor your ward's academic progress.</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700">My Students</h4>
                  <p className="text-sm text-blue-600">View your children's profiles</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-700">Academic Performance</h4>
                  <p className="text-sm text-green-600">Monitor grades and performance</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-700">Communication</h4>
                  <p className="text-sm text-purple-600">Message teachers and staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
