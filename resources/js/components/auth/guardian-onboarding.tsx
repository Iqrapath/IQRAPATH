import { useState, useEffect } from 'react';
import { ChildRegistrationModal } from '@/components/ui/child-registration-modal';
import { ChildRegistrationSuccessModal } from '@/components/ui/child-registration-success-modal';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { router } from '@inertiajs/react';

interface ChildData {
  // User table fields
  fullName: string;  // Maps to 'name' field in the users table
  email: string;
  password: string;
  confirmPassword: string;

  // Student profile fields
  age: string;
  gender: string;
  dateOfBirth: string;
  educationLevel: string;
  schoolName: string;
  gradeLevel: string;
}

interface RegisteredChild {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface GuardianOnboardingProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
  hasRegisteredChildren?: boolean;
}

export function GuardianOnboarding({ user, hasRegisteredChildren = false }: GuardianOnboardingProps) {
  const [showChildRegistrationModal, setShowChildRegistrationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredChildren, setRegisteredChildren] = useState<RegisteredChild[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check if we should show the child registration modal on component mount
  useEffect(() => {
    // Check if onboarding has been shown before for this user
    const onboardingShownKey = `guardian-onboarding-shown-${user.id}`;
    const onboardingShown = localStorage.getItem(onboardingShownKey);
    
    if (user.role === 'guardian' && !hasRegisteredChildren && !onboardingShown) {
      setShowChildRegistrationModal(true);
      // Mark onboarding as shown
      localStorage.setItem(onboardingShownKey, 'true');
    }
  }, [user.role, user.id, hasRegisteredChildren]);

  const handleSaveChildData = async (childrenData: ChildData[]) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Save the children data to the backend
      const response = await axios.post('/register-children', {
        children: childrenData
      });

      setRegisteredChildren(response.data.children || []);

      // Show success message
      toast({
        title: "Children Registered",
        description: `Successfully registered ${childrenData.length} ${childrenData.length === 1 ? 'child' : 'children'}.`,
        variant: "success",
      });

      // Show the success modal
      setShowChildRegistrationModal(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error registering children:', error);

      // Extract error message
      let errorMessage = "There was a problem registering your children. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowseTeachers = () => {
    setShowSuccessModal(false);
    router.visit('/browse-teachers');
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.visit('/guardian/dashboard');
  };

  return (
    <>
      <ChildRegistrationModal
        open={showChildRegistrationModal}
        onOpenChange={setShowChildRegistrationModal}
        onSave={handleSaveChildData}
      />

      <ChildRegistrationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onGoToDashboard={handleGoToDashboard}
        onSetupTeachers={handleBrowseTeachers}
        children={registeredChildren}
      />
    </>
  );
}
