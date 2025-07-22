import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Upload, X, FileText, Check } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentUploadData) => void;
  initialData?: DocumentUploadData;
  title?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export interface DocumentFile {
  file: File | null;
  preview: string | null;
  uploaded: boolean;
}

export interface DocumentUploadData {
  id_front: DocumentFile;
  id_back: DocumentFile;
  certificate: DocumentFile;
  resume: DocumentFile;
  id_type: string;
  certificate_name: string;
  certificate_institution: string;
  issue_date: Date | null;
  expiry_date: Date | null;
}

const idTypes = [
  "National ID",
  "Passport",
  "Driver's License",
  "Voter's Card"
];

export function DocumentUploadModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    id_front: { file: null, preview: null, uploaded: false },
    id_back: { file: null, preview: null, uploaded: false },
    certificate: { file: null, preview: null, uploaded: false },
    resume: { file: null, preview: null, uploaded: false },
    id_type: "National ID",
    certificate_name: "",
    certificate_institution: "",
    issue_date: null,
    expiry_date: null
  },
  title = 'Document Upload',
  submitLabel = 'Save',
  isSubmitting = false,
  onBack,
  showBackButton = true
}: DocumentUploadModalProps) {
  const [formData, setFormData] = useState<DocumentUploadData>(initialData);
  const [issueDate, setIssueDate] = useState<Date | undefined>(initialData.issue_date || undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(initialData.expiry_date || undefined);

  // Update form data when dates change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null
    }));
  }, [issueDate, expiryDate]);

  const handleChange = <K extends keyof DocumentUploadData>(field: K, value: DocumentUploadData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field: keyof Pick<DocumentUploadData, 'id_front' | 'id_back' | 'certificate' | 'resume'>, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: {
            file,
            preview: reader.result as string,
            uploaded: false
          }
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Determine if a file is an image based on file extension
  const isImageFile = (file: File | null): boolean => {
    if (!file) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileName = file.name.toLowerCase();
    
    return imageExtensions.some(ext => fileName.endsWith(ext));
  };

  // Get file extension from file
  const getFileExtension = (file: File | null): string => {
    if (!file) return '';
    
    const filename = file.name;
    const parts = filename.split('.');
    
    if (parts.length > 1) {
      return parts.pop()?.toLowerCase() || '';
    }
    
    return '';
  };

  const renderFileUpload = (
    field: keyof Pick<DocumentUploadData, 'id_front' | 'id_back' | 'certificate' | 'resume'>,
    label: string
  ) => {
    const fileData = formData[field];
    
    return (
      <div className="space-y-2">
        <Label htmlFor={field}>{label}</Label>
        <div className="border rounded-md p-4">
          {fileData.preview ? (
            <div className="flex flex-col items-center">
              {isImageFile(fileData.file) ? (
                <img 
                  src={fileData.preview} 
                  alt={`${label} Preview`} 
                  className="max-h-40 mb-2 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 w-full mb-2 text-center">
                  {getFileExtension(fileData.file) === 'pdf' ? (
                    // PDF icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                      <path fill="#e53935" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path fill="#ffebee" d="M14 3v5h5v12H6V3h8z"/>
                      <path fill="#e53935" d="M13.5 14.5c0 .83-.67 1.5-1.5 1.5v.5h1v1h-3v-1h1V16c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2zm-1-2H11v2h1.5v-2z"/>
                      <path fill="#e53935" d="M14 3v5h5l-5-5z"/>
                    </svg>
                  ) : (['doc', 'docx'].includes(getFileExtension(fileData.file))) ? (
                    // Word document icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                      <path fill="#2196f3" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path fill="#e3f2fd" d="M14 3v5h5v12H6V3h8z"/>
                      <path fill="#2196f3" d="M14 3v5h5l-5-5z"/>
                      <path fill="#2196f3" d="M11.15 15H12.5l-1.6-6h-1.8L7.5 15h1.35l.35-1.5h1.6l.35 1.5zm-1.7-4.5l.6 2h-1.2l.6-2z"/>
                    </svg>
                  ) : (
                    // Default document icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                      <path fill="#607d8b" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path fill="#eceff1" d="M14 3v5h5v12H6V3h8z"/>
                      <path fill="#607d8b" d="M14 3v5h5l-5-5z"/>
                      <path fill="#607d8b" d="M11.5 14.5h-2v-1h2v1zm2 2h-4v-1h4v1zm0-3h-2v-1h2v1z"/>
                    </svg>
                  )}
                  <span className="text-xs mt-2 font-medium text-gray-600">
                    {getFileExtension(fileData.file).toUpperCase()} File
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm truncate max-w-[150px]">
                  {fileData.file?.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleChange(field, { file: null, preview: null, uploaded: false })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <label 
                htmlFor={`file-${field}`} 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload</span>
                <span className="text-xs text-gray-400">PDF, Word, JPG, PNG (max 5MB)</span>
              </label>
              <input 
                id={`file-${field}`} 
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                onChange={(e) => handleFileChange(field, e)} 
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload verification documents for teacher approval
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id_type">ID Type</Label>
            <Select
              value={formData.id_type}
              onValueChange={(value) => handleChange('id_type', value)}
            >
              <SelectTrigger id="id_type">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {idTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderFileUpload('id_front', 'ID Front')}
            {renderFileUpload('id_back', 'ID Back')}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_name">Certificate Name</Label>
            <Input
              id="certificate_name"
              placeholder="e.g. Bachelor's in Islamic Studies"
              value={formData.certificate_name}
              onChange={(e) => handleChange('certificate_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_institution">Issuing Institution</Label>
            <Input
              id="certificate_institution"
              placeholder="e.g. Al-Azhar University"
              value={formData.certificate_institution}
              onChange={(e) => handleChange('certificate_institution', e.target.value)}
            />
          </div>

          {renderFileUpload('certificate', 'Certificate')}
          {renderFileUpload('resume', 'Resume/CV')}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date ? format(formData.issue_date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleChange('issue_date', date);
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (if any)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date ? format(formData.expiry_date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleChange('expiry_date', date);
                }}
                className="w-full"
                min={formData.issue_date ? format(formData.issue_date, "yyyy-MM-dd") : ""}
              />
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
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 