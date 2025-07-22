import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { MoreHorizontal, RefreshCw } from 'lucide-react';
// import { StudentTopUpModal } from '@/components/student/student-top-up-modal';

interface TeacherRightSidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TeacherRightSidebarNav({ className, ...props }: TeacherRightSidebarNavProps) {
    const [showTopUpModal, setShowTopUpModal] = useState(false);

    const handlePaymentComplete = (amount: number, method: string) => {
        // Here you would handle the payment completion, such as updating the user's balance
        console.log(`Payment completed: ${amount} via ${method}`);
        // You might want to refresh the balance or show a success notification
    };

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-[#f6fbfa] text-gray-800 rounded-xl overflow-hidden w-70",
                className
            )}
            {...props}
        >
            {/* Balance Card */}
            <div className="p-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M7 15C8.10457 15 9 14.1046 9 13C9 11.8954 8.10457 11 7 11C5.89543 11 5 11.8954 5 13C5 14.1046 5.89543 15 7 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M14 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M17 13H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="text-xs font-medium">Your Balance</span>
                        </div>
                        <div className="flex items-center bg-gray-50 rounded px-1 py-0.5 text-[10px]">
                            NGN <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="text-[10px] text-gray-500 mb-1">
                        Payment ID: J589P4764
                        <RefreshCw size={10} className="inline ml-1" />
                    </div>

                    <div className="text-xl font-bold mb-2">
                        #60,000
                    </div>

                    <button
                        className="w-full text-[#2c7870] text-xs text-center border border-[#2c7870] rounded py-1 hover:bg-[#2c7870]/5 transition-colors"
                        onClick={() => setShowTopUpModal(true)}
                    >
                        Top Up Balance
                    </button>
                </div>
            </div>

            {/* Recent Messages */}
            <div className="px-3 pb-2">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-xs font-medium">Recent Messages</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={14} />
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-start">
                        <img
                            src="/assets/images/avatars/avatar-1.png"
                            alt="Ahmed Khalid"
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-xs font-medium truncate">Ahmed Khalid</span>
                                <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">3:20</span>
                            </div>
                            <p className="text-[10px] text-gray-600 truncate">I'll try to share materials for Qawaid...</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <img
                            src="/assets/images/avatars/avatar-1.png"
                            alt="Fatima Noor"
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-xs font-medium truncate">Fatima Noor</span>
                                <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">Yesterday</span>
                            </div>
                            <p className="text-[10px] text-gray-600 truncate">Thank you for the last lesson!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-center">
                    <a href="/messages" className="text-[10px] text-[#2c7870] hover:underline">
                        View All Messages
                    </a>
                </div>
            </div>

            {/* Promotional Banner */}
            <div className="mt-auto px-3 pb-3">
                <div className="rounded-lg overflow-hidden relative bg-gradient-to-b to-[#d7f3e3]">
                    <div className="flex flex-col items-center text-center pt-4 pb-3 px-3">
                        <img
                            src="/assets/images/quran-boy.png"
                            alt="Quran Memorization"
                            className="w-24 h-24 object-contain mb-1"
                        />
                        <h3 className="text-sm font-medium text-[#2c7870] mb-0.5">
                            Enroll in Our Quran Memorization Plans Today!
                        </h3>
                        <p className="text-[10px] text-gray-600 mb-3 leading-tight">
                            Full Quran, Half Quran or Juz Amma - Tailored Learning<br />
                            for Every Student
                        </p>
                        <div className="flex gap-2">
                            <a
                                href="/memorization-plans"
                                className="text-[10px] px-3 py-1 bg-[#2c7870] text-white rounded-full hover:bg-[#235652] transition"
                            >
                                View Memorization Plans
                            </a>
                            <a
                                href="/learn-more"
                                className="text-[10px] px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top-up Modal */}
            {/* <StudentTopUpModal
                isOpen={showTopUpModal}
                onClose={() => setShowTopUpModal(false)}
                onPaymentComplete={handlePaymentComplete}
            /> */}
        </div>
    );
}