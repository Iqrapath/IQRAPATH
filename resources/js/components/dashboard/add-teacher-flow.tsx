import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserFormModal, UserFormData } from '@/components/ui/user-form-modal';
import { TeacherProfileModal, TeacherProfileData } from '@/components/ui/teacher-profile-modal';
import { DocumentUploadModal, DocumentUploadData } from '@/components/ui/document-upload-modal';
import { AvailabilityScheduleModal, AvailabilityScheduleData } from '@/components/ui/availability-schedule-modal';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface AddTeacherFlowProps {
  onTeacherAdded?: (data: {
    user: UserFormData;
    profile: TeacherProfileData;
    documents: DocumentUploadData;
    availability: AvailabilityScheduleData;
  }) => void;
  buttonVariant?: 'primary' | 'icon' | 'link';
  buttonText?: string;
  buttonClassName?: string;
}

export function AddTeacherFlow({
  onTeacherAdded,
  buttonVariant = 'icon',
  buttonText = 'Add Teacher',
  buttonClassName = 'rounded-full bg-[#2c7870] hover:bg-[#236158] text-white h-8 w-8'
}: AddTeacherFlowProps) {
  // Step tracking
  const [currentStep, setCurrentStep] = useState<'closed' | 'user' | 'profile' | 'documents' | 'availability'>('closed');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data storage
  const [userData, setUserData] = useState<UserFormData>({
    name: '',
    phone_number: '',
    email: '',
    location: '',
    role: 'teacher',
    status: 'pending',
    registration_date: new Date(),
  });

  const [profileData, setProfileData] = useState<TeacherProfileData>({
    bio: '',
    years_of_experience: 0,
    teaching_subjects: [],
    specialization: '',
    teaching_type: 'online',
    teaching_mode: 'full-time',
    teaching_languages: ['English'],
  });

  const [documentsData, setDocumentsData] = useState<DocumentUploadData>({
    id_front: { file: null, preview: null, uploaded: false },
    id_back: { file: null, preview: null, uploaded: false },
    certificate: { file: null, preview: null, uploaded: false },
    resume: { file: null, preview: null, uploaded: false },
    id_type: "National ID",
    certificate_name: "",
    certificate_institution: "",
    issue_date: null,
    expiry_date: null
  });

  const [availabilityData, setAvailabilityData] = useState<AvailabilityScheduleData>({
    availabilitySchedule: [
      { day: 'Monday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Tuesday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Wednesday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Thursday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Friday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Saturday', fromTime: '', toTime: '', isSelected: false },
      { day: 'Sunday', fromTime: '', toTime: '', isSelected: false },
    ],
  });

  // Step handlers
  const startFlow = () => {
    // Reset form data when starting a new flow
    resetFormData();
    setCurrentStep('user');
  };

  const handleUserFormSubmit = (data: UserFormData) => {
    setUserData(data);
    setCurrentStep('profile');
  };

  const handleProfileSubmit = (data: TeacherProfileData) => {
    setProfileData(data);
    setCurrentStep('documents');
  };

  const handleDocumentsSubmit = (data: DocumentUploadData) => {
    setDocumentsData(data);
    setCurrentStep('availability');
  };
  
  // Back button handlers
  const handleBackToUser = () => {
    setCurrentStep('user');
  };

  const handleBackToProfile = () => {
    setCurrentStep('profile');
  };

  const handleBackToDocuments = () => {
    setCurrentStep('documents');
  };

  const handleAvailabilitySubmit = async (data: AvailabilityScheduleData) => {
    setAvailabilityData(data);
    setIsSubmitting(true);

    // Prepare form data for file uploads
    const formData = new FormData();
    
    // Add user data
    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'registration_date' && value) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    
    // Add profile data
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === 'teaching_subjects') {
        // For subjects, ensure we're sending a properly formatted array
        const cleanedSubjects = Array.isArray(value) 
          ? value.filter((subject: string) => subject && subject.trim() !== '')
          : [];
        
        // Log the subjects for debugging
        console.log('Teaching subjects before sending:', cleanedSubjects);
        
        // Stringify the array to ensure it's sent as JSON
        formData.append(key, JSON.stringify(cleanedSubjects));
      } else if (key === 'teaching_languages') {
        // For languages, ensure we're sending a properly formatted array
        const cleanedLanguages = Array.isArray(value) 
          ? value.filter((language: string) => language && language.trim() !== '')
          : [];
        formData.append(key, JSON.stringify(cleanedLanguages));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    
    // Add document metadata
    formData.append('id_type', documentsData.id_type);
    formData.append('certificate_name', documentsData.certificate_name);
    formData.append('certificate_institution', documentsData.certificate_institution);
    if (documentsData.issue_date) {
      formData.append('issue_date', documentsData.issue_date.toISOString());
    }
    if (documentsData.expiry_date) {
      formData.append('expiry_date', documentsData.expiry_date.toISOString());
    }
    
    // Add document files
    if (documentsData.id_front.file) {
      formData.append('id_front', documentsData.id_front.file);
    }
    if (documentsData.id_back.file) {
      formData.append('id_back', documentsData.id_back.file);
    }
    if (documentsData.certificate.file) {
      formData.append('certificate', documentsData.certificate.file);
    }
    if (documentsData.resume.file) {
      formData.append('resume', documentsData.resume.file);
    }
    
    // Add availability data
    formData.append('availability_schedule', JSON.stringify(data.availabilitySchedule));

    try {
      // Save data to database using Laravel's web route
      const response = await axios.post('/teachers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the response data
      console.log('Teacher creation response:', response.data);
      console.log('Teacher subjects:', response.data.teacher.teaching_subjects);

      // Reset form data first
      resetFormData();

      // Close the modal
      setCurrentStep('closed');

      // Show success toast
      toast({
        title: "Teacher Added Successfully",
        description: `${userData.name} has been added as a new teacher.`,
        variant: "success",
      });

      // Notify parent component
      if (onTeacherAdded) {
        // Pass the formatted teacher data from the server response
        onTeacherAdded({
          user: response.data.teacher,
          profile: {
            ...profileData,
            teaching_subjects: response.data.teacher.teaching_subjects || []
          },
          documents: documentsData,
          availability: data,
        });
      }

      // Refresh the page data to show the new teacher
      // Using a slight delay to ensure state updates are complete
      setTimeout(() => {
        router.reload();
      }, 100);

    } catch (error) {
      console.error('Error saving teacher data:', error);

      // Extract specific error information
      let errorMessage = "There was a problem adding the teacher. Please try again.";

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
        title: "Error Adding Teacher",
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
      role: 'teacher',
      status: 'pending',
      registration_date: new Date(),
    });

    setProfileData({
      bio: '',
      years_of_experience: 0,
      teaching_subjects: [],
      specialization: '',
      teaching_type: 'online',
      teaching_mode: 'full-time',
      teaching_languages: ['English'],
    });

    setDocumentsData({
      id_front: { file: null, preview: null, uploaded: false },
      id_back: { file: null, preview: null, uploaded: false },
      certificate: { file: null, preview: null, uploaded: false },
      resume: { file: null, preview: null, uploaded: false },
      id_type: "National ID",
      certificate_name: "",
      certificate_institution: "",
      issue_date: null,
      expiry_date: null
    });

    setAvailabilityData({
      availabilitySchedule: [
        { day: 'Monday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Tuesday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Wednesday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Thursday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Friday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Saturday', fromTime: '', toTime: '', isSelected: false },
        { day: 'Sunday', fromTime: '', toTime: '', isSelected: false },
      ],
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
        title="Add New Teacher"
        submitLabel="Save and Continue"
      />

      {/* Step 2: Teacher Profile */}
      <TeacherProfileModal
        isOpen={currentStep === 'profile'}
        onClose={handleClose}
        onSubmit={handleProfileSubmit}
        initialData={profileData}
        title="Teacher Profile"
        submitLabel="Save and Continue"
        onBack={handleBackToUser}
        showBackButton={true}
      />

      {/* Step 3: Document Upload */}
      <DocumentUploadModal
        isOpen={currentStep === 'documents'}
        onClose={handleClose}
        onSubmit={handleDocumentsSubmit}
        initialData={documentsData}
        title="Document Verification"
        submitLabel="Save and Continue"
        isSubmitting={isSubmitting}
        onBack={handleBackToProfile}
        showBackButton={true}
      />

      {/* Step 4: Availability Schedule */}
      <AvailabilityScheduleModal
        isOpen={currentStep === 'availability'}
        onClose={handleClose}
        onSubmit={handleAvailabilitySubmit}
        initialData={availabilityData}
        title="Teaching Availability"
        submitLabel="Complete Registration"
        onBack={handleBackToDocuments}
        showBackButton={true}
      />
    </>
  );
} 