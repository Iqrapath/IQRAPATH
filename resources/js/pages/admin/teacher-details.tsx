import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import About from './teacherComponents/about';
import { AboutEditData } from './teacherComponents/AboutEditModal';
import SubjectsSpecializations from './teacherComponents/subjects-specializations';
import SubjectSpecializationEditModal, { SubjectSpecializationData, AvailabilitySchedule } from './teacherComponents/SubjectSpecializationEditModal';
import ContactInfo from './teacherComponents/contact-info';
import ContactInfoEditModal, { ContactInfoEditData } from './teacherComponents/ContactInfoEditModal';
import PerformanceStats from './teacherComponents/performance-stats';
import Documents from './teacherComponents/documents';
import AdminActions from './teacherComponents/admin-actions';
import { Button } from '@/components/ui/button';
import Header from './teacherComponents/header';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface TeacherProfile {
  education: string;
  bio: string;
  experience: number;
  subjects: string[];
  teaching_subjects?: string[];
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
  availability_schedule?: any;

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
  const [showEditBioModal, setShowEditBioModal] = useState(false);
  const [showEditSubjectsModal, setShowEditSubjectsModal] = useState(false);
  const [showEditContactInfoModal, setShowEditContactInfoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const { toast } = useToast();

  const initialContactInfo: ContactInfoEditData = {
    name: teacher.name || '',
    email: teacher.email || '',
    phone: teacher.phone || '',
    location: teacher.location || teacher.profile?.location || '',
    subjects: teacher.profile?.subjects || teacher.profile?.teaching_subjects || [],
  };

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

    if (typeof availabilityData === 'string') {
      try {
        const parsed = JSON.parse(availabilityData);
        return { ...defaultSchedule, ...parsed };
      } catch {
        return defaultSchedule;
      }
    }

    if (typeof availabilityData === 'object') {
      return { ...defaultSchedule, ...availabilityData };
    }

    return defaultSchedule;
  };

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditBio = () => {
    setShowEditBioModal(true);
  };

  const handleEditSubjects = () => {
    setShowEditSubjectsModal(true);
  };

  const handleEditContactInfo = () => {
    setShowEditContactInfoModal(true);
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

  return (
    <AdminLayout>
      <Head title={`Teacher Profile - ${teacher.name}`} />

      <div className="py-6 px-6">
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Teacher Management', href: '/admin/teachers' },
                { title: `Teacher Profile - ${teacher.name}` }
              ]}
            />
          </div>
        </div>

        {processingError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {processingError}
          </div>
        )}

        <Header 
          teacher={teacher} 
          teacherProfile={teacher.profile || {}} 
        />

        <div className="mt-6 shadow-xl">
          <ContactInfo
            teacher={teacher}
            teacherProfile={teacher.profile || {}}
            totalCompletedSessions={teacher.sessionsTaught}
            onEditClick={handleEditContactInfo}
          />
        </div>

        <ContactInfoEditModal
          isOpen={showEditContactInfoModal}
          onClose={() => setShowEditContactInfoModal(false)}
          onSave={() => {}}
          initialData={initialContactInfo}
          teacherId={teacher.id}
        />

        <div className="mt-6 shadow-xl">
          <About
            teacher={teacher}
            teacherProfile={teacher.profile || {}}
            onProfileUpdate={() => {}}
          />
        </div>

        <div className="mt-6 shadow-xl">
          <SubjectsSpecializations
            teacher={teacher}
            teacherProfile={teacher.profile || {}}
            onEditClick={handleEditSubjects}
          />
        </div>

        <SubjectSpecializationEditModal
          isOpen={showEditSubjectsModal}
          onClose={() => setShowEditSubjectsModal(false)}
          onSave={() => {}}
          initialData={initialSubjectData}
          teacherId={teacher.id}
        />

        <div className="mt-6 shadow-xl">
          <Documents
            idVerification={documents.idVerification}
            certificates={documents.certificates}
            resume={documents.resume}
            teacherId={teacher.id}
            refreshDocuments={() => {
              router.reload({ only: ['documents'] });
            }}
          />
        </div>

        <div className="mt-6 shadow-xl">
          <PerformanceStats
            totalSessions={teacher.sessionsTaught}
            averageRating={teacher.ratings?.overall || 4.8}
            totalReviews={teacher.ratings?.total || 95}
            upcomingSessions={upcomingSessions}
          />
        </div>

        <div className="mt-8">
          <AdminActions
            onApprove={handleApprove}
            onSendMessage={() => {}}
            onReject={() => {}}
            onDelete={() => {}}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </AdminLayout>
  );
}