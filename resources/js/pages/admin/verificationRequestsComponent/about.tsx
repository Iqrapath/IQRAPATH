import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AboutProps {
  teacher: {
    name: string;
    email?: string;
    phone?: string;
    phone_number?: string;
    subject?: string;
    location?: string;
    hourly_rate?: number;
  };
  teacherProfile: {
    bio?: string;
    years_of_experience?: number;
    specialization?: string;
    teaching_subjects?: string[];
    teachingStyle?: string;
    total_sessions_taught?: number;
    overall_rating?: number;
    total_reviews?: number;
    wallet_balance?: number;
    total_earned?: number;
    pending_payouts?: number;
  };
  submittedDate?: string;
  videoStatus?: string;
  status?: string;
  meetingLink?: string | null;
  videoPlatform?: string | null;
  onScheduleCall?: () => void;
  // onProfileUpdate?: (data: AboutEditData) => void;
}

const About: React.FC<AboutProps> = ({ 
  teacher, 
  teacherProfile,
  submittedDate,
  videoStatus = "not_scheduled",
  status = "pending",
  meetingLink,
  videoPlatform,
  onScheduleCall
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Format bio text with line breaks
  const formatBio = (bio: string) => {
    return bio?.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < bio.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Check if bio has meaningful content
  const hasBio = teacherProfile?.bio && teacherProfile.bio.trim().length > 0;

  // Format rating to one decimal place
  const formatRating = (rating?: number) => {
    if (!rating) return "4.9";
    return rating.toFixed(1);
  };

  // Format number of reviews
  const formatReviews = (reviews?: number) => {
    if (!reviews) return "210";
    return reviews.toString();
  };

  // Get status badge color based on status
  const getStatusBadgeClass = (status?: string) => {
    switch(status) {
      case 'verified':
        return "bg-green-100 text-green-700 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-700 border-red-200";
      case 'live_video':
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  // Get video status text
  const getVideoStatusText = (status?: string) => {
    switch(status) {
      case 'not_scheduled':
        return 'Not Scheduled';
      case 'scheduled':
        return 'Call Scheduled';
      case 'completed':
        return 'Call Completed';
      case 'missed':
        return 'Call Missed';
      default:
        return 'Not Scheduled';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm relative">
      <div className="flex flex-col space-y-4">
        {/* Contact Information Row */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Email */}
          <div className="flex items-center mb-2 md:mb-0">
            <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-800">{teacher.email || "email@example.com"}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36163C2.30513 3.09849 2.44757 2.85669 2.63477 2.65163C2.82196 2.44656 3.04981 2.28271 3.30379 2.17053C3.55778 2.05834 3.83234 2.0004 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23679 4.68007 9.47558 5.62273 9.82 6.53C9.96945 6.88792 10.0008 7.27691 9.91223 7.65088C9.82366 8.02485 9.6194 8.36811 9.33 8.64L8.09 9.88C9.51356 12.3936 11.6064 14.4864 14.12 15.91L15.36 14.67C15.6319 14.3806 15.9752 14.1763 16.3491 14.0878C16.7231 13.9992 17.1121 14.0306 17.47 14.18C18.3773 14.5244 19.3199 14.7632 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-800">{teacher.phone_number || teacher.phone || "+1234567890"}</span>
          </div>
        </div>

        {/* Subjects and Sessions Row */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Subjects */}
          <div className="flex items-center mb-2 md:mb-0">
            <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-800">Subjects: {teacher.subject || teacherProfile?.teaching_subjects?.join(', ') || "Not specified"}</span>
          </div>

          {/* Sessions */}
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-800">{teacherProfile?.total_sessions_taught || 0} Sessions</span>
          </div>
        </div>

        {/* Location and Rate Row */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Location */}
          {teacher.location && (
            <div className="flex items-center mb-2 md:mb-0">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5304 21.4851 12 21.4851C11.4696 21.4851 10.961 21.2746 10.586 20.9L6.343 16.657C4.88545 15.1995 3.99866 13.2416 3.86383 11.1481C3.729 9.05455 4.35809 6.98576 5.64182 5.34282C6.92555 3.69988 8.77203 2.61736 10.8468 2.27207C12.9215 1.92677 15.0491 2.34088 16.7995 3.43018C18.5498 4.51947 19.7982 6.20879 20.3132 8.15639C20.8281 10.104 20.5756 12.1696 19.6089 13.9173C18.6423 15.6651 17.0351 16.9829 15.1219 17.6087C13.2087 18.2346 11.1174 18.1256 9.28 17.3L13 13.57" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-gray-800">{teacher.location}</span>
            </div>
          )}

          {/* Hourly Rate */}
          {teacher.hourly_rate && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-gray-800">${teacher.hourly_rate}/hr</span>
            </div>
          )}
        </div>

        {/* Rating Row */}
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="none"/>
          </svg>
          <span className="text-gray-800">{formatRating(teacherProfile?.overall_rating)} ({formatReviews(teacherProfile?.total_reviews)} Reviews)</span>
        </div>
      </div>
      
      {/* Edit Button - Positioned in the top right */}
      <div className="absolute right-5 top-5">
        <button 
          onClick={() => setShowEditModal(true)} 
          className="text-sm text-gray-700 border border-gray-300 rounded-md px-4 py-1 hover:text-blue-500"
        >
          Edit
        </button>
      </div>

      {/* Edit Modal */}
      {/* {showEditModal && (
        <AboutEditModal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            if (onProfileUpdate) onProfileUpdate(data);
            setShowEditModal(false);
          }}
          teacherProfile={teacherProfile}
          teacher={teacher}
        />
      )} */}

      {/* Divider */}
      <div className="border-t border-gray-200 my-5"></div>

      {/* Meeting Link Section */}
      {videoStatus === 'scheduled' && meetingLink && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-800">Video Call Information</h4>
              <p className="text-sm text-blue-600 mt-1">
                Platform: {videoPlatform || 'Video Call'}
              </p>
              <p className="text-sm text-blue-600 mt-1 break-all">
                Link: <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="underline">{meetingLink}</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div>
            <span className="font-medium text-gray-700">Submitted On:</span>
            <span className="ml-2 bg-gray-100 text-gray-700 px-3 py-1 rounded">{submittedDate}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-1">Status:</span>
            <Badge className={getStatusBadgeClass(status)}>
              {status === 'verified' ? 'Verified' : 
               status === 'rejected' ? 'Rejected' : 
               status === 'live_video' ? 'Live Video' : 'Pending'}
            </Badge>
          </div>
          <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-1">Video Status:</span>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {getVideoStatusText(videoStatus)}
            </Badge>
          </div>
        </div>

        {/* Schedule Button - Only show if not already verified or rejected */}
        {(status === 'pending' || status === 'live_video') && (
          <Button 
            className="w-full md:w-auto text-teal-600 bg-transparent border border-teal-600 hover:bg-teal-50"
            onClick={onScheduleCall}
          >
            {videoStatus === 'scheduled' ? 'Reschedule Call' : 'Schedule Verification Call'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default About;