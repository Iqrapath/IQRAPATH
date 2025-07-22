import { Button } from '@/components/ui/button';

interface PreferencesSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseTeachers: () => void;
  onGoToDashboard: () => void;
}

export function PreferencesSuccessModal({
  isOpen,
  onClose,
  onBrowseTeachers,
  onGoToDashboard,
}: PreferencesSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-8 relative">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Preferences saved successfully! Let's find the best Quran teachers for you.
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={onBrowseTeachers}
            className="bg-[#2c7870] hover:bg-[#236158] text-white px-6 rounded-full"
          >
            Browse Teachers
          </Button>
          <Button
            onClick={onGoToDashboard}
            variant="ghost"
            className="text-[#2c7870] hover:text-[#236158] hover:bg-transparent"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}