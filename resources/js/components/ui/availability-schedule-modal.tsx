import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AvailabilityScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AvailabilityScheduleData) => void;
  initialData?: AvailabilityScheduleData;
  title?: string;
  submitLabel?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export interface TimeSlot {
  day: string;
  fromTime: string;
  toTime: string;
  isSelected: boolean;
}

export interface AvailabilityScheduleData {
  availabilitySchedule: TimeSlot[];
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeOptions = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

export function AvailabilityScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    availabilitySchedule: days.map(day => ({
      day,
      fromTime: "",
      toTime: "",
      isSelected: false
    }))
  },
  title = 'Availability Schedule',
  submitLabel = 'Save',
  onBack,
  showBackButton = true
}: AvailabilityScheduleModalProps) {
  const [formData, setFormData] = useState<AvailabilityScheduleData>(initialData);

  const handleTimeChange = (dayIndex: number, field: 'fromTime' | 'toTime', value: string) => {
    setFormData(prev => {
      const updatedSchedule = [...prev.availabilitySchedule];
      updatedSchedule[dayIndex] = {
        ...updatedSchedule[dayIndex],
        [field]: value
      };
      return {
        ...prev,
        availabilitySchedule: updatedSchedule
      };
    });
  };

  const handleDaySelection = (dayIndex: number, isSelected: boolean) => {
    setFormData(prev => {
      const updatedSchedule = [...prev.availabilitySchedule];
      updatedSchedule[dayIndex] = {
        ...updatedSchedule[dayIndex],
        isSelected
      };
      return {
        ...prev,
        availabilitySchedule: updatedSchedule
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Set your weekly teaching availability schedule
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Teaching Availability
            </Label>
            <p className="text-xs text-gray-500">
              Select the days and times you are available to teach
            </p>

            {formData.availabilitySchedule.map((timeSlot, index) => (
              <div key={timeSlot.day} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${timeSlot.day}`}
                    checked={timeSlot.isSelected}
                    onCheckedChange={(checked) =>
                      handleDaySelection(index, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`day-${timeSlot.day}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {timeSlot.day}
                  </Label>
                </div>

                {timeSlot.isSelected && (
                  <div className="grid grid-cols-2 gap-2 ml-6">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`from-${timeSlot.day}`}
                        className="text-xs text-gray-500"
                      >
                        From
                      </Label>
                      <Select
                        value={timeSlot.fromTime}
                        onValueChange={(value) =>
                          handleTimeChange(index, 'fromTime', value)
                        }
                      >
                        <SelectTrigger
                          id={`from-${timeSlot.day}`}
                          className="h-8 text-xs"
                        >
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`from-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor={`to-${timeSlot.day}`}
                        className="text-xs text-gray-500"
                      >
                        To
                      </Label>
                      <Select
                        value={timeSlot.toTime}
                        onValueChange={(value) =>
                          handleTimeChange(index, 'toTime', value)
                        }
                      >
                        <SelectTrigger
                          id={`to-${timeSlot.day}`}
                          className="h-8 text-xs"
                        >
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions
                            .filter(time => {
                              // Only show times after the selected "from" time
                              if (!timeSlot.fromTime) return true;
                              const fromIndex = timeOptions.indexOf(timeSlot.fromTime);
                              const timeIndex = timeOptions.indexOf(time);
                              return timeIndex > fromIndex;
                            })
                            .map((time) => (
                              <SelectItem key={`to-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          {showBackButton && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 