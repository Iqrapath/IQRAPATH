import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface LearningPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LearningPreferencesData) => void;
  initialData?: LearningPreferencesData;
}

export interface LearningPreferencesData {
  preferredSubjects: string[];
  teachingMode: string;
  studentAgeGroup: string;
  preferredLearningTimes: {
    day: string;
    fromTime: string;
    toTime: string;
    isSelected: boolean;
  }[];
  additionalNotes: string;
}

const timeOptions = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

const ageGroups = [
  "4-6 Years", "7-9 Years", "10-12 Years", "13-15 Years", "16-18 Years", "Adults (18+)"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const subjects = ["Hifz", "Hadith", "Tajweed", "Fiqh", "Tawheed"];

export function LearningPreferencesModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    preferredSubjects: [],
    teachingMode: "full-time",
    studentAgeGroup: "7-9 Years",
    preferredLearningTimes: days.map(day => ({
      day,
      fromTime: "",
      toTime: "",
      isSelected: false
    })),
    additionalNotes: ""
  }
}: LearningPreferencesModalProps) {
  const [formData, setFormData] = useState<LearningPreferencesData>(initialData);

  const handleSubjectChange = (subject: string, isChecked: boolean) => {
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          preferredSubjects: [...prev.preferredSubjects, subject]
        };
      } else {
        return {
          ...prev,
          preferredSubjects: prev.preferredSubjects.filter(s => s !== subject)
        };
      }
    });
  };

  const handleTimeChange = (dayIndex: number, field: 'fromTime' | 'toTime', value: string) => {
    setFormData(prev => {
      const updatedTimes = [...prev.preferredLearningTimes];
      updatedTimes[dayIndex] = {
        ...updatedTimes[dayIndex],
        [field]: value
      };
      return {
        ...prev,
        preferredLearningTimes: updatedTimes
      };
    });
  };

  const handleDaySelection = (dayIndex: number, isSelected: boolean) => {
    setFormData(prev => {
      const updatedTimes = [...prev.preferredLearningTimes];
      updatedTimes[dayIndex] = {
        ...updatedTimes[dayIndex],
        isSelected
      };
      return {
        ...prev,
        preferredLearningTimes: updatedTimes
      };
    });
  };

  const handleTeachingModeChange = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      teachingMode: mode
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Learning Preferences</DialogTitle>
          <DialogDescription>
            Set student learning preferences and schedule
          </DialogDescription>
          {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Preferred Subjects */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Preferred Subjects</Label>
            <div className="flex flex-wrap gap-4">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.preferredSubjects.includes(subject)}
                    onCheckedChange={(checked) =>
                      handleSubjectChange(subject, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`subject-${subject}`}
                    className="text-sm font-normal text-gray-600"
                  >
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Teaching Mode</Label>
            <p className="text-xs text-gray-500">May 6 midday for full-time, 3 midday for part-time</p>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full-time"
                  checked={formData.teachingMode === "full-time"}
                  onCheckedChange={(checked) => {
                    if (checked) handleTeachingModeChange("full-time");
                  }}
                />
                <Label
                  htmlFor="full-time"
                  className="text-sm font-normal text-gray-600"
                >
                  Full-Time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="part-time"
                  checked={formData.teachingMode === "part-time"}
                  onCheckedChange={(checked) => {
                    if (checked) handleTeachingModeChange("part-time");
                  }}
                />
                <Label
                  htmlFor="part-time"
                  className="text-sm font-normal text-gray-600"
                >
                  Part-Time
                </Label>
              </div>
            </div>
          </div>

          {/* Student Age Group */}
          <div className="space-y-3">
            <Label htmlFor="ageGroup" className="text-sm font-medium text-gray-700">
              Student Age Group
            </Label>
            <Select
              value={formData.studentAgeGroup}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, studentAgeGroup: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Learning Times */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Preferred Learning Times
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                A correct time zone is essential to coordinate lessons with international students
              </p>
            </div>

            <div className="space-y-4">
              {formData.preferredLearningTimes.slice(0, 3).map((timeSlot, index) => (
                <div key={timeSlot.day} className="space-y-2">
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
                      className="text-sm font-normal text-gray-600"
                    >
                      {timeSlot.day}
                    </Label>
                  </div>

                  {timeSlot.isSelected && (
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      <div className="space-y-1">
                        <Label htmlFor={`from-${timeSlot.day}`} className="text-xs text-gray-500">
                          From
                        </Label>
                        <Select
                          value={timeSlot.fromTime}
                          onValueChange={(value) =>
                            handleTimeChange(index, 'fromTime', value)
                          }
                        >
                          <SelectTrigger id={`from-${timeSlot.day}`}>
                            <SelectValue placeholder="Select one option..." />
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
                        <Label htmlFor={`to-${timeSlot.day}`} className="text-xs text-gray-500">
                          To
                        </Label>
                        <Select
                          value={timeSlot.toTime}
                          onValueChange={(value) =>
                            handleTimeChange(index, 'toTime', value)
                          }
                        >
                          <SelectTrigger id={`to-${timeSlot.day}`}>
                            <SelectValue placeholder="Select one option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
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

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
              Additional Notes for Teacher
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Add any specific requirements or information"
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#2c7870] hover:bg-[#236158] text-white"
          >
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
export function LearningPreferencesExample() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (data: LearningPreferencesData) => {
    console.log('Form submitted with data:', data);
    // Here you would typically send the data to your backend
    // e.g., axios.post('/api/learning-preferences', data)
    setModalOpen(false);
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-[#2c7870] hover:bg-[#236158]"
      >
        Set Learning Preferences
      </Button>

      <LearningPreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
