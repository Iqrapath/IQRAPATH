import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface WelcomeModalProps {
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (preferences: {
    subjects: string[];
    learningTimes: string[];
  }) => void;
}

export function WelcomeModal({
  userName = 'Abdullah',
  isOpen,
  onClose,
  onSavePreferences,
}: WelcomeModalProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleTimeChange = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleSave = () => {
    onSavePreferences({
      subjects: selectedSubjects,
      learningTimes: selectedTimes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="text-center pt-20 pb-8">
          <h2 className="text-xl font-semibold">
            <span className="inline-block mr-2">👋</span> Welcome {userName}!, Start <br /> Learning Today
          </h2>
        </div>

        <div className="mx-8 mb-8">
          <div className="border border-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800">Set Your Learning Preferences</h3>
            <p className="text-sm text-gray-500 mb-5">Help us match you with the best teachers.</p>

            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Preferred Subjects</h4>
              <div className="grid grid-cols-3 gap-y-3">
                {['Hifz', 'Hadith', 'Tajweed', 'Fiqh', 'Tawheed'].map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => handleSubjectChange(subject)}
                      className="border-gray-300"
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="text-sm font-medium leading-none text-gray-700"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Preferred Learning Time:</h4>
              <div className="grid grid-cols-2 gap-y-3">
                {['Morning', 'Afternoon', 'Evening', 'Weekend'].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${time}`}
                      checked={selectedTimes.includes(time)}
                      onCheckedChange={() => handleTimeChange(time)}
                      className="border-gray-300"
                    />
                    <label
                      htmlFor={`time-${time}`}
                      className="text-sm font-medium leading-none text-gray-700"
                    >
                      {time}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-5">
            <Button
              onClick={handleSave}
              className="bg-[#2c7870] hover:bg-[#236158] text-white px-4 py-2 rounded-full"
            >
              Save Preferences
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              Skip For Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
