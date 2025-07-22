import React from 'react';

interface PerformanceStatsProps {
  totalSessions?: number;
  averageRating?: number;
  totalReviews?: number;
  upcomingSessions?: Array<{
    student: string;
    date: string;
    time: string;
  }>;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  totalSessions = 350,
  averageRating = 4.8,
  totalReviews = 95,
  upcomingSessions = []
}) => {
  // Default upcoming sessions if none provided
  const defaultUpcomingSessions = [
    { student: 'Amina Musa (Juz\' Amma)', date: 'Apr 15', time: '10:00AM' },
    { student: 'Sulaiman Bello (Hifz)', date: 'Apr 15', time: '11:30AM' }
  ];

  const sessionsToShow = upcomingSessions.length > 0 ? upcomingSessions : defaultUpcomingSessions;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Performance Stats</h2>

      <div className="space-y-4">
        <div className="flex justify-start ">
          <span className="text-gray-700 font-medium">Total Sessions Taught:</span>
          <span className="text-gray-900 ml-10">{totalSessions}</span>
        </div>

        <div className="flex justify-start">
          <span className="text-gray-700 font-medium">Average Rating:</span>
          <span className="text-gray-900 ml-22">{averageRating}</span>
        </div>

        <div className="flex justify-start">
          <span className="text-gray-700 font-medium">Total Reviews:</span>
          <span className="text-gray-900 ml-26">{totalReviews}</span>
        </div>

        <div className="flex justify-start">
          <h3 className="text-gray-700 font-medium mb-2">Upcoming Sessions:</h3>
          <div className="space-y-2 ml-10">
            {sessionsToShow.map((session, index) => (
              <div key={index} className="text-gray-700">
                - {session.date}, {session.time} – {session.student}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;