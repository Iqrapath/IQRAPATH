import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionData) => void;
  initialData?: SubscriptionData;
  onViewTransactions?: () => void;
  isSubmitting?: boolean;
}

export interface SubscriptionData {
  activePlan: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  status: string;
  additionalNotes: string;
}

const subscriptionPlans = [
  "Juz' Amma - ₦10,000/month",
  "Quarter Quran - ₦20,000/month",
  "Half Quran - ₦35,000/month",
  "Full Quran - ₦60,000/month"
];

const statusOptions = [
  "active",
  "inactive",
  "pending",
  "cancelled",
  "expired"
];

export function SubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  onViewTransactions,
  initialData = {
    activePlan: "Juz' Amma - ₦10,000/month",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: "active",
    additionalNotes: ""
  },
  isSubmitting
}: SubscriptionModalProps) {
  const [formData, setFormData] = useState<SubscriptionData>(initialData);
  const [startDate, setStartDate] = useState<Date | undefined>(initialData.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialData.endDate);

  const handleChange = <K extends keyof SubscriptionData>(field: K, value: SubscriptionData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Include the dates in the form data
    const dataToSubmit = {
      ...formData,
      startDate,
      endDate
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Subscription Information</DialogTitle>
          <DialogDescription>
            Manage student subscription details and billing information
          </DialogDescription>
          {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Active Plan */}
          <div className="space-y-3">
            <Label htmlFor="activePlan" className="text-sm font-medium text-gray-700">
              Active Plan
            </Label>
            <Select
              value={formData.activePlan}
              onValueChange={(value) => handleChange("activePlan", value)}
            >
              <SelectTrigger id="activePlan" className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Subscription Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {startDate ? (
                      format(startDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      // If end date is before new start date, update end date
                      if (endDate && date && date > endDate) {
                        const newEndDate = new Date(date);
                        newEndDate.setMonth(newEndDate.getMonth() + 3);
                        setEndDate(newEndDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Subscription End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {endDate ? (
                      format(endDate, "MMMM d, yyyy")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                    }}
                    disabled={(date) =>
                      // Disable dates before start date
                      startDate ? date < startDate : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="space-y-3">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Subscription Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
              Additional Notes for Teacher
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              placeholder="Add any specific requirements or information"
              className="min-h-[80px]"
            />
          </div>

          {/* Payment History */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Payment History
            </Label>
            <Button
              variant="link"
              className="p-0 h-auto text-[#2c7870] hover:text-[#236158]"
              onClick={onViewTransactions}
            >
              View Transactions
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#2c7870] hover:bg-[#236158] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
export function SubscriptionModalExample() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (data: SubscriptionData) => {
    console.log('Form submitted with data:', data);
    // Here you would typically send the data to your backend
    // e.g., axios.post('/api/subscription', data)
    setModalOpen(false);
  };

  const handleViewTransactions = () => {
    console.log('View transactions clicked');
    // Here you would typically navigate to the transactions page or open a transactions modal
    // e.g., navigate('/transactions') or setTransactionsModalOpen(true)
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-[#2c7870] hover:bg-[#236158]"
      >
        Manage Subscription
      </Button>

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onViewTransactions={handleViewTransactions}
      />
    </div>
  );
}
