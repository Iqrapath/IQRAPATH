import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Calendar, XCircle, Download, MessageSquare, Video, Copy } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Header from './verificationRequestsComponent/header';
import About from './verificationRequestsComponent/about';
import DocumentsReview from './verificationRequestsComponent/documentsReview';
import DocumentViewer from './verificationRequestsComponent/documentViewer';
import Documents from './teacherComponents/documents';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatAvatarUrl } from '@/lib/helpers';
import axios from 'axios';

interface DocumentType {
  id: number;
  document_type: string;
  file_path: string;
  verification_status: string;
}

interface TeacherProfileType {
  is_verified?: boolean;
  wallet_balance?: number;
  total_earned?: number;
  pending_payouts?: number;
  bio?: string;
  years_of_experience?: number;
  teaching_subjects?: string[];
  specialization?: string;
}

interface TeacherType {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  location?: string;
  status?: string;
  subject: string;  // This is populated from teaching_subjects in the backend
  education: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  phone: string;
}

interface VerificationRequest {
  id: number;
  teacher_id: number;
  status: 'pending' | 'verified' | 'rejected' | 'live_video';
  video_status: 'not_scheduled' | 'scheduled' | 'completed' | 'missed';
  scheduled_date: string | null;
  meeting_link?: string | null;
  video_platform?: string | null;
  created_at: string;
  teacher: TeacherType;
  teacherProfile: TeacherProfileType;
  documents: DocumentType[];
}

interface Props {
  request: VerificationRequest;
  flash?: { success?: string; error?: string };
}

const VerificationDetailsPage: React.FC<Props> = ({ request, flash }) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Document verification state
  const [verifyingDocId, setVerifyingDocId] = useState<number | null>(null);
  
  // Document viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  
  // Parse existing scheduled date and time if available
  const getInitialScheduleDate = () => {
    if (request.scheduled_date) {
      return request.scheduled_date.split('T')[0];
    }
    return '';
  };
  
  const getInitialScheduleTime = () => {
    if (request.scheduled_date) {
      return request.scheduled_date.split('T')[1].substring(0, 5);
    }
    return '';
  };
  
  // Schedule call dialog state with initial values from existing schedule
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(getInitialScheduleDate());
  const [scheduleTime, setScheduleTime] = useState(getInitialScheduleTime());
  const [videoPlatform, setVideoPlatform] = useState(request.video_platform || 'Google Meet');
  const [meetingLink, setMeetingLink] = useState(request.meeting_link || '');
  const [meetingNotes, setMeetingNotes] = useState('');
  
  const { toast } = useToast();
  
  // Reset form fields when the request data changes
  useEffect(() => {
    setScheduleDate(getInitialScheduleDate());
    setScheduleTime(getInitialScheduleTime());
    setVideoPlatform(request.video_platform || 'Google Meet');
    setMeetingLink(request.meeting_link || '');
  }, [request]);
  
  // Show flash messages
  React.useEffect(() => {
    if (flash?.success) {
      toast({
        title: "Success",
        description: flash.success,
        variant: "success",
      });
    }
    if (flash?.error) {
      toast({
        title: "Error",
        description: flash.error,
        variant: "destructive",
      });
    }
  }, [flash]);

  const handleRejectRequest = () => {
    setRejectDialogOpen(true);
  };

  const scheduleCall = () => {
    setScheduleDialogOpen(true);
  };
  
  const submitScheduleCall = () => {
    if (!scheduleDate || !scheduleTime || !videoPlatform || !meetingLink) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const scheduledDateTime = `${scheduleDate}T${scheduleTime}`;
    
    router.post(route('admin.verification-requests.schedule', { id: request.id }), {
      scheduled_date: scheduledDateTime,
      video_platform: videoPlatform,
      meeting_link: meetingLink,
      meeting_notes: meetingNotes
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: 'Video call scheduled successfully',
          variant: "success",
        });
        setScheduleDialogOpen(false);
        router.reload();
      },
      onError: (errors) => {
        console.error('Error scheduling video call:', errors);
        toast({
          title: "Error",
          description: 'Failed to schedule video call',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const generateMeetingLink = () => {
    if (videoPlatform === 'Google Meet') {
      // Generate a random Google Meet link
      const meetCode = Math.random().toString(36).substring(2, 7) + '-' +
                       Math.random().toString(36).substring(2, 7) + '-' +
                       Math.random().toString(36).substring(2, 7);
      setMeetingLink(`https://meet.google.com/${meetCode}`);
    } else if (videoPlatform === 'Zoom') {
      // Generate a random Zoom link
      const meetingId = Math.floor(Math.random() * 1000000000) + 1000000000;
      setMeetingLink(`https://zoom.us/j/${meetingId}`);
    } else if (videoPlatform === 'Microsoft Teams') {
      // Generate a random Teams link
      const meetingId = Math.random().toString(36).substring(2, 15);
      setMeetingLink(`https://teams.microsoft.com/l/meetup-join/${meetingId}`);
    }
  };

  const submitRejection = () => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.reject', { id: request.id }), {
      rejection_reason: rejectionReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: 'Verification request rejected',
          variant: "success",
        });
        setRejectDialogOpen(false);
        setRejectionReason('');
        router.visit(route('admin.verification-requests'));
      },
      onError: (errors) => {
        console.error('Error rejecting verification:', errors);
        toast({
          title: "Error",
          description: 'Failed to reject verification',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const setLiveVideo = () => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.live-video', { id: request.id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: 'Verification request set to live video status',
          variant: "success",
        });
        router.visit(route('admin.verification-requests'));
      },
      onError: (errors) => {
        console.error('Error setting live video status:', errors);
        toast({
          title: "Error",
          description: 'Failed to set live video status',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const submitVerification = () => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.verify', { id: request.id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Success",
          description: 'Verification approved successfully',
          variant: "success",
        });
        router.visit(route('admin.verification-requests'));
      },
      onError: (errors) => {
        console.error('Error approving verification:', errors);
        toast({
          title: "Error",
          description: 'Failed to approve verification',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'live_video':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Live Video</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
    }
  };

  // Function to open document viewer
  const handleViewDocument = (documentId: number) => {
    const document = request.documents.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setViewerOpen(true);
    }
  };

  // Function to handle document verification
  const handleVerifyDocument = async (documentId: number) => {
    if (!request.teacher_id) {
      toast({
        title: "Verification Error",
        description: "Teacher ID is required for verification",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifyingDocId(documentId);
      
      toast({
        title: "Verifying",
        description: `Document: ${documentId}`,
        variant: "info"
      });
      
      await axios.post(`/admin/teachers/${request.teacher_id}/documents/${documentId}/verify`, {
        verification_status: 'verified',
        verification_notes: 'Verified by admin'
      });
      
      toast({
        title: "Verification Success",
        description: "Document has been verified",
        variant: "success"
      });
      
      // Refresh the page to get updated data
      router.reload();
    } catch (error) {
      console.error('Document verification error:', error);
      toast({
        title: "Verification Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifyingDocId(null);
    }
  };

  // Function to handle document rejection
  const handleRejectDocument = async (documentId: number) => {
    if (!request.teacher_id) {
      toast({
        title: "Rejection Error",
        description: "Teacher ID is required for rejection",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifyingDocId(documentId);
      
      toast({
        title: "Rejecting",
        description: `Document: ${documentId}`,
        variant: "info"
      });
      
      await axios.post(`/admin/teachers/${request.teacher_id}/documents/${documentId}/verify`, {
        verification_status: 'rejected',
        verification_notes: 'Rejected by admin'
      });
      
      toast({
        title: "Rejection Success",
        description: "Document has been rejected",
        variant: "success"
      });
      
      // Refresh the page to get updated data
      router.reload();
    } catch (error) {
      console.error('Document rejection error:', error);
      toast({
        title: "Rejection Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifyingDocId(null);
    }
  };

  return (
    <AdminLayout>
      <Head title={`Verification Details - ${request.teacher.name}`} />
      
      <div className="py-6 px-6 bg-slate-50 min-h-screen">
                <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Verification Requests', href: '/admin/verification-requests' },
                { title: request.teacher.name }
              ]}
            />
          </div>
        </div>
        
        {/* Teacher Profile Header */}
        <Header 
          teacher={{
            id: request.teacher.id,
            name: request.teacher.name,
            avatar: request.teacher.avatar ? request.teacher.avatar : undefined,
            role: 'teacher',
            location: request.teacher.location,
            status: request.status // 'pending', 'verified', 'rejected'
          }}
          teacherProfile={request.teacherProfile}
        />
        
        {/* About Component */}
        <div className="mb-6">
          <About 
            teacher={{
              name: request.teacher.name,
              email: request.teacher.email,
              phone_number: request.teacher.phone,
              subject: request.teacher.subject,
              location: request.teacher.location,
              hourly_rate: request.teacher.hourly_rate
            }}
            teacherProfile={request.teacherProfile}
            submittedDate={formatDate(request.created_at)}
            videoStatus={request.video_status}
            status={request.status}
            meetingLink={request.meeting_link}
            videoPlatform={request.video_platform}
            onScheduleCall={scheduleCall}
          />
        </div>
        
        {/* Documents Review Panel */}
        <div className="mb-6">
          <DocumentsReview 
            documents={request.documents}
            onVerifyDocument={handleVerifyDocument}
            onRejectDocument={handleRejectDocument}
            onViewDocument={handleViewDocument}
          />
        </div>
        
        {/* Document Viewer Dialog */}
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          document={selectedDocument}
          onVerify={handleVerifyDocument}
          onReject={handleRejectDocument}
        />
        
        {/* Document Section - Using the imported Documents component */}
        <Documents 
          idVerification={{
            uploaded: request.documents.some(doc => doc.document_type === 'id_front' || doc.document_type === 'id_back'),
            idType: "National ID",
            frontImage: request.documents.find(doc => doc.document_type === 'id_front')?.file_path,
            frontUrl: request.documents.find(doc => doc.document_type === 'id_front')?.file_path,
            frontVerificationStatus: request.documents.find(doc => doc.document_type === 'id_front')?.verification_status,
            frontId: request.documents.find(doc => doc.document_type === 'id_front')?.id,
            backImage: request.documents.find(doc => doc.document_type === 'id_back')?.file_path,
            backUrl: request.documents.find(doc => doc.document_type === 'id_back')?.file_path,
            backVerificationStatus: request.documents.find(doc => doc.document_type === 'id_back')?.verification_status,
            backId: request.documents.find(doc => doc.document_type === 'id_back')?.id,
          }}
          certificates={request.documents
            .filter(doc => doc.document_type === 'certificate')
            .map(doc => ({
              id: doc.id,
              name: 'Teaching Certificate',
              image: doc.file_path,
              url: doc.file_path,
              verification_status: doc.verification_status,
              uploaded: true,
              institution: 'Institution'
            }))}
          resume={{
            uploaded: request.documents.some(doc => doc.document_type === 'resume'),
            file: request.documents.find(doc => doc.document_type === 'resume')?.file_path,
            url: request.documents.find(doc => doc.document_type === 'resume')?.file_path,
            verification_status: request.documents.find(doc => doc.document_type === 'resume')?.verification_status,
            id: request.documents.find(doc => doc.document_type === 'resume')?.id,
          }}
          teacherId={request.teacher_id}
          refreshDocuments={() => router.reload()}
          isAdmin={true}
        />
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRejectRequest}
          >
            <XCircle className="h-4 w-4" /> Reject
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-teal-600 border-teal-600 hover:bg-teal-50"
            onClick={scheduleCall}
          >
            <Calendar className="h-4 w-4" /> Schedule Verification Call
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <MessageSquare className="h-4 w-4" /> Send Message
          </Button>
          
          {request.meeting_link && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => {
                navigator.clipboard.writeText(request.meeting_link || '');
                toast({
                  title: "Success",
                  description: 'Meeting link copied to clipboard',
                  variant: "success",
                });
              }}
            >
              <Copy className="h-4 w-4" /> Copy Meeting Link
            </Button>
          )}
          
          {request.status === 'pending' && request.video_status === 'completed' && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={setLiveVideo}
            >
              <Video className="h-4 w-4" /> Set Live Video
            </Button>
          )}
          
          <Button 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
            onClick={submitVerification}
          >
            <CheckCircle className="h-4 w-4" /> Verify Verification
          </Button>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejecting this verification request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={submitRejection}
              disabled={!rejectionReason.trim() || isLoading}
            >
              {isLoading ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Call Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Verification Call</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-date">Select Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-time">Select Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="video-platform">Choose Video Platform</Label>
              <Select value={videoPlatform} onValueChange={(value) => {
                setVideoPlatform(value);
                // Clear the meeting link when platform changes
                setMeetingLink('');
              }}>
                <SelectTrigger id="video-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generateMeetingLink}
                  className="text-sm"
                >
                  Generate Link
                </Button>
              </div>
              <Input
                id="meeting-link"
                placeholder={`https://${videoPlatform.toLowerCase().replace(' ', '')}.com/...`}
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              {videoPlatform && (
                <p className="text-xs text-muted-foreground">
                  Meeting Link: Create a new meeting link in {videoPlatform} and paste it here
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="meeting-notes">Notes/Instructions (optional)</Label>
              <Textarea
                id="meeting-notes"
                placeholder="Write any note to the teacher here..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitScheduleCall} 
              disabled={!scheduleDate || !scheduleTime || !videoPlatform || !meetingLink || isLoading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isLoading ? 'Scheduling...' : 'Send Invite & Schedule Call'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default VerificationDetailsPage;
