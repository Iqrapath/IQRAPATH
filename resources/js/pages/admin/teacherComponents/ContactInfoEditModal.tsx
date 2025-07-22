import React, { useState } from 'react';

export interface ContactInfoEditData {
  name: string;
  email: string;
  phone: string;
  location: string;
  subjects: string[];
  subjectsText?: string;
}

interface ContactInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContactInfoEditData) => Promise<void>;
  initialData: ContactInfoEditData;
  teacherId: number;
}

const ContactInfoEditModal: React.FC<ContactInfoEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  teacherId
}) => {
  const [formData, setFormData] = useState<ContactInfoEditData>({
    ...initialData,
    subjectsText: initialData.subjects.join(', ')
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens with new initialData
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialData,
        subjectsText: initialData.subjects.join(', ')
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle subjects as comma-separated string
  const handleSubjectsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const subjectsText = e.target.value;
    
    // Just store the raw text in the form data first
    // This allows user to type commas and spaces naturally
    setFormData(prev => ({
      ...prev,
      // Store the raw text in a temporary field for editing
      subjectsText: subjectsText,
      // Process the subjects array only when needed for submission
      subjects: subjectsText
        .split(',')
        .map((subject: string) => subject.trim())
        .filter((subject: string) => subject)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure subjects are properly parsed before submission
    const dataToSubmit = {
      ...formData,
      subjects: formData.subjectsText
        ? formData.subjectsText
            .split(',')
            .map((subject: string) => subject.trim())
            .filter((subject: string) => subject)
        : formData.subjects
    };

    try {
      await onSave(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-lg p-6 max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Teacher Information</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 pt-2">
                Name
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter teacher name"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 pt-2">
                Email
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 pt-2">
                Phone
              </label>
              <div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label htmlFor="location" className="text-sm font-medium text-gray-700 pt-2">
                Location
              </label>
              <div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter location"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label htmlFor="subjectsText" className="text-sm font-medium text-gray-700 pt-2">
                Subjects
              </label>
              <div>
                <textarea
                  id="subjectsText"
                  name="subjectsText"
                  rows={3}
                  value={formData.subjectsText}
                  onChange={handleSubjectsChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter subjects separated by commas"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the subjects taught by the teacher, separated by commas.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoEditModal; 