import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ControlledTabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/controlled-tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface EnrolledUser {
  id: number;
  name: string;
  email: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface EnrolledUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  users: EnrolledUser[];
  isLoading?: boolean;
}

const EnrolledUsersModal: React.FC<EnrolledUsersModalProps> = ({
  isOpen,
  onClose,
  planName,
  users,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<EnrolledUser[]>(users);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Update filteredUsers when users data changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Reset selected statuses when tab changes
  useEffect(() => {
    setSelectedStatuses([]);
  }, [activeTab]);

  // Filter users based on activeTab, selectedStatuses, and searchTerm
  useEffect(() => {
    let result = users;
    
    // Filter by tab selection
    if (activeTab === 'active') {
      result = users.filter(user => user.status === 'active');
    } else if (activeTab === 'inactive') {
      result = users.filter(user => user.status !== 'active');
    }
    
    // Filter by specific statuses if any are selected
    if (selectedStatuses.length > 0) {
      result = result.filter(user => selectedStatuses.includes(user.status));
    }
    
    // Then filter by search term
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(lowercasedSearch) || 
          user.email.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, users, activeTab, selectedStatuses]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700',
      'expired': 'bg-gray-100 text-gray-700',
      'inactive': 'bg-gray-100 text-gray-700'
    };
    
    return (
      <Badge className={`${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const activeCount = users.filter(user => user.status === 'active').length;
  const inactiveCount = users.length - activeCount;
  
  // Count users by status
  const statusCounts: Record<string, number> = {
    active: 0,
    pending: 0,
    cancelled: 0,
    expired: 0,
    inactive: 0
  };
  
  users.forEach(user => {
    if (statusCounts.hasOwnProperty(user.status)) {
      statusCounts[user.status]++;
    } else {
      statusCounts.inactive++;
    }
  });
  
  // Get count for the "inactive" tab (all non-active statuses)
  const totalInactiveCount = users.length - statusCounts.active;
  
  const renderStatusCount = (count: number) => {
    return (
      <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        {count}
      </span>
    );
  };

  // Get all unique statuses
  const uniqueStatuses = Array.from(new Set(users.map(user => user.status)));

  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Enrolled Users - {planName}
          </DialogTitle>
        </DialogHeader>
        
        {!isLoading && users.length > 0 && (
          <>
            <ControlledTabs 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All {renderStatusCount(users.length)}
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active {renderStatusCount(statusCounts.active)}
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive {renderStatusCount(totalInactiveCount)}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all"></TabsContent>
              <TabsContent value="active"></TabsContent>
              <TabsContent value="inactive"></TabsContent>
            </ControlledTabs>
            
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge className="ml-1 bg-primary text-primary-foreground">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueStatuses.map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      {statusCounts[status] && (
                        <span className="ml-auto text-xs text-gray-500">
                          {statusCounts[status] || 0}
                        </span>
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedStatuses.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => setSelectedStatuses([])}
                      >
                        Clear Filters
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
        
        {!isLoading && selectedStatuses.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <div className="flex flex-wrap gap-1">
              {selectedStatuses.map(status => (
                <Badge key={status} variant="outline" className="flex items-center gap-1 text-xs">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <button
                    onClick={() => toggleStatus(status)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </Badge>
              ))}
              <button
                onClick={() => setSelectedStatuses([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-gray-600">Loading enrolled users...</span>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No users enrolled in this plan</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No users match your search</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.start_date)}</TableCell>
                      <TableCell>{formatDate(user.end_date)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrolledUsersModal; 