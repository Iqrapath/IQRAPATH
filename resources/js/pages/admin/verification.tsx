import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Copy, 
  Video,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useToast } from '@/components/ui/use-toast';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { formatAvatarUrl } from '@/lib/helpers';

interface DocumentType {
  id: number;
  document_type: string;
  file_path: string;
  verification_status: string;
}

interface TeacherType {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  location?: string;
  status?: string;
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
  documents: DocumentType[] | null;
}

interface Props {
  requests?: VerificationRequest[];
  error?: string;
  pagination?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
  filters?: {
    search?: string;
    status?: string;
    date?: string;
  };
  flash?: { success?: string; error?: string };
}

const VerificationPage: React.FC<Props> = (props) => {
  // Initialize with props data or empty array if undefined
  const initialRequests = Array.isArray(props.requests) ? props.requests : [];
  const initialError = props.error || null;
  
  const [requests, setRequests] = useState<VerificationRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState(props.filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(props.filters?.status || 'all');
  const [dateFilter, setDateFilter] = useState(props.filters?.date || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [videoPlatform, setVideoPlatform] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  const getInitials = useInitials();
  const { toast: showToast } = useToast();

  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);

  // Update local state when props change (like after a form submission)
  useEffect(() => {
    if (Array.isArray(props.requests)) {
      setRequests(props.requests);
    }
    
    if (props.error) {
      setError(props.error);
    }
  }, [props.requests, props.error]);

  // Show flash messages
  useEffect(() => {
    if (props.flash?.success) {
      showToast({
        title: "Success",
        description: props.flash.success,
        variant: "success",
      });
    }
    if (props.flash?.error) {
      showToast({
        title: "Error",
        description: props.flash.error,
        variant: "destructive",
      });
    }
  }, [props.flash]);

  // View button now directly navigates to the details page

  const handleScheduleCall = (request: VerificationRequest) => {
    setCurrentRequest(request);
    
    // Parse existing scheduled date and time if available
    if (request.scheduled_date) {
      const [date, time] = request.scheduled_date.split('T');
      setScheduleDate(date);
      setScheduleTime(time.substring(0, 5)); // Get only HH:MM part
    } else {
      setScheduleDate('');
      setScheduleTime('');
    }
    
    // Set platform and meeting link if available
    setVideoPlatform(request.video_platform || 'Google Meet');
    setMeetingLink(request.meeting_link || '');
    
    setScheduleDialogOpen(true);
  };

  const handleRejectRequest = (request: VerificationRequest) => {
    setCurrentRequest(request);
    setRejectDialogOpen(true);
  };

  const submitScheduleCall = () => {
    if (!currentRequest) return;
    
    setIsLoading(true);
    const scheduledDateTime = `${scheduleDate}T${scheduleTime}`;
    
    router.post(route('admin.verification-requests.schedule', { id: currentRequest.id }), {
      scheduled_date: scheduledDateTime,
      video_platform: videoPlatform,
      meeting_link: meetingLink,
      meeting_notes: meetingNotes
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Video call scheduled successfully',
          variant: "success",
        });
        setScheduleDialogOpen(false);
        // Refresh the page to get updated data
        router.reload();
      },
      onError: (errors) => {
        console.error('Error scheduling video call:', errors);
        showToast({
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

  const submitVerification = (id: number) => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.verify', { id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Verification approved successfully',
          variant: "success",
        });
        // Refresh the page to get updated data
        router.reload();
      },
      onError: (errors) => {
        console.error('Error approving verification:', errors);
        showToast({
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

  const submitRejection = () => {
    if (!currentRequest) return;
    
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.reject', { id: currentRequest.id }), {
      rejection_reason: rejectionReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Verification request rejected',
          variant: "success",
        });
        setRejectDialogOpen(false);
        setRejectionReason('');
        // Refresh the page to get updated data
        router.reload();
      },
      onError: (errors) => {
        console.error('Error rejecting verification:', errors);
        showToast({
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

  const setLiveVideo = (id: number) => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.live-video', { id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Verification request set to live video status',
          variant: "success",
        });
        router.reload();
      },
      onError: (errors) => {
        console.error('Error setting live video status:', errors);
        showToast({
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

  const markCallCompleted = (id: number) => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.complete-call', { id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Video call marked as completed',
          variant: "success",
        });
        router.reload();
      },
      onError: (errors) => {
        console.error('Error marking call as completed:', errors);
        showToast({
          title: "Error",
          description: 'Failed to mark call as completed',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const markCallMissed = (id: number) => {
    setIsLoading(true);
    
    router.post(route('admin.verification-requests.missed-call', { id }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        showToast({
          title: "Success",
          description: 'Video call marked as missed',
          variant: "success",
        });
        router.reload();
      },
      onError: (errors) => {
        console.error('Error marking call as missed:', errors);
        showToast({
          title: "Error",
          description: 'Failed to mark call as missed',
          variant: "destructive",
        });
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  // Handle search form submission
  const handleSearch = () => {
    // Reset to page 1 when searching to ensure results are found
    router.get('/admin/verification-requests', {
      search: searchQuery,
      status: statusFilter,
      date: dateFilter,
      page: 1 // Always start from page 1 when searching
    }, {
      preserveState: true, // Preserve component state when navigating
      only: ['requests', 'pagination', 'filters'] // Only update these data
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.get('/admin/verification-requests', {
      search: searchQuery,
      status: statusFilter,
      date: dateFilter,
      page
    }, {
      preserveState: true, // Preserve component state when navigating
      only: ['requests', 'pagination'] // Only update these data
    });
  };

  // Generate pagination range
  const getPaginationRange = () => {
    if (!props.pagination) return [];
    
    const totalPages = props.pagination.lastPage;
    const currentPage = props.pagination.currentPage;
    const range: (number | string)[] = [];
    
    // Always show first page
    range.push(1);
    
    // Calculate start and end of pagination range
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      range.push('ellipsis1');
    }
    
    // Add pages in the middle
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      range.push('ellipsis2');
    }
    
    // Add last page if there is more than one page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-yellow-700">Pending</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-700">Verified</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-red-700">Rejected</span>
          </div>
        );
      case 'live_video':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-700">Live Video</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">{status || 'Unknown'}</span>
          </div>
        );
    }
  };

  const getVideoStatusBadge = (status: string) => {
    switch (status) {
      case 'not_scheduled':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Not Scheduled</span>
          </div>
        );
      case 'scheduled':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-700">Scheduled</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-700">Completed</span>
          </div>
        );
      case 'missed':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-red-700">Missed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">{status || 'Unknown'}</span>
          </div>
        );
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  const getDocumentCount = (request: VerificationRequest) => {
    if (!request.documents) return '0 Files';
    return `${request.documents.length} Files`;
  };

  // Helper function to determine if a request can be set to live video status
  const canSetLiveVideo = (request: VerificationRequest) => {
    return request.status === 'pending' && request.video_status === 'completed';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(requests.map((request) => request.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, id]);
    } else {
      setSelectedRequests(selectedRequests.filter((requestId) => requestId !== id));
    }
  };

  return (
    <AdminLayout>
      <Head title="Verification Requests" />
      
      <div className="py-6 px-6 bg-slate-50">
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Verification Requests' }
              ]}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Review and approve identity and qualification documents submitted by new or updating teachers. <br />
            Ensure quality and trust across the platform.
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">Verification Request Table</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <Input 
              placeholder="Search by Name/Email" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 rounded-full"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="live_video">Live Video</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative w-[180px]">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-full"
              placeholder="mm/dd/yyyy"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          
          <Button className="px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <Checkbox 
                      checked={selectedRequests.length === requests.length && requests.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile Photo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Docs Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading verification requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No verification requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox 
                          checked={selectedRequests.includes(request.id)}
                          onCheckedChange={(checked) => handleSelectRequest(request.id, !!checked)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Avatar className="h-10 w-10">
                          {request.teacher?.avatar ? (
                            <AvatarImage 
                              src={formatAvatarUrl(request.teacher.avatar)} 
                              alt={request.teacher?.name || 'Teacher'} 
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                          <AvatarFallback>{getInitials(request.teacher?.name || '')}</AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.teacher?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.teacher?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getDocumentCount(request)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getVideoStatusBadge(request.video_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(request.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 focus:ring-0 focus:ring-offset-0"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-lg border border-gray-100">
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => submitVerification(request.id)}
                            >
                              <span className="font-medium">Verify</span>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => router.visit(route('admin.verification-requests.show', { id: request.id }))}
                            >
                              <span className="font-medium">View</span>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => handleScheduleCall(request)}
                            >
                              <span className="font-medium">{request.video_status === 'scheduled' ? 'Reschedule Call' : 'Schedule Call'}</span>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100">
                                <Calendar className="h-4 w-4 text-teal-600" />
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => {
                                if (request.meeting_link) {
                                  navigator.clipboard.writeText(request.meeting_link);
                                  showToast({
                                    title: "Success",
                                    description: 'Meeting link copied to clipboard',
                                    variant: "success",
                                  });
                                } else {
                                  showToast({
                                    title: "Error",
                                    description: 'No meeting link available',
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              <span className="font-medium">Copy Meeting Link</span>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                <Copy className="h-4 w-4 text-blue-600" />
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => handleRejectRequest(request)}
                            >
                              <span className="font-medium">Reject</span>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </div>
                            </DropdownMenuItem>
                            
                            {request.status === 'pending' && (
                              <DropdownMenuItem 
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                                onClick={() => setLiveVideo(request.id)}
                              >
                                <span className="font-medium">Set Live Video</span>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                  <Video className="h-4 w-4 text-blue-600" />
                                </div>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {props.pagination && props.pagination.total > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {(props.pagination.currentPage - 1) * props.pagination.perPage + 1} to {Math.min(props.pagination.currentPage * props.pagination.perPage, props.pagination.total)} of {props.pagination.total} verification requests
            </div>
            <div className="flex items-center gap-1">
              {/* First Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={props.pagination?.currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={props.pagination?.currentPage === 1}
                onClick={() => props.pagination && handlePageChange(props.pagination.currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page Numbers */}
              {getPaginationRange().map((page, index) => (
                page === 'ellipsis1' || page === 'ellipsis2' ? (
                  <div key={`ellipsis-${index}`} className="px-2">...</div>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant={props.pagination?.currentPage === page ? "default" : "outline"}
                    className="h-8 w-8"
                    onClick={() => handlePageChange(Number(page))}
                  >
                    {page}
                  </Button>
                )
              ))}
              
              {/* Next Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={props.pagination?.currentPage === props.pagination?.lastPage}
                onClick={() => props.pagination && handlePageChange(props.pagination.currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={props.pagination?.currentPage === props.pagination?.lastPage}
                onClick={() => props.pagination && handlePageChange(props.pagination.lastPage)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Documents Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
          </DialogHeader>
          {currentRequest && (
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {currentRequest.teacher?.avatar ? (
                    <AvatarImage 
                      src={formatAvatarUrl(currentRequest.teacher.avatar)} 
                      alt={currentRequest.teacher?.name || 'Teacher'} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback>{getInitials(currentRequest.teacher?.name || '')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{currentRequest.teacher?.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-500">{currentRequest.teacher?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Documents Review Panel</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentRequest.documents && currentRequest.documents.length > 0 ? (
                        currentRequest.documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {doc.document_type === 'id_front' && 'ID Card (Front)'}
                              {doc.document_type === 'id_back' && 'ID Card (Back)'}
                              {doc.document_type === 'certificate' && 'Teaching Certificate'}
                              {doc.document_type === 'resume' && 'Resume/CV'}
                              {!['id_front', 'id_back', 'certificate', 'resume'].includes(doc.document_type) && doc.document_type}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <a 
                                href={doc.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Document
                              </a>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {getStatusBadge(doc.verification_status)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(doc.file_path, '_blank')}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                            No documents found for this verification request.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Video Verification</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p>{getVideoStatusBadge(currentRequest.video_status)}</p>
                  </div>
                  {currentRequest.scheduled_date && (
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Date</p>
                      <p>{formatDate(currentRequest.scheduled_date)}</p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                {currentRequest.status === 'pending' && (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        setViewDialogOpen(false);
                        handleRejectRequest(currentRequest);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => submitVerification(currentRequest.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Verify
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
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
              <Select value={videoPlatform} onValueChange={setVideoPlatform}>
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
              <Label htmlFor="meeting-link">Meeting Link</Label>
              <Input
                id="meeting-link"
                placeholder="https://meet.google.com/..."
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
              disabled={!scheduleDate || !scheduleTime || !videoPlatform || isLoading}
            >
              {isLoading ? 'Scheduling...' : 'Send Invite & Schedule Call'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </AdminLayout>
  );
};

export default VerificationPage;
