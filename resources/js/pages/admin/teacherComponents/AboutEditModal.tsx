import React, { useState } from 'react';

interface AboutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AboutEditData) => void;
  teacherProfile: {
    bio?: string;
  };
  teacher: {
    name: string;
  };
}

export interface AboutEditData {
  bio: string;
}

const AboutEditModal: React.FC<AboutEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherProfile,
  teacher
}) => {
  // Initialize form data with current values
  const [formData, setFormData] = useState<AboutEditData>({
    bio: teacherProfile.bio || ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      bio: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Call the onSave callback with the form data
    onSave(formData);
    
    // Assuming the save is successful
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-lg p-6 max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">About {teacher.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biography
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={8}
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter teacher biography..."
                disabled={isProcessing}
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe the teacher's background, experience, and teaching approach.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutEditModal; 