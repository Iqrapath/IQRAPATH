import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Copy, Edit, Pause, Eye, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import EnrolledUsersModal from '@/components/modals/EnrolledUsersModal';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  billing_period: string;
  enrolled_users: number;
  status: string;
  is_active: boolean;
}

interface EnrolledUser {
  id: number;
  name: string;
  email: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Props {
  plans: SubscriptionPlan[];
}

const SubscriptionPlans: React.FC<Props> = ({ plans }) => {
  const { toast } = useToast();
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [isEnrolledUsersModalOpen, setIsEnrolledUsersModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<{ id: number; name: string } | null>(null);
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  
  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{id: number; name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const togglePlanSelection = (planId: number) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const handleDuplicatePlan = (planId: number) => {
    router.post(route('admin.subscription-plans.duplicate', planId), {}, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Plan duplicated successfully",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to duplicate plan",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleStatus = (planId: number) => {
    router.post(route('admin.subscription-plans.toggle-status', planId), {}, {
      onSuccess: () => {
        const plan = plans.find(p => p.id === planId);
        const statusMessage = plan?.is_active ? 'deactivated' : 'activated';
        toast({
          title: "Success",
          description: `Plan ${statusMessage} successfully`,
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update plan status",
          variant: "destructive",
        });
      }
    });
  };

  const openDeleteModal = (plan: SubscriptionPlan) => {
    setPlanToDelete({
      id: plan.id,
      name: plan.name
    });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      setIsDeleting(true);
      router.delete(route('admin.subscription-plans.destroy', planToDelete.id), {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Plan deleted successfully",
            variant: "success",
          });
          setIsDeleting(false);
          closeDeleteModal();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete plan",
            variant: "destructive",
          });
          setIsDeleting(false);
        }
      });
    }
  };

  const handleViewEnrolledUsers = async (plan: SubscriptionPlan) => {
    setLoadingPlanId(plan.id);
    
    try {
      const response = await axios.get(route('admin.subscription-plans.users', plan.id));
      setCurrentPlan({ id: plan.id, name: plan.name });
      setEnrolledUsers(response.data.enrolledUsers);
      setIsEnrolledUsersModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch enrolled users:', error);
      toast({
        title: "Error",
        description: "Failed to load enrolled users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <AdminLayout>
      <Head title="Subscription & Plans Management" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8">

        <div className="flex items-center mb-6">
          <div className="flex-1">
            <Breadcrumbs 
              breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Subscription & Plans Management' }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription & Plans Management</h1>
          <Link href={route('admin.subscription-plans.create')}>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Create / Edit Plan
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-2">
            <h2 className="text-xl font-medium text-gray-900 mb-4">All Subscription Plans</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedPlans.length === plans.length && plans.length > 0}
                      onCheckedChange={() => {
                        if (selectedPlans.length === plans.length) {
                          setSelectedPlans([]);
                        } else {
                          setSelectedPlans(plans.map(plan => plan.id));
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price ( ₦/USD)</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Enrolled Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={() => togglePlanSelection(plan.id)}
                      />
                    </TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.billing_period}</TableCell>
                    <TableCell>{plan.enrolled_users}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleDuplicatePlan(plan.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate Plan</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route('admin.subscription-plans.edit', plan.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Plan Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(plan.id)}>
                            <Pause className="mr-2 h-4 w-4" />
                            <span>{plan.is_active ? 'Pause Plan' : 'Activate Plan'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewEnrolledUsers(plan)} disabled={loadingPlanId === plan.id}>
                            {loadingPlanId === plan.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="mr-2 h-4 w-4" />
                            )}
                            <span>View enrolled users</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteModal(plan)}
                            className="text-red-600 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {currentPlan && (
        <EnrolledUsersModal
          isOpen={isEnrolledUsersModalOpen}
          onClose={() => setIsEnrolledUsersModalOpen(false)}
          planName={currentPlan.name}
          users={enrolledUsers}
          isLoading={loadingPlanId === currentPlan.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the plan <span className="font-bold">{planToDelete?.name}</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SubscriptionPlans; 