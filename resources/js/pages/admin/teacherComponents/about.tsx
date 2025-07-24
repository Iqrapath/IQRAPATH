import React from 'react';

interface AboutProps {
  teacher: {
    name: string;
  };
  teacherProfile: {
    bio?: string;
    years_experience?: number;
    specialization?: string;
    teachingStyle?: string;
  };
  onEditClick?: () => void;
}

const About: React.FC<AboutProps> = ({ 
  teacher, 
  teacherProfile, 
  onEditClick 
}) => {
  // Format bio text with line breaks
  const formatBio = (bio: string) => {
    return bio.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < bio.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Check if bio has meaningful content
  const hasBio = teacherProfile.bio && teacherProfile.bio.trim().length > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm relative">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium text-gray-900">About:</h2>
      </div>

      {/* Teacher Bio */}
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="text-gray-700 space-y-4 text-base max-w-3xl">
          {hasBio ? (
            formatBio(teacherProfile.bio!)
          ) : (
            <>
              <p>
                With over {teacherProfile.years_experience || 5} years of dedicated experience in 
                Islamic education, {teacher.name} has guided numerous students on their journey 
                to understanding and memorizing the Quran.
              </p>

              <p>
                {teacherProfile.specialization 
                  ? `Specializing in ${teacherProfile.specialization}, ` 
                  : 'Specializing in Quran memorization and Tajweed, '}
                {teacher.name} is committed to providing a supportive and enriching learning 
                environment that respects each student's unique learning pace and style.
              </p>

              <p>
                {teacherProfile.teachingStyle 
                  ? teacherProfile.teachingStyle 
                  : `What sets ${teacher.name} apart is a patient, methodical approach to teaching 
                    that emphasizes proper pronunciation, understanding of meaning, and practical 
                    application of Quranic teachings in daily life.`}
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Edit Button - Positioned in the middle right */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:block">
        <button 
          onClick={onEditClick} 
          className="text-xm text-gray-700 border border-gray-300 rounded-md px-4 py-1 hover:text-blue-500"
        >
          Edit
        </button>
      </div>
      
      {/* Mobile Edit Button */}
      <div className="mt-4 text-center sm:hidden">
        <button 
          onClick={onEditClick} 
          className="text-sm text-gray-700 border border-gray-300 rounded-md px-4 py-1"
        >
          Edit Information
        </button>
      </div>
    </div>
  );
};

export default About;