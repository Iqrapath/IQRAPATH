import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
<<<<<<< HEAD
import About from './teacherComponents/about';
import { AboutEditData } from './teacherComponents/AboutEditModal';
import SubjectsSpecializations from './teacherComponents/subjects-specializations';
import SubjectSpecializationEditModal, { SubjectSpecializationData, AvailabilitySchedule } from './teacherComponents/SubjectSpecializationEditModal';
import ContactInfo from './teacherComponents/contact-info';
import ContactInfoEditModal, { ContactInfoEditData } from './teacherComponents/ContactInfoEditModal';
=======
import TeacherProfileAbout from './teacherComponents/about';
import SubjectsSpecializations from './teacherComponents/subjects-specializations';
import ContactInfo from './teacherComponents/contact-info';
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
import PerformanceStats from './teacherComponents/performance-stats';
import Documents from './teacherComponents/documents';
import AdminActions from './teacherComponents/admin-actions';
import { Button } from '@/components/ui/button';
import Header from './teacherComponents/header';
import { useToast } from '@/components/ui/use-toast';
<<<<<<< HEAD
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717

interface TeacherProfile {
  education: string;
  bio: string;
  experience: number;
  subjects: string[];
<<<<<<< HEAD
  teaching_subjects?: string[];
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  specialization: string;
  teachingStyle: string;
  currentInstitution: string;
  previousInstitutions: string;
  preferredStudentAge: string;
  preferredClassSize: string;
  preferredTeachingMethod: string;
  hourlyRate: number;
  currency: string;
  amountPerSession: number;
  isVerified: boolean;
  is_verified?: boolean;
  lastActive: string;
  location?: string;
  verification_status?: 'approved' | 'pending' | 'inactive' | 'unknown';
  wallet_balance?: number;
  total_earned?: number;
  pending_payouts?: number;
<<<<<<< HEAD
  availability_schedule?: any;
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  
  // Additional properties for subjects component
  subject?: string | string[];
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
}

interface TeacherRatings {
  overall: number;
  total: number;
  details: {
    reading: number;
    writing: number;
    speaking: number;
  };
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  status: string;
  registrationDate: string;
  profile: TeacherProfile;
  ratings: TeacherRatings;
  sessionsTaught: number;
  totalHours: number;
  role?: string;
}

interface TeacherDetailsProps {
  teacher: Teacher;
  upcomingSessions?: Array<{
    student: string;
    date: string;
    time: string;
  }>;
  documents?: {
    idVerification?: {
      uploaded: boolean;
      idType?: string;
      frontImage?: string;
      backImage?: string;
    };
    certificates?: Array<{
      id: number;
      name: string;
      image: string;
      uploaded: boolean;
    }>;
    resume?: {
      uploaded: boolean;
      file?: string;
    };
  };
}

export default function TeacherDetails({ 
  teacher, 
  upcomingSessions = [],
  documents = {
    idVerification: { uploaded: true, idType: 'NIN Card' },
    certificates: [
      { id: 1, name: 'Quran Memorization Certificate (Al-Azhar)', image: '/placeholder.jpg', uploaded: true },
      { id: 2, name: 'Ijazah in Tajweed', image: '/placeholder.jpg', uploaded: true }
    ],
    resume: { uploaded: true, file: 'CV.pdf' }
  }
}: TeacherDetailsProps) {
<<<<<<< HEAD
=======
  const [showEditBioModal, setShowEditBioModal] = useState(false);
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  const [showEditSubjectsModal, setShowEditSubjectsModal] = useState(false);
  const [showEditContactInfoModal, setShowEditContactInfoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const { toast } = useToast();
  
<<<<<<< HEAD
  // Initial contact info data
  const initialContactInfo: ContactInfoEditData = {
    name: teacher.name || '',
    email: teacher.email || '',
    phone: teacher.phone || '',
    location: teacher.location || teacher.profile?.location || '',
    subjects: teacher.profile?.subjects || teacher.profile?.teaching_subjects || [],
  };
  
  // Helper function to parse availability data
  const parseAvailabilitySchedule = (availabilityData: any): AvailabilitySchedule => {
    const defaultSchedule: AvailabilitySchedule = {
      monday: { available: false, slots: [] },
      tuesday: { available: false, slots: [] },
      wednesday: { available: false, slots: [] },
      thursday: { available: false, slots: [] },
      friday: { available: false, slots: [] },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] }
    };

    if (!availabilityData) return defaultSchedule;

    // If it's a string, try to parse it as JSON
    if (typeof availabilityData === 'string') {
      try {
        const parsed = JSON.parse(availabilityData);
        return { ...defaultSchedule, ...parsed };
      } catch {
        return defaultSchedule;
      }
    }

    // If it's already an object, merge with default schedule
    if (typeof availabilityData === 'object') {
      return { ...defaultSchedule, ...availabilityData };
    }

    return defaultSchedule;
  };

  // Initial subject specialization data
  const initialSubjectData: SubjectSpecializationData = {
    subjects: teacher.profile?.subjects || 
             (Array.isArray(teacher.profile?.teaching_subjects) ? teacher.profile?.teaching_subjects : []) || 
             (Array.isArray(teacher.profile?.subject) ? teacher.profile?.subject : []) || 
             [],
    years_experience: teacher.profile?.years_experience || 0,
    teaching_type: teacher.profile?.teaching_type || 'Online',
    teaching_mode: teacher.profile?.teaching_mode || 'Part-time',
    teaching_languages: Array.isArray(teacher.profile?.teaching_languages) 
      ? teacher.profile.teaching_languages 
      : typeof teacher.profile?.teaching_languages === 'string'
        ? teacher.profile.teaching_languages.split(',').map(lang => lang.trim())
        : [],
    availability_schedule: parseAvailabilitySchedule(teacher.profile?.availability_schedule)
  };
  
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

