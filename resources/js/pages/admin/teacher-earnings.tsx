import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import Header from './teacherEarningsComponent/header';
import TransactionLog from './teacherEarningsComponent/transactionLog';
import PayoutRequests from './teacherEarningsComponent/payoutRequests';
import ComingSoonModal from '@/components/ui/coming-soon-modal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  status?: string;
  is_verified?: boolean;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  date: string;
  description: string;
  reference: string;
  student_name?: string;
}

interface PayoutRequest {
  id: number;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  payment_details: any;
}

interface MonthlyEarning {
  month: string;
  amount: number;
}

interface Earnings {
  wallet_balance: number;
  total_earned: number;
  pending_payouts: number;
  available_for_payout: number;
  total_sessions?: number;
  transactions?: Transaction[];
  payout_requests?: PayoutRequest[];
  monthly_earnings?: MonthlyEarning[];
}

interface TeacherEarningsProps {
  teacher: Teacher;
  earnings: Earnings;
}

export default function TeacherEarnings({ teacher, earnings }: TeacherEarningsProps) {
  const [processing, setProcessing] = useState<boolean>(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

  const handleApproveRequest = (id: number) => {
    setProcessing(true);
    router.post(`/admin/teachers/${teacher.id}/payout-requests/${id}/approve`, {}, {
      onSuccess: () => {
        toast.success('Payout request approved successfully');
        setProcessing(false);
      },
      onError: () => {
        toast.error('Failed to approve payout request');
        setProcessing(false);
      }
    });
  };

  const handleDeclineRequest = (id: number) => {
    setProcessing(true);
    router.post(`/admin/teachers/${teacher.id}/payout-requests/${id}/reject`, {}, {
      onSuccess: () => {
        toast.success('Payout request declined');
        setProcessing(false);
      },
      onError: () => {
        toast.error('Failed to decline payout request');
        setProcessing(false);
      }
    });
  };

  return (
    <AdminLayout>
      <Head title={`${teacher?.name} - Earnings`} />

      <div className="py-6 px-6">
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Teacher Management', href: '/admin/teachers' },
                { title: `Teacher Profile - ${teacher.name}`, href: `/admin/teachers/${teacher.id}` },
                { title: `Teacher Earnings - ${teacher.name}` }
              ]}
            />
          </div>
        </div>

        <div className="mb-6">
          <Header 
            teacher={teacher} 
            teacherProfile={{
              isVerified: teacher?.is_verified,
              wallet_balance: earnings?.wallet_balance,
              total_earned: earnings?.total_earned,
              pending_payouts: earnings?.pending_payouts,
              available_for_payout: earnings?.available_for_payout
            }} 
          />
        </div>

        <div className="mb-6">
          <TransactionLog transactions={earnings?.transactions || []} />
        </div>

        <div className="mb-6">
          <PayoutRequests 
            payoutRequests={earnings?.payout_requests || []}
            onApproveRequest={handleApproveRequest}
            onDeclineRequest={handleDeclineRequest}
          />
        </div>

        {/* Coming Soon Modal */}
        <ComingSoonModal 
          isOpen={isComingSoonModalOpen}
          onClose={() => setIsComingSoonModalOpen(false)}
          featureName="Edit Earnings"
          description="The earnings editing feature is currently under development and will be available soon. Thank you for your patience!"
        />
      </div>
    </AdminLayout>
  );
}
