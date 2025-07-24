import React from 'react';

interface ContactInfoProps {
  teacher: {
    email: string;
    phone?: string;
    sessionsTaught?: number;
    location?: string;
  };
  teacherProfile: {
    teaching_subjects?: string[] | Array<{id: number, name: string, pivot?: {is_primary: boolean}}>;
    subject?: string | string[];
    years_experience?: number;
    education?: string;
    bio?: string;
    experience?: number;
    subjects?: string[] | Array<{id: number, name: string, pivot?: {is_primary: boolean}}>;
    specialization?: string;
    teachingStyle?: string;
    currentInstitution?: string;
    previousInstitutions?: string;
    preferredStudentAge?: string;
    preferredClassSize?: string;
    preferredTeachingMethod?: string;
    hourlyRate?: number;
    currency?: string;
    amountPerSession?: number;
    isVerified?: boolean;
    lastActive?: string;
    location?: string;
    verification_status?: 'approved' | 'pending' | 'inactive' | 'unknown';
    wallet_balance?: number;
    total_earned?: number;
    pending_payouts?: number;
    formatted_subjects?: string;
    formatted_rating_with_count?: string;
  };
  totalCompletedSessions?: number;
  onEditClick?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  teacher,
  teacherProfile,
  totalCompletedSessions = 0,
  onEditClick
}) => {
  // Helper function to format subjects
  const formatSubjects = () => {
    if (!teacherProfile) {
      return 'Tajweed, Quran Recitation';
    }

    if (teacherProfile.formatted_subjects) {
      return teacherProfile.formatted_subjects;
    }

    // Handle subjects from database relationship
    if (teacherProfile.teaching_subjects) {
      if (Array.isArray(teacherProfile.teaching_subjects) && teacherProfile.teaching_subjects.length > 0) {
        if (typeof teacherProfile.teaching_subjects[0] === 'object' && 'name' in teacherProfile.teaching_subjects[0]) {
          // Handle array of objects from relationship
          return teacherProfile.teaching_subjects.map((subject: any) => subject.name).join(', ');
        } else {
          // Handle array of strings
          return teacherProfile.teaching_subjects.join(', ');
        }
      }
    }

    if (teacherProfile.subjects) {
      if (Array.isArray(teacherProfile.subjects) && teacherProfile.subjects.length > 0) {
        if (typeof teacherProfile.subjects[0] === 'object' && 'name' in teacherProfile.subjects[0]) {
          return teacherProfile.subjects.map((subject: any) => subject.name).join(', ');
        } else {
          return teacherProfile.subjects.join(', ');
        }
      }
    }

    return 'Tajweed, Quran Recitation';
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm relative">
      {/* Section Title */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
        {/* Desktop Edit Button */}
        <button
          onClick={onEditClick}
          className="hidden sm:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 gap-4">
        {/* Row 1: Email and Phone */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          {/* Email */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{teacher.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm">{teacher.phone || '+2347012345678'}</span>
          </div>
        </div>

        {/* Row 2: Subjects and Sessions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          {/* Subjects */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">
              Subjects: {formatSubjects()}
            </span>
          </div>

          {/* Sessions */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{totalCompletedSessions} Sessions Taught</span>
          </div>
        </div>

        {/* Row 3: Rating and Location */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          {/* Rating */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm">{teacherProfile?.formatted_rating_with_count || '4.8 (24 reviews)'}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{teacher.location || teacherProfile?.location || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Edit Button */}
      <div className="mt-4 text-center sm:hidden">
        <button
          onClick={onEditClick}
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit Information
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;