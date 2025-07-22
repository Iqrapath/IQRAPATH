import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatAvatarUrl } from '@/lib/helpers';

interface HeaderProps {
  teacher: {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
    location?: string;
    status?: string;
  };
  teacherProfile: {
    isVerified?: boolean;
    is_verified?: boolean;
    wallet_balance?: number;
    total_earned?: number;
    pending_payouts?: number;
  };
}

const Header: React.FC<HeaderProps> = ({ teacher, teacherProfile }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

<<<<<<< HEAD
  const formatCurrency = (amount: number | undefined) => {
    // Ensure amount is a number and not undefined or null
=======
  const formatCurrency = (amount: number) => {
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    return new Intl.NumberFormat().format(amount || 0);
  };

  const getVerificationStatus = () => {
<<<<<<< HEAD
    // Check if teacherProfile exists first
    if (!teacherProfile) {
      return 'unknown';
    }
    
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    const isVerified = teacherProfile.isVerified !== undefined 
      ? teacherProfile.isVerified 
      : teacherProfile.is_verified;
    
    if (isVerified === true) {
      return 'approved';
    } else if (isVerified === false && teacher.status === 'inactive') {
      return 'inactive';
    } else if (isVerified === false && teacher.status === 'pending') {
      return 'pending';
    } else {
      return 'unknown';
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="w-full">
        <img src="/assets/images/profile-bg.png" alt="Background" className="w-full h-20 md:h-30" />
      </div>

      {/* Profile and Earnings Container that overlaps the background */}
      <div className="px-4 -mt-8 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between md:ml-6 max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center">
          {/* Profile Photo - Overlapping */}
          <Avatar className="h-24 w-24 border-2 border-white shadow-md mb-3">
<<<<<<< HEAD
            {teacher.avatar ? (
              <AvatarImage 
                src={formatAvatarUrl(teacher.avatar)} 
                alt={teacher.name} 
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
=======
            <AvatarImage 
              src={formatAvatarUrl(teacher.avatar)} 
              alt={teacher.name} 
              className="object-cover"
            />
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials(teacher.name)}
            </AvatarFallback>
          </Avatar>

          {/* Teacher Name and Info */}
          <h1 className="text-lg font-medium text-gray-900 mt-1">{teacher.name}</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {teacher.role ? teacher.role.charAt(0).toUpperCase() + teacher.role.slice(1) : 'Teacher'}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {teacher.location || 'Lagos, Nigeria'}
          </div>

          {/* Verification Badge */}
          {verificationStatus === 'approved' && (
            <div className="flex items-center text-green-500 text-xs mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </div>
          )}
          
          {verificationStatus === 'pending' && (
            <div className="flex items-center text-yellow-500 text-xs mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Verification
            </div>
          )}
          
          {verificationStatus === 'inactive' && (
            <div className="flex items-center text-red-500 text-xs mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verification Rejected
            </div>
          )}
          
          {verificationStatus === 'unknown' && (
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Unknown Status
            </div>
          )}
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-lg shadow-md mt-6 md:mt-0 md:mr-20 p-4 w-full md:w-110 md:max-w-md">
          <h3 className="text-gray-800 font-medium text-lg mb-4">Earnings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Wallet Balance Box */}
            <div className="bg-blue-100 rounded-2xl py-2.5 px-3 flex-1">
              <div className="flex items-start mb-1.5">
                <div className="bg-gray-100 rounded-lg p-1 flex items-center justify-center">
                  <svg className="h-5 w-5 shrink-0 text-blue-500 mr-1.5 mt-0.5" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3111_32738)">
                      <path
                        d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M16.9699 14.4402C18.3399 14.6702 19.8499 14.4302 20.9099 13.7202C22.3199 12.7802 22.3199 11.2402 20.9099 10.3002C19.8399 9.59016 18.3099 9.35016 16.9399 9.59016"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M6.99994 14.4402C5.62994 14.6702 4.11994 14.4302 3.05994 13.7202C1.64994 12.7802 1.64994 11.2402 3.05994 10.3002C4.12994 9.59016 5.65994 9.35016 7.02994 9.59016"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M12.0001 14.6297C11.9401 14.6197 11.8701 14.6197 11.8101 14.6297C10.4301 14.5797 9.33008 13.4497 9.33008 12.0497C9.33008 10.6197 10.4801 9.46973 11.9101 9.46973C13.3401 9.46973 14.4901 10.6297 14.4901 12.0497C14.4801 13.4497 13.3801 14.5897 12.0001 14.6297Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M9.09021 17.7794C7.68021 18.7194 7.68021 20.2594 9.09021 21.1994C10.6902 22.2694 13.3102 22.2694 14.9102 21.1994C16.3202 20.2594 16.3202 18.7194 14.9102 17.7794C13.3202 16.7194 10.6902 16.7194 9.09021 17.7794Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
                {/* Amount */}
                <span className="text-base text-black font-bold leading-tight break-words ml-1">
<<<<<<< HEAD
                  #{formatCurrency(teacherProfile?.wallet_balance || 0)}
=======
                  #{formatCurrency(teacherProfile.wallet_balance || 0)}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                </span>
              </div>
              <div className="text-xs text-gray-500">Wallet Balance</div>
            </div>

            {/* Total Earned Box */}
            <div className="bg-green-100 rounded-2xl py-2.5 px-3 flex-1">
              <div className="flex items-start mb-1.5">
                <div className="bg-gray-100 rounded-lg p-1 flex items-center justify-center">
                  <svg className="h-5 w-5 shrink-0 text-green-500 mr-1.5 mt-0.5" viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3111_32738)">
                      <path
                        d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M16.9699 14.4402C18.3399 14.6702 19.8499 14.4302 20.9099 13.7202C22.3199 12.7802 22.3199 11.2402 20.9099 10.3002C19.8399 9.59016 18.3099 9.35016 16.9399 9.59016"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M6.99994 14.4402C5.62994 14.6702 4.11994 14.4302 3.05994 13.7202C1.64994 12.7802 1.64994 11.2402 3.05994 10.3002C4.12994 9.59016 5.65994 9.35016 7.02994 9.59016"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M12.0001 14.6297C11.9401 14.6197 11.8701 14.6197 11.8101 14.6297C10.4301 14.5797 9.33008 13.4497 9.33008 12.0497C9.33008 10.6197 10.4801 9.46973 11.9101 9.46973C13.3401 9.46973 14.4901 10.6297 14.4901 12.0497C14.4801 13.4497 13.3801 14.5897 12.0001 14.6297Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                      <path
                        d="M9.09021 17.7794C7.68021 18.7194 7.68021 20.2594 9.09021 21.1994C10.6902 22.2694 13.3102 22.2694 14.9102 21.1994C16.3202 20.2594 16.3202 18.7194 14.9102 17.7794C13.3202 16.7194 10.6902 16.7194 9.09021 17.7794Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
                {/* Amount */}
                <span className="text-base text-black font-bold leading-tight break-words ml-1">
<<<<<<< HEAD
                  #{formatCurrency(teacherProfile?.total_earned || 0)}
=======
                  #{formatCurrency(teacherProfile.total_earned || 0)}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                </span>
              </div>
              <div className="text-xs text-gray-500">Total Earned</div>
            </div>

            {/* Pending Payouts Box */}
            <div className="bg-yellow-100 rounded-2xl py-2.5 px-3 flex-1">
              <div className="flex items-start mb-1.5">
                <div className="bg-gray-100 rounded-lg p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1" id="mdi-progress-check" className="h-5 w-5 shrink-0 text-yellow-200 mr-0.5 mt-0.5"
                    viewBox="0 0 24 24">
                    <path
                      d="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M15.5,8.5L10.62,13.38L8.5,11.26L7.44,12.32L10.62,15.5L16.56,9.56L15.5,8.5M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37Z" 
                      stroke="currentColor" 
                      strokeLinecap="round"
                      strokeLinejoin="round" />
                  </svg>
                </div>
                {/* Amount */}
                <span className="text-base text-black font-bold leading-tight break-words ml-1">
<<<<<<< HEAD
                  #{formatCurrency(teacherProfile?.pending_payouts || 0)}
=======
                  #{formatCurrency(teacherProfile.pending_payouts || 0)}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                </span>
              </div>
              <div className="text-xs text-gray-500">Pending Payouts</div>
            </div>
          </div>
          <div className="text-right">
<<<<<<< HEAD
            <a href={`/admin/teachers/${teacher.id}/earnings`} className="text-xs text-blue-500 hover:underline">
=======
            <a href={`/teacher/earnings/${teacher.id}`} className="text-xs text-blue-500 hover:underline">
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
              View Teacher Earnings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;