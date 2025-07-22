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
    email?: string;
    phone?: string;
  };
  teacherProfile: {
    isVerified?: boolean;
    is_verified?: boolean;
    wallet_balance?: number;
    total_earned?: number;
    pending_payouts?: number;
    available_for_payout?: number;
  };
}

const Header: React.FC<HeaderProps> = ({ teacher, teacherProfile }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0).replace('NGN', '');
  };

  const getVerificationStatus = () => {
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

      <div className="px-6 -mt-12">
        {/* Profile Section */}
        <div className="flex flex-col items-start">
          {/* Profile Photo - Overlapping */}
          <Avatar className="h-24 w-24 border-2 border-white shadow-md mb-3">
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

        {/* Earnings Card - Below the profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 p-4 max-w-3xl">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Earnings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {/* Wallet Balance Box */}
            <div className="bg-blue-100 rounded-2xl py-3 px-4">
              <div className="flex items-center mb-2">
                <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M13.583 5.61c.554-.078.871-.057 1.109.02c.378.122.715.342.978.633c-.402-.013-.85-.013-1.354-.013h-3.731l.704-.162c1.018-.235 1.733-.4 2.294-.478M4.75 11.8c0-.853 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h5.4c1.346 0 2.025.006 2.502.128l1.118.286l-.193-1.138c-.073-.432-.195-.823-.41-1.18a3.75 3.75 0 0 0-2.064-1.643c-.552-.178-1.131-.169-1.778-.079c-.634.089-1.414.269-2.388.494l-3.462.799c-.641.148-1.162.268-1.582.398c-.436.134-.812.293-1.152.541a3.75 3.75 0 0 0-1.24 1.56c-.166.387-.236.79-.269 1.243c-.032.44-.032.974-.032 1.632V11.8z" opacity="0.5" /><path fill="currentColor" d="M7 15.25a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" /><path fill="currentColor" d="M8.768 6.25h5.759c.676 0 1.222 0 1.665.03c.457.031.86.097 1.243.255a3.75 3.75 0 0 1 2.03 2.03c.158.382.224.786.255 1.242c.03.432.03.96.03 1.611a1.75 1.75 0 0 1 0 3.164c0 .65 0 1.179-.03 1.61c-.031.457-.097.86-.255 1.243a3.75 3.75 0 0 1-2.03 2.03c-.382.158-.786.224-1.242.255c-.445.03-.99.03-1.666.03h-5.76c-.812 0-1.468 0-1.998-.043c-.547-.045-1.027-.14-1.471-.366a3.75 3.75 0 0 1-1.64-1.639c-.226-.444-.32-.924-.365-1.47c-.043-.531-.043-1.187-.043-2v-2.464c0-.813 0-1.469.043-2c.045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.639-1.64c.444-.226.924-.32 1.47-.365c.531-.043 1.187-.043 2-.043m9.455 3.66c-.026-.38-.074-.602-.144-.771a2.25 2.25 0 0 0-1.218-1.218c-.169-.07-.39-.118-.77-.144c-.388-.027-.882-.027-1.591-.027H8.8c-.852 0-1.447 0-1.91.038c-.453.037-.714.107-.911.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912c-.037.462-.038 1.056-.038 1.909v2.4c0 .853 0 1.447.038 1.91c.037.453.107.714.207.912c.216.423.56.767.984.983c.197.1.458.17.912.207c.462.037 1.057.038 1.909.038h5.7c.71 0 1.204 0 1.59-.027c.38-.026.602-.074.771-.144a2.25 2.25 0 0 0 1.218-1.218c.07-.169.118-.39.144-.77c.023-.34.027-.763.027-1.341H17a1.75 1.75 0 1 1 0-3.5h1.25c0-.578-.004-1-.027-1.34M17 12.75a.25.25 0 1 0 0 .5h2a.25.25 0 1 0 0-.5z" />
                </svg>
                <span className="text-xl font-bold ml-2">
                  {formatCurrency(teacherProfile.wallet_balance || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500">Wallet Balance</div>
            </div>

            {/* Total Earned Box */}
            <div className="bg-green-100 rounded-2xl py-3 px-4">
              <div className="flex items-center mb-2">
                <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M13.583 5.61c.554-.078.871-.057 1.109.02c.378.122.715.342.978.633c-.402-.013-.85-.013-1.354-.013h-3.731l.704-.162c1.018-.235 1.733-.4 2.294-.478M4.75 11.8c0-.853 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h5.4c1.346 0 2.025.006 2.502.128l1.118.286l-.193-1.138c-.073-.432-.195-.823-.41-1.18a3.75 3.75 0 0 0-2.064-1.643c-.552-.178-1.131-.169-1.778-.079c-.634.089-1.414.269-2.388.494l-3.462.799c-.641.148-1.162.268-1.582.398c-.436.134-.812.293-1.152.541a3.75 3.75 0 0 0-1.24 1.56c-.166.387-.236.79-.269 1.243c-.032.44-.032.974-.032 1.632V11.8z" opacity="0.5" /><path fill="currentColor" d="M7 15.25a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" /><path fill="currentColor" d="M8.768 6.25h5.759c.676 0 1.222 0 1.665.03c.457.031.86.097 1.243.255a3.75 3.75 0 0 1 2.03 2.03c.158.382.224.786.255 1.242c.03.432.03.96.03 1.611a1.75 1.75 0 0 1 0 3.164c0 .65 0 1.179-.03 1.61c-.031.457-.097.86-.255 1.243a3.75 3.75 0 0 1-2.03 2.03c-.382.158-.786.224-1.242.255c-.445.03-.99.03-1.666.03h-5.76c-.812 0-1.468 0-1.998-.043c-.547-.045-1.027-.14-1.471-.366a3.75 3.75 0 0 1-1.64-1.639c-.226-.444-.32-.924-.365-1.47c-.043-.531-.043-1.187-.043-2v-2.464c0-.813 0-1.469.043-2c.045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.639-1.64c.444-.226.924-.32 1.47-.365c.531-.043 1.187-.043 2-.043m9.455 3.66c-.026-.38-.074-.602-.144-.771a2.25 2.25 0 0 0-1.218-1.218c-.169-.07-.39-.118-.77-.144c-.388-.027-.882-.027-1.591-.027H8.8c-.852 0-1.447 0-1.91.038c-.453.037-.714.107-.911.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912c-.037.462-.038 1.056-.038 1.909v2.4c0 .853 0 1.447.038 1.91c.037.453.107.714.207.912c.216.423.56.767.984.983c.197.1.458.17.912.207c.462.037 1.057.038 1.909.038h5.7c.71 0 1.204 0 1.59-.027c.38-.026.602-.074.771-.144a2.25 2.25 0 0 0 1.218-1.218c.07-.169.118-.39.144-.77c.023-.34.027-.763.027-1.341H17a1.75 1.75 0 1 1 0-3.5h1.25c0-.578-.004-1-.027-1.34M17 12.75a.25.25 0 1 0 0 .5h2a.25.25 0 1 0 0-.5z" />
                </svg>
                <span className="text-xl font-bold ml-2">
                  {formatCurrency(teacherProfile.total_earned || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500">Total Earned</div>
            </div>

            {/* Pending Payouts Box */}
            <div className="bg-yellow-100 rounded-2xl py-3 px-4">
              <div className="flex items-center mb-2">
                <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M10 20.777a9 9 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a9 9 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A9 9 0 0 1 10 3.223"/><path d="m9 12l2 2l4-4"/></g>
                </svg>
                <span className="text-xl font-bold ml-2">
                  {formatCurrency(teacherProfile.pending_payouts || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500">Pending Payouts</div>
            </div>

            {/* Available for Payout Box */}
            <div className="bg-teal-100 rounded-2xl py-3 px-4">
              <div className="flex items-center mb-2">
                <svg className="h-8 w-8 text-teal-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 16.5H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.5 16.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12.03V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 3.5V8.5L22 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 8.5L18 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-bold ml-2">
                  {formatCurrency(teacherProfile.available_for_payout || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500">Available for Payout</div>
            </div>
          </div>
          <div className="text-right mt-3">
            <a href={`/admin/teachers/${teacher.id}`} className="text-sm text-blue-500 hover:underline">
              Go to profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;