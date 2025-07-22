import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatAvatarUrl } from '@/lib/helpers';
<<<<<<< HEAD
import { MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Home } from 'lucide-react';
import ComingSoonModal from '@/components/ui/coming-soon-modal';
import { AddTeacherFlow } from '@/components/dashboard/add-teacher-flow';
=======
import { MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
<<<<<<< HEAD
import { Breadcrumbs } from '@/components/breadcrumbs';
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  teaching_subjects: string[];
  rating: number;
  classesHeld: number;
  status: string;
<<<<<<< HEAD
  subjects?: Array<{id: number, name: string, is_active?: boolean, pivot?: {is_primary: boolean}}> | string[];
=======
  subjects?: string[];
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
}

interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

interface Filters {
  search?: string;
  status?: string;
  teaching_subject?: string;
  rating?: string;
}

interface TeacherManagementProps {
  teachers: Teacher[];
  pagination: Pagination;
  filters: Filters;
  availableSubjects: string[];
  availableStatuses: string[];
  availableRatings: { value: string; label: string }[];
  flash?: { success?: string };
}

export default function TeacherManagement({ 
  teachers: initialTeachers, 
  pagination, 
  filters, 
  availableSubjects,
  availableStatuses,
  availableRatings,
  flash
}: TeacherManagementProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [teachingSubjectFilter, setTeachingSubjectFilter] = useState(filters?.teaching_subject || 'all');
  const [ratingFilter, setRatingFilter] = useState(filters?.rating || 'all');
<<<<<<< HEAD
  
  // Update teachers when initialTeachers changes (e.g., after search/filter)
  useEffect(() => {
    setTeachers(initialTeachers || []);
  }, [initialTeachers]);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<string>('');
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  const getInitials = useInitials();
  const { toast } = useToast();

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      toast({
        title: "Success",
        description: flash.success,
        variant: "success",
      });
    }
  }, [flash]);

  // Handle teacher approval (verification)
  const handleApproveTeacher = (teacherId: number) => {
    setLoading(true);
    router.post(`/admin/teachers/${teacherId}/approve`, {}, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Teacher verified successfully",
          variant: "success",
        });
        setLoading(false);
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "Failed to verify teacher. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    });
  };

  // Handle teacher rejection (verification)
  const handleRejectTeacher = (teacherId: number) => {
    setLoading(true);
    router.post(`/admin/teachers/${teacherId}/reject`, {}, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Teacher verification rejected",
          variant: "success",
        });
        setLoading(false);
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "Failed to reject teacher verification. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    });
  };

  // Handle status update
  const handleUpdateStatus = (teacherId: number, status: string) => {
    setLoading(true);
    
    // Find the current teacher and their status
    const teacher = teachers.find(t => t.id === teacherId);
    const previousStatus = teacher ? teacher.status : '';
    
    router.post(`/admin/teachers/${teacherId}/status`, { status }, {
      onSuccess: () => {
        // Update local state to reflect the status change immediately
        setTeachers(prevTeachers => 
          prevTeachers.map(teacher => 
            teacher.id === teacherId ? { ...teacher, status: status.charAt(0).toUpperCase() + status.slice(1) } : teacher
          )
        );
        
        // Show toast with status change information
        toast({
          title: "Status Updated",
          description: `${teacher?.name}'s status changed from ${previousStatus} to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          variant: "success",
        });
        
        setLoading(false);
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "Failed to update teacher status. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    });
  };

  // Handle view profile
  const handleViewProfile = (teacherId: number) => {
    router.get(`/admin/teachers/${teacherId}`);
  };

  // Handle search form submission
  const handleSearch = () => {
<<<<<<< HEAD
    // Reset to page 1 when searching to ensure results are found
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    router.get('/admin/teachers', {
      search: searchQuery,
      status: statusFilter,
      teaching_subject: teachingSubjectFilter,
<<<<<<< HEAD
      rating: ratingFilter,
      page: 1 // Always start from page 1 when searching
    }, {
      preserveState: true, // Preserve component state when navigating
      only: ['teachers', 'pagination', 'filters'] // Only update these data
=======
      rating: ratingFilter
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.get('/admin/teachers', {
      search: searchQuery,
      status: statusFilter,
      teaching_subject: teachingSubjectFilter,
      rating: ratingFilter,
      page
<<<<<<< HEAD
    }, {
      preserveState: true, // Preserve component state when navigating
      only: ['teachers', 'pagination'] // Only update these data
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    });
  };

  // Generate pagination range
  const getPaginationRange = () => {
    const totalPages = pagination.lastPage;
    const currentPage = pagination.currentPage;
    const range = [];
    
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

<<<<<<< HEAD
  // We no longer need to filter teachers in the component since filtering is handled by the server
  // This ensures search works across all pages of results
  const filteredTeachers = teachers;
=======
  const filteredTeachers = teachers.filter(teacher => {
    // Apply search filter
    if (searchQuery && !teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !teacher.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== "all" && teacher.status !== statusFilter) {
      return false;
    }
    
    // Apply subject filter
    if (teachingSubjectFilter && teachingSubjectFilter !== "all") {
      const subjects = teacher.teaching_subjects || teacher.subjects || [];
      if (!subjects.includes(teachingSubjectFilter)) {
        return false;
      }
    }
    
    // Apply rating filter
    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      if (teacher.rating < rating) {
        return false;
      }
    }
    
    return true;
  });
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

<<<<<<< HEAD
  const showComingSoonModal = (featureName: string) => {
    setComingSoonFeature(featureName);
    setIsComingSoonModalOpen(true);
  };

=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  return (
    <AdminLayout>
      <Head title="Teacher Management" />
      
      <div className="py-6 px-6">
<<<<<<< HEAD
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Teacher Management' }
              ]}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Teacher Management</h1>
          <AddTeacherFlow 
            buttonVariant="primary"
            buttonText="Add New Teacher"
            buttonClassName="bg-teal-600 hover:bg-teal-700 text-white"
            onTeacherAdded={(data) => {
              toast({
                title: "Success",
                description: `${data.user.name} has been added as a new teacher.`,
                variant: "success",
              });
              // Refresh the page to show the new teacher
              setTimeout(() => {
                router.reload();
              }, 100);
            }}
          />
=======
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Teacher Management</h1>
          <Button className="bg-teal-600 hover:bg-teal-700">
            Add New Teachers
          </Button>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input 
              placeholder="Search by Name / Email" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {availableStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={teachingSubjectFilter} onValueChange={setTeachingSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {availableRatings.map((rating) => (
                <SelectItem key={rating.value} value={rating.value}>{rating.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="px-4" onClick={handleSearch}>
            Search
          </Button>
        </div>
        
        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher's Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject(s)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes Held
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading teachers...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No teachers found matching the criteria
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Avatar className="h-10 w-10">
<<<<<<< HEAD
                          {teacher.avatar ? (
                            <AvatarImage 
                              src={formatAvatarUrl(teacher.avatar)} 
                              alt={teacher.name} 
                              onError={() => {
                                // Let fallback handle it
                                console.log(`Failed to load avatar for ${teacher.name}`);
                              }}
                            />
                          ) : null}
=======
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                          <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                        <div className="text-sm text-gray-900">
                          {(() => {
                            // Debug the subjects data (more concise)
                            console.log(`Teacher ${teacher.id} (${teacher.name}) subjects:`, 
                              teacher.teaching_subjects || []);
                            
                            // Use teaching_subjects which is already formatted as an array of strings
                            const subjects = Array.isArray(teacher.teaching_subjects) ? teacher.teaching_subjects : [];
                            
                            if (subjects.length === 0) {
                              return 'None';
                            } else if (subjects.length <= 2) {
                              return subjects.join(', ');
                            } else {
                              return `${subjects.slice(0, 2).join(', ')}, ...`;
                            }
                          })()}
                        </div>
=======
                        <div className="text-sm text-gray-900">{(teacher.teaching_subjects || teacher.subjects || []).join(', ')}</div>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-1">{teacher.rating}</span>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.classesHeld}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(teacher.status)}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2">
                            {/* Verification Actions */}
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-2 cursor-pointer"
                              onClick={() => handleApproveTeacher(teacher.id)}
                            >
                              <span>Verify Teacher</span>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="m23 12l-2.44-2.78l.34-3.68l-3.61-.82l-1.89-3.18L12 3L8.6 1.54L6.71 4.72l-3.61.81l.34 3.68L1 12l2.44 2.78l-.34 3.69l3.61.82l1.89 3.18L12 21l3.4 1.46l1.89-3.18l3.61-.82l-.34-3.68zm-13 5l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9z"/>
                                </svg>
                              </div>
                            </DropdownMenuItem>
                            
                            {/* Status Update */}
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center justify-between p-2 cursor-pointer">
                                <span>Update Status</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                {availableStatuses.map((status) => (
                                  <DropdownMenuItem 
                                    key={status.toLowerCase()}
                                    className="flex items-center justify-between p-2 cursor-pointer"
                                    onClick={() => handleUpdateStatus(teacher.id, status.toLowerCase())}
                                  >
                                    <span>{status}</span>
                                    <div className={`h-3 w-3 rounded-full ${
                                      status === 'Active' ? 'bg-green-500' : 
                                      status === 'Pending' ? 'bg-yellow-500' : 
                                      status === 'Inactive' ? 'bg-red-500' : 
                                      'bg-gray-500'
                                    }`}></div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            
                            {/* Other Actions */}
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-2 cursor-pointer"
<<<<<<< HEAD
                              onClick={() => showComingSoonModal('Edit Profile')}
=======
                              onClick={() => window.location.href = `/admin/teachers/${teacher.id}/edit`}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                            >
                              <span>Edit Profile</span>
                              <div className="flex h-5 w-5 items-center justify-center">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-2 cursor-pointer"
                              onClick={() => handleViewProfile(teacher.id)}
                            >
                              <span>View Profile</span>
                              <div className="flex h-5 w-5 items-center justify-center">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="flex items-center justify-between p-2 cursor-pointer"
<<<<<<< HEAD
                              onClick={() => showComingSoonModal('View Performance')}
=======
                              onClick={() => window.location.href = `/admin/teachers/${teacher.id}/performance`}
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                            >
                              <span>View Performance</span>
                              <div className="flex h-5 w-5 items-center justify-center">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<<<<<<< HEAD
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
=======
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
                                </svg>
                              </div>
                            </DropdownMenuItem>

                             <DropdownMenuItem 
                              className="flex items-center justify-between p-2 cursor-pointer text-red-600"
                              onClick={() => handleRejectTeacher(teacher.id)}
                            >
                              <span>Reject Verification</span>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>
                                </svg>
                              </div>
                            </DropdownMenuItem>
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
        {pagination && pagination.total > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} teachers
            </div>
            <div className="flex items-center gap-1">
              {/* First Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                    variant={pagination.currentPage === page ? "default" : "outline"}
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
                disabled={pagination.currentPage === pagination.lastPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last Page */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={pagination.currentPage === pagination.lastPage}
                onClick={() => handlePageChange(pagination.lastPage)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
<<<<<<< HEAD

        {/* Coming Soon Modal */}
        <ComingSoonModal 
          isOpen={isComingSoonModalOpen}
          onClose={() => setIsComingSoonModalOpen(false)}
          featureName={comingSoonFeature}
          description={`The "${comingSoonFeature}" feature is currently under development and will be available soon. Thank you for your patience!`}
        />
=======
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
      </div>
    </AdminLayout>
  );
} 