import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface TeacherVerificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  isVerified?: boolean;
}

export function TeacherVerificationSuccessModal({
  isOpen,
  onClose,
  teacherName,
  isVerified = false
}: TeacherVerificationSuccessModalProps) {
  const { toast } = useToast();
  
  // Debug log to check if isVerified is correctly passed to the modal
  useEffect(() => {
    console.log('TeacherVerificationSuccessModal received props:', { isOpen, teacherName, isVerified });
  }, [isOpen, teacherName, isVerified]);

  const handleGoToDashboard = () => {
    if (isVerified) {
    onClose();
    router.visit('/teacher/dashboard');
    }
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isVerified) {
      // Show toast message when non-verified user tries to dismiss modal
      toast({
        title: "Verification Required",
        description: "You need to be verified before you can access the platform. Please complete your profile and wait for verification.",
        variant: "destructive",
      });
      return;
    }
    
    if (isVerified) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-6 flex flex-col items-center text-center">
        {isVerified && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
        )}

        <div className="text-4xl mb-4">{isVerified ? '🎉' : '⏳'}</div>
        <h2 className="text-xl font-semibold mb-2">
          {isVerified ? `Congratulations, ${teacherName}!` : `Welcome, ${teacherName}!`}
        </h2>
        
        {isVerified ? (
        <p className="text-green-600 mb-6 text-sm">
          Your profile is now verified! You're ready to start teaching and connecting with students.
        </p>
        ) : (
          <p className="text-amber-600 mb-6 text-sm">
            Your profile is currently under review. Once verified, you'll be able to start teaching and connecting with students.
          </p>
        )}
        
        <p className="text-gray-600 mb-6 text-sm">
          {isVerified 
            ? "To help you get started, we've highlighted some quick actions below." 
            : "Please complete your profile while waiting for verification. You'll have full access once your profile is approved."}
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${isVerified 
              ? 'bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
          >
            <div className="bg-teal-100 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium">View My Profile</span>
          </div>
          
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${isVerified 
              ? 'bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
          >
            <div className="bg-teal-100 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium">Set My Availability</span>
          </div>
          
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${isVerified 
              ? 'bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
          >
            <div className="bg-teal-100 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium">Find Students</span>
          </div>
          
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${isVerified 
              ? 'bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
          >
            <div className="bg-teal-100 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium">Check Messages</span>
          </div>
        </div>

        <div className="flex flex-col w-full space-y-3">
        <Button 
          onClick={handleGoToDashboard} 
          variant="outline" 
            className={`w-full ${isVerified 
              ? 'text-teal-600 border-teal-600 hover:bg-teal-50' 
              : 'text-gray-400 border-gray-300 cursor-not-allowed'}`}
            disabled={!isVerified}
        >
            {isVerified ? 'Go to Dashboard' : 'Waiting for Verification'}
          </Button>

          {!isVerified && (
            <Button 
              onClick={handleLogout} 
              variant="destructive" 
              className="w-full mt-4"
            >
              Logout
        </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 