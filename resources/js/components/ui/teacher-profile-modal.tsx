import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherProfileData) => void;
  initialData?: TeacherProfileData;
  title?: string;
  submitLabel?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export interface TeacherProfileData {
  bio: string;
  years_of_experience: number;
  teaching_subjects: string[];
  specialization: string;
  teaching_type: string;
  teaching_mode: string;
  teaching_languages: string[];
}

const predefinedSubjects = ["Hifz", "Hadith", "Tajweed", "Fiqh", "Tawheed"];
const predefinedLanguages = ["English", "Arabic", "Hausa", "Yoruba", "Igbo"];

export function TeacherProfileModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    bio: '',
    years_of_experience: 0,
    teaching_subjects: [],
    specialization: '',
    teaching_type: 'online',
    teaching_mode: 'full-time',
    teaching_languages: ['English'],
  },
  title = 'Teacher Profile',
  submitLabel = 'Save',
  onBack,
  showBackButton = true
}: TeacherProfileModalProps) {
  const [formData, setFormData] = useState<TeacherProfileData>(initialData);
  const [newSubject, setNewSubject] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>('');

  const handleChange = <K extends keyof TeacherProfileData>(field: K, value: TeacherProfileData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubjectChange = (subject: string, isChecked: boolean) => {
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          teaching_subjects: [...prev.teaching_subjects, subject]
        };
      } else {
        return {
          ...prev,
          teaching_subjects: prev.teaching_subjects.filter(s => s !== subject)
        };
      }
    });
  };

  const handleLanguageChange = (language: string, isChecked: boolean) => {
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          teaching_languages: [...prev.teaching_languages, language]
        };
      } else {
        return {
          ...prev,
          teaching_languages: prev.teaching_languages.filter(l => l !== language)
        };
      }
    });
  };

  const handleAddCustomSubject = () => {
    if (newSubject && !formData.teaching_subjects.includes(newSubject)) {
      setFormData(prev => ({
        ...prev,
        teaching_subjects: [...prev.teaching_subjects, newSubject]
      }));
      setNewSubject('');
    }
  };

  const handleAddCustomLanguage = () => {
    if (newLanguage && !formData.teaching_languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        teaching_languages: [...prev.teaching_languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      teaching_subjects: prev.teaching_subjects.filter(s => s !== subject)
    }));
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      teaching_languages: prev.teaching_languages.filter(l => l !== language)
    }));
  };

  const handleSubmit = () => {
    // Prepare the data for submission
    const dataToSubmit = {
      ...formData,
      // Ensure teaching_subjects is an array of strings
      teaching_subjects: formData.teaching_subjects.filter(subject => subject.trim() !== ''),
      // Ensure teaching_languages is an array of strings
      teaching_languages: formData.teaching_languages.filter(language => language.trim() !== '')
    };
    
    // Log the data being submitted
    console.log('Submitting teacher profile data:', dataToSubmit);
    
    // Submit the data
    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter teacher profile information and teaching details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Brief description about yourself and your teaching experience"
              className="min-h-[100px]"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_of_experience">Years of Experience</Label>
            <Input
              id="years_of_experience"
              type="number"
              min="0"
              max="50"
              value={formData.years_of_experience}
              onChange={(e) => handleChange('years_of_experience', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Teaching Subjects</Label>
            <div className="flex flex-wrap gap-4">
              {predefinedSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.teaching_subjects.includes(subject)}
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
            
            {/* Custom subjects display */}
            {formData.teaching_subjects.filter(subject => !predefinedSubjects.includes(subject)).length > 0 && (
              <div className="mt-2">
                <Label className="text-sm font-medium">Custom Subjects</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.teaching_subjects
                    .filter(subject => !predefinedSubjects.includes(subject))
                    .map(subject => (
                      <div key={subject} className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md flex items-center">
                        {subject}
                        <button 
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="ml-1 text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* Add custom subject */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add custom subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddCustomSubject}
                disabled={!newSubject.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              placeholder="Your main area of expertise"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teaching_type">Teaching Type</Label>
            <Select
              value={formData.teaching_type}
              onValueChange={(value) => handleChange('teaching_type', value)}
            >
              <SelectTrigger id="teaching_type">
                <SelectValue placeholder="Select teaching type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teaching_mode">Teaching Mode</Label>
            <Select
              value={formData.teaching_mode}
              onValueChange={(value) => handleChange('teaching_mode', value)}
            >
              <SelectTrigger id="teaching_mode">
                <SelectValue placeholder="Select teaching mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Teaching Languages</Label>
            <div className="flex flex-wrap gap-4">
              {predefinedLanguages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={formData.teaching_languages.includes(language)}
                    onCheckedChange={(checked) =>
                      handleLanguageChange(language, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`language-${language}`}
                    className="text-sm font-normal text-gray-600"
                  >
                    {language}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Custom languages display */}
            {formData.teaching_languages.filter(lang => !predefinedLanguages.includes(lang)).length > 0 && (
              <div className="mt-2">
                <Label className="text-sm font-medium">Custom Languages</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.teaching_languages
                    .filter(lang => !predefinedLanguages.includes(lang))
                    .map(lang => (
                      <div key={lang} className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md flex items-center">
                        {lang}
                        <button 
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="ml-1 text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* Add custom language */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add custom language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddCustomLanguage}
                disabled={!newLanguage.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
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