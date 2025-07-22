import { useState, useEffect } from 'react';
import { WelcomeModal } from '@/components/ui/welcome-modal';
import { PreferencesSuccessModal } from '@/components/ui/preferences-success-modal';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { router } from '@inertiajs/react';

interface StudentOnboardingProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
  hasLearningPreferences?: boolean;
}

export function StudentOnboarding({ user, hasLearningPreferences = false }: StudentOnboardingProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  // Check if we should show the welcome modal on component mount
  useEffect(() => {
    // Check if onboarding has been shown before for this user
    const onboardingShownKey = `student-onboarding-shown-${user.id}`;
    const onboardingShown = localStorage.getItem(onboardingShownKey);
    
    if (user.role === 'student' && !hasLearningPreferences && !onboardingShown) {
      setShowWelcomeModal(true);
      // Mark onboarding as shown
      // localStorage.setItem(onboardingShownKey, 'true');
    }
  }, [user.role, user.id, hasLearningPreferences]);

  const handleSavePreferences = async (preferences: {
    subjects: string[];
    learningTimes: string[];
  }) => {
    try {
      // Save the preferences to the backend using web route
      await axios.post('/learning-preferences', {
        preferred_subjects: preferences.subjects,
        teaching_mode: 'part-time', // Default teaching mode
        preferred_learning_times: preferences.learningTimes.map(time => ({
          time_of_day: time,
          isSelected: true
        }))
      });

      // Show success message
      toast({
        title: "Preferences Saved",
        description: "Your learning preferences have been saved successfully.",
        variant: "success",
      });

      // Show the success modal
      setShowWelcomeModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBrowseTeachers = () => {
    setShowSuccessModal(false);
    router.visit('/browse-teachers');
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.visit('/student/dashboard');
  };

  return (
    <>
      <WelcomeModal
        userName={user.name}
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onSavePreferences={handleSavePreferences}
      />

      <PreferencesSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onBrowseTeachers={handleBrowseTeachers}
        onGoToDashboard={handleGoToDashboard}
      />
    </>
  );
}
