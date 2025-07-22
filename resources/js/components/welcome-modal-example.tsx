import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WelcomeModal } from '@/components/ui/welcome-modal';

export function WelcomeModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSavePreferences = (preferences: {
    subjects: string[];
    learningTimes: string[];
  }) => {
    console.log('Saved preferences:', preferences);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsModalOpen(true)}>
        Open Welcome Modal
      </Button>

      <WelcomeModal
        userName="Abdullah"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  );
}