<<<<<<< HEAD
  const handleUpdateBio = async (data: AboutEditData) => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Use axios directly instead of Inertia router
      const response = await axios.put(`/admin/teachers/${teacher.id}`, {
        profile: {
          bio: data.bio
        }
      });
      
      toast({
        title: "Profile Updated",
        description: "Teacher biography has been updated successfully.",
        variant: "success",
      });
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      setProcessingError('Failed to update profile. Please try again.');
      toast({
        title: "Update Failed",
        description: "There was an error updating the biography. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateContactInfo = async (data: ContactInfoEditData) => {
    setIsProcessing(true);
    setProcessingError(null);
    
    // Debug the data being sent
    console.log('Submitting data:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      'profile.teaching_subjects': data.subjects
    });
    
    try {
      // Use axios directly instead of Inertia router
      const response = await axios.put(`/admin/teachers/${teacher.id}`, {
        name: data.name,
        email: data.email,
        phone_number: data.phone,
        location: data.location,
        profile: {
          teaching_subjects: data.subjects // Changed 'subjects' to 'teaching_subjects' to match the backend field
        }
      });
      
      // Debug the response
      console.log('Server response:', response.data);
      
      toast({
        title: "Teacher Information Updated",
        description: "Teacher information has been updated successfully.",
        variant: "success",
      });
      
      // Close the modal and reload the page
      setShowEditContactInfoModal(false);
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error: any) {
      setProcessingError('Failed to update teacher information. Please try again.');
      // Debug the error
      console.error('Error details:', error.response?.data || error);
      
      toast({
        title: "Update Failed",
        description: "There was an error updating the teacher information. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateSubjects = async (data: SubjectSpecializationData) => {
    setIsProcessing(true);
    setProcessingError(null);
    
    // Debug the data being sent
    console.log('Submitting subject data:', data);
    console.log('Availability schedule:', JSON.stringify(data.availability_schedule));
    
    try {
      // Use axios directly instead of Inertia router
      const response = await axios.put(`/admin/teachers/${teacher.id}`, {
        profile: {
          teaching_subjects: data.subjects, // Changed from subjects to teaching_subjects for consistency
          years_experience: data.years_experience,
          teaching_type: data.teaching_type,
          teaching_mode: data.teaching_mode,
          teaching_languages: data.teaching_languages,
          availability_schedule: data.availability_schedule
        }
      });
      
      // Debug the response
      console.log('Server response:', response.data);
      
      toast({
        title: "Subjects & Specializations Updated",
        description: "Teacher subjects and specializations have been updated successfully.",
        variant: "success",
      });
      
      // Close the modal and reload the page
      setShowEditSubjectsModal(false);
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error: any) {
      setProcessingError('Failed to update subjects and specializations. Please try again.');
      // Debug the error
      console.error('Error details:', error.response?.data || error);
      
      toast({
        title: "Update Failed",
        description: "There was an error updating the subjects and specializations. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
=======
  const handleEditBio = () => {
    setShowEditBioModal(true);
    // Here you would typically open a modal for editing the bio
    console.log('Edit bio clicked');
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  };

  const handleEditSubjects = () => {
    setShowEditSubjectsModal(true);
<<<<<<< HEAD
=======
    // Here you would typically open a modal for editing subjects
    console.log('Edit subjects clicked');
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  };

  const handleEditContactInfo = () => {
    setShowEditContactInfoModal(true);
<<<<<<< HEAD
=======
    // Here you would typically open a modal for editing contact info
    console.log('Edit contact info clicked');
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      router.post(`/admin/teachers/${teacher.id}/approve`, {}, {
        onSuccess: () => {
          toast({
            title: "Teacher Approved",
            description: `${teacher.name} has been approved successfully.`,
            variant: "success",
          });
          
          // Redirect after short delay
          setTimeout(() => {
            router.visit(`/admin/teachers`, {
              only: ['teachers'],
              preserveState: true,
            });
          }, 1500);
        },
        onError: (errors) => {
          setProcessingError('Failed to approve teacher. Please try again.');
          toast({
            title: "Approval Failed",
            description: "There was an error approving this teacher. Please try again.",
            variant: "destructive",
          });
          console.error('Route error:', errors);
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setProcessingError('Failed to approve teacher. Please try again.');
      toast({
        title: "Approval Failed",
        description: "There was an error approving this teacher. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      router.post(`/admin/teachers/${teacher.id}/message`, { message }, {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: `Your message has been sent to ${teacher.name}.`,
            variant: "success",
          });
        },
        onError: (errors) => {
          setProcessingError('Failed to send message. Please try again.');
          toast({
            title: "Message Failed",
            description: "There was an error sending your message. Please try again.",
            variant: "destructive",
          });
          console.error('Route error:', errors);
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setProcessingError('Failed to send message. Please try again.');
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!reason.trim()) return;
    
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      router.post(`/admin/teachers/${teacher.id}/reject`, { reason }, {
        onSuccess: () => {
          toast({
            title: "Teacher Rejected",
            description: `${teacher.name} has been rejected.`,
            variant: "info",
          });
          
          // Redirect after short delay
          setTimeout(() => {
            router.visit(`/admin/teachers`, {
              only: ['teachers'],
              preserveState: true,
            });
          }, 1500);
        },
        onError: (errors) => {
          setProcessingError('Failed to reject teacher. Please try again.');
          toast({
            title: "Rejection Failed",
            description: "There was an error rejecting this teacher. Please try again.",
            variant: "destructive",
          });
          console.error('Route error:', errors);
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setProcessingError('Failed to reject teacher. Please try again.');
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting this teacher. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      router.delete(`/admin/teachers/${teacher.id}`, {
        onSuccess: () => {
          toast({
            title: "Account Deleted",
            description: `${teacher.name}'s account has been permanently deleted.`,
            variant: "info",
          });
          
          // Redirect to teachers list
          setTimeout(() => {
            router.visit('/admin/teachers', {
              only: ['teachers'],
              preserveState: true,
            });
          }, 1500);
        },
        onError: (errors) => {
          setProcessingError('Failed to delete teacher account. Please try again.');
          toast({
            title: "Deletion Failed",
            description: "There was an error deleting this account. Please try again.",
            variant: "destructive",
          });
          console.error('Route error:', errors);
        },
        onFinish: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setProcessingError('Failed to delete teacher account. Please try again.');
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting this account. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head title={`Teacher Profile - ${teacher.name}`} />

      <div className="py-6 px-6">
<<<<<<< HEAD
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Teacher Management', href: '/admin/teachers' },
                { title: `Teacher Profile - ${teacher.name}` }
              ]}
            />
=======
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Teacher Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
            <Button variant="outline">
              Edit Profile
            </Button>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
          </div>
        </div>

        {processingError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {processingError}
          </div>
        )}

        {/* Profile Header */}
        <Header 
          teacher={teacher} 
<<<<<<< HEAD
          teacherProfile={teacher.profile || {}} 
=======
          teacherProfile={teacher.profile} 
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
        />

        {/* Contact Info Section */}
        <div className="mt-6 shadow-xl">
          <ContactInfo
            teacher={teacher}
<<<<<<< HEAD
            teacherProfile={teacher.profile || {}}
=======
            teacherProfile={teacher.profile}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
            totalCompletedSessions={teacher.sessionsTaught}
            onEditClick={handleEditContactInfo}
          />
        </div>

<<<<<<< HEAD
        {/* Contact Info Edit Modal */}
        <ContactInfoEditModal
          isOpen={showEditContactInfoModal}
          onClose={() => setShowEditContactInfoModal(false)}
          onSave={handleUpdateContactInfo}
          initialData={initialContactInfo}
          teacherId={teacher.id}
        />

        {/* About Section */}
        <div className="mt-6 shadow-xl">
          <About
            teacher={teacher}
            teacherProfile={teacher.profile || {}}
            onProfileUpdate={handleUpdateBio}
=======
        {/* About Section */}
        <div className="mt-6 shadow-xl">
          <TeacherProfileAbout
            teacher={teacher}
            teacherProfile={teacher.profile}
            onEditClick={handleEditBio}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
          />
        </div>

        {/* Subjects Section */}
        <div className="mt-6 shadow-xl">
          <SubjectsSpecializations
            teacher={teacher}
<<<<<<< HEAD
            teacherProfile={teacher.profile || {}}
=======
            teacherProfile={teacher.profile}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
            onEditClick={handleEditSubjects}
          />
        </div>

<<<<<<< HEAD
        {/* Subject Specialization Edit Modal */}
        <SubjectSpecializationEditModal
          isOpen={showEditSubjectsModal}
          onClose={() => setShowEditSubjectsModal(false)}
          onSave={handleUpdateSubjects}
          initialData={initialSubjectData}
          teacherId={teacher.id}
        />

=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
        {/* Documents Section */}
        <div className="mt-6 shadow-xl">
          <Documents
            idVerification={documents.idVerification}
            certificates={documents.certificates}
            resume={documents.resume}
<<<<<<< HEAD
            teacherId={teacher.id}
            refreshDocuments={() => {
              // Reload the teacher's documents
              router.reload({ only: ['documents'] });
            }}
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
          />
        </div>

        {/* Performance Stats */}
        <div className="mt-6 shadow-xl">
          <PerformanceStats
            totalSessions={teacher.sessionsTaught}
            averageRating={teacher.ratings?.overall || 4.8}
            totalReviews={teacher.ratings?.total || 95}
            upcomingSessions={upcomingSessions}
          />
        </div>

        {/* Admin Actions */}
        <div className="mt-8">
          <AdminActions
            onApprove={handleApprove}
            onSendMessage={handleSendMessage}
            onReject={handleReject}
            onDelete={handleDelete}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </AdminLayout>
  );
} 