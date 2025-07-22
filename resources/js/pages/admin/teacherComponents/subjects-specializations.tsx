import React from 'react';

interface SubjectsSpecializationsProps {
  teacher: {
    name: string;
  };
  teacherProfile: {
    subject?: string | string[];
    subjects?: string | string[];
    teaching_subjects?: string | string[];
    years_experience?: number;
    availability?: string | {
      [key: string]: {
        available: boolean;
        slots?: Array<{
          start: string;
          end: string;
        }>;
      };
    };
    teaching_type?: string;
    teaching_mode?: string;
    teaching_languages?: string | string[] | Record<string, boolean>;
  };
  onEditClick?: () => void;
}

const SubjectsSpecializations: React.FC<SubjectsSpecializationsProps> = ({
  teacher,
  teacherProfile,
  onEditClick
}) => {
  // Format subjects list
  const formatSubjectsList = (subjects?: string | string[]) => {
    if (!subjects) return [];
    if (typeof subjects === 'string') {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(subjects);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return Object.keys(parsed);
        return [subjects];
      } catch {
        // If not valid JSON, split by comma
        return subjects.split(',').map(s => s.trim());
      }
    }
    return Array.isArray(subjects) ? subjects : [subjects];
  };

  // Format availability data
  const formatAvailability = () => {
    let availabilityData: Record<string, any> = {};
    
    if (teacherProfile.availability) {
      if (typeof teacherProfile.availability === 'string') {
        try {
          availabilityData = JSON.parse(teacherProfile.availability);
        } catch {
          // If parsing fails, use default
          availabilityData = {};
        }
      } else {
        availabilityData = teacherProfile.availability;
      }
    }

    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };

    // If no availability data or empty object, return default
    if (!availabilityData || Object.keys(availabilityData).length === 0) {
      return (
        <>
          <div>- Mon-Fri: 9:00AM - 1:00PM, 5:00PM - 7:00PM</div>
          <div>- Saturday: 10:00AM - 12:00PM</div>
        </>
      );
    }

    // Check if any day has availability
    const hasAvailability = Object.values(availabilityData).some(
      (day: any) => day && day.available && Array.isArray(day.slots) && day.slots.length > 0
    );

    if (!hasAvailability) {
      return (
        <>
          <div>- Mon-Fri: 9:00AM - 1:00PM, 5:00PM - 7:00PM</div>
          <div>- Saturday: 10:00AM - 12:00PM</div>
        </>
      );
    }

    // Format the available days and slots
    return Object.entries(days).map(([dayKey, dayName]) => {
      const dayData = availabilityData[dayKey];
      if (!dayData || !dayData.available) return null;
      
      // Ensure slots is an array
      const slots = Array.isArray(dayData.slots) ? dayData.slots : [];
      
      if (slots.length === 0) return null;

      return (
        <div className="mb-1" key={dayKey}>
          <span className="font-medium">- {dayName}:</span>{' '}
          {slots.map((slot: any, index: number) => (
            <React.Fragment key={index}>
              {slot.start} - {slot.end}
              {index < slots.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </div>
      );
    });
  };

  // Format languages
  const formatLanguages = () => {
    let languages: string[] = [];

    if (teacherProfile.teaching_languages) {
      if (typeof teacherProfile.teaching_languages === 'string') {
        try {
          const parsed = JSON.parse(teacherProfile.teaching_languages);
          if (Array.isArray(parsed)) {
            languages = parsed;
          } else if (typeof parsed === 'object') {
            languages = Object.keys(parsed);
          } else {
            languages = [teacherProfile.teaching_languages];
          }
        } catch {
          languages = [teacherProfile.teaching_languages];
        }
      } else if (Array.isArray(teacherProfile.teaching_languages)) {
        languages = teacherProfile.teaching_languages;
      } else if (typeof teacherProfile.teaching_languages === 'object') {
        languages = Object.keys(teacherProfile.teaching_languages);
      }
    }

    if (languages.length === 0) {
      return 'English, Hausa, Arabic';
    }

    return languages.map(lang => 
      typeof lang === 'string' ? lang.charAt(0).toUpperCase() + lang.slice(1) : ''
    ).join(', ');
  };

  // Use teaching_subjects as the primary source, then fall back to subjects or subject
  const subjects = formatSubjectsList(teacherProfile.teaching_subjects || teacherProfile.subjects || teacherProfile.subject);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm relative">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium text-gray-900">Subjects & Specializations</h2>
        <button 
          onClick={onEditClick}
          className="text-xs text-blue-500 border border-blue-500 px-4 py-1 rounded hover:bg-blue-50"
        >
          Edit
        </button>
      </div>

      <div className="space-y-5">
        {/* Subjects Taught */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Subjects Taught:</div>
          <div className="text-gray-700">
            {subjects.length > 0 
              ? subjects.join(', ')
              : 'Quran Memorization (Hifz), Tajweed, Arabic'
            }
          </div>
        </div>

        {/* Teaching Experience */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Teaching Experience:</div>
          <div className="text-gray-700">
            {teacherProfile.years_experience || 0} {teacherProfile.years_experience === 1 ? 'Year' : 'Years'} Experience teaching online and in madrasahs
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Availability Schedule:</div>
          <div className="text-gray-700">
            {formatAvailability()}
          </div>
        </div>

        {/* Teaching Type */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Teaching Type:</div>
          <div className="text-gray-700">
            {teacherProfile.teaching_type || 'Online'}
          </div>
        </div>

        {/* Teaching Mode */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Teaching Mode:</div>
          <div className="text-gray-700">
            {teacherProfile.teaching_mode || 'Part-time'}
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-52 font-medium text-gray-700 mb-1 sm:mb-0">Languages Spoken:</div>
          <div className="text-gray-700">
            {formatLanguages()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsSpecializations;