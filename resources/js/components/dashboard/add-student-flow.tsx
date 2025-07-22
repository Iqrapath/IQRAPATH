import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserFormModal, UserFormData } from '@/components/ui/user-form-modal';
import { LearningPreferencesModal, LearningPreferencesData } from '@/components/ui/learning-preferences-modal';
import { SubscriptionModal, SubscriptionData } from '@/components/ui/subscription-modal';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface AddStudentFlowProps {
  onStudentAdded?: (data: {
    user: UserFormData;
    preferences: LearningPreferencesData;
    subscription: SubscriptionData;
  }) => void;
  buttonVariant?: 'primary' | 'icon' | 'link';
  buttonText?: string;
  buttonClassName?: string;
}

export function AddStudentFlow({
  onStudentAdded,
  buttonVariant = 'icon',
  buttonText = 'Add Student',
  buttonClassName = 'rounded-full bg-[#2c7870] hover:bg-[#236158] text-white h-8 w-8'
}: AddStudentFlowProps) {
  // Step tracking
  const [currentStep, setCurrentStep] = useState<'closed' | 'user' | 'preferences' | 'subscription'>('closed');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data storage
  const [userData, setUserData] = useState<UserFormData>({
    name: '',
    phone_number: '',
    email: '',
    location: '',
    role: 'student',
    status: 'active',
    registration_date: new Date(),
  });

  const [preferencesData, setPreferencesData] = useState<LearningPreferencesData>({
    preferredSubjects: [],
    teachingMode: 'full-time',
    studentAgeGroup: '7-9 Years',
    preferredLearningTimes: [
      { day: 'Monday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Tuesday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Wednesday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Thursday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Friday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Saturday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Sunday', fromTime: '', toTime: '', isSelected: false },
    ],
    additionalNotes: '',
  });

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    activePlan: "Juz' Amma - ₦10,000/month",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: 'active',
    additionalNotes: '',
  });

  // Step handlers
  const startFlow = () => {
    // Reset form data when starting a new flow
    resetFormData();
    setCurrentStep('user');
  };

  const handleUserFormSubmit = (data: UserFormData) => {
    setUserData(data);
    setCurrentStep('preferences');
  };

  const handlePreferencesSubmit = (data: LearningPreferencesData) => {
    setPreferencesData(data);
    setCurrentStep('subscription');
  };

  const handleSubscriptionSubmit = async (data: SubscriptionData) => {
    setSubscriptionData(data);
    setIsSubmitting(true);

    // Combine all data
    const completeData = {
      user: userData,
      preferences: preferencesData,
      subscription: data,
    };

    try {
      // Save data to database using Laravel's web route
      const response = await axios.post('/students', completeData);

      // Reset form data first
      resetFormData();

      // Close the modal
      setCurrentStep('closed');

      // Show success toast
      toast({
        title: "Student Added Successfully",
        description: `${userData.name} has been added as a new student.`,
        variant: "success",
      });

      // Notify parent component
      if (onStudentAdded) {
        onStudentAdded(completeData);
      }

      // Refresh the page data to show the new student
      // Using a slight delay to ensure state updates are complete
      setTimeout(() => {
        router.reload();
      }, 100);

    } catch (error) {
      console.error('Error saving student data:', error);

      // Extract specific error information
      let errorMessage = "There was a problem adding the student. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }

          // If there are validation errors, show them in detail
          if (error.response.data && error.response.data.errors) {
            const validationErrors = error.response.data.errors;
            const errorFields = Object.keys(validationErrors);

            if (errorFields.length > 0) {
              errorMessage = `Validation errors: ${errorFields.join(', ')}`;

              // Show the first validation error message
              const firstErrorField = errorFields[0];
              const firstError = validationErrors[firstErrorField][0];
              if (firstError) {
                errorMessage = firstError;
              }
            }
          }

          // If it's a 404, the API route might not exist
          if (error.response.status === 404) {
            errorMessage = "Endpoint not found. Please check the server configuration.";
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response from server. Please check your connection.";
        }
      }

      // Show error toast with specific message
      toast({
        title: "Error Adding Student",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing the modal
    resetFormData();
    setCurrentStep('closed');
  };

  const resetFormData = () => {
    setUserData({
      name: '',
      phone_number: '',
      email: '',
      location: '',
      role: 'student',
      status: 'active',
      registration_date: new Date(),
    });

    setPreferencesData({
      preferredSubjects: [],
      teachingMode: 'full-time',
      studentAgeGroup: '7-9 Years',
      preferredLearningTimes: [
        { day: 'Monday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Tuesday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Wednesday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Thursday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Friday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Saturday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Sunday', fromTime: '', toTime: '', isSelected: false },
      ],
      additionalNotes: '',
    });

    setSubscriptionData({
      activePlan: "Juz' Amma - ₦10,000/month",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      status: 'active',
      additionalNotes: '',
    });
  };

  // Render appropriate button based on variant
  const renderButton = () => {
    switch (buttonVariant) {
      case 'icon':
        return (
          <Button
            size="icon"
            variant="ghost"
            className={buttonClassName}
            onClick={startFlow}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">{buttonText}</span>
          </Button>
        );
      case 'link':
        return (
          <Button
            variant="link"
            className={buttonClassName}
            onClick={startFlow}
          >
            {buttonText}
          </Button>
        );
      default:
        return (
          <Button
            className={`bg-[#2c7870] hover:bg-[#236158] text-white ${buttonClassName}`}
            onClick={startFlow}
          >
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        );
    }
  };

  return (
    <>
      {renderButton()}

      {/* Step 1: User Form */}
      <UserFormModal
        isOpen={currentStep === 'user'}
        onClose={handleClose}
        onSubmit={handleUserFormSubmit}
        initialData={userData}
        title="Add New Student"
        submitLabel="Save and Continue"
      />

      {/* Step 2: Learning Preferences */}
      <LearningPreferencesModal
        isOpen={currentStep === 'preferences'}
        onClose={handleClose}
        onSubmit={handlePreferencesSubmit}
        initialData={preferencesData}
      />

      {/* Step 3: Subscription */}
      <SubscriptionModal
        isOpen={currentStep === 'subscription'}
        onClose={handleClose}
        onSubmit={handleSubscriptionSubmit}
        initialData={subscriptionData}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
