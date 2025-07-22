<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { formatFileUrl } from '@/lib/helpers';
import DocumentViewerModal from '@/components/modals/DocumentViewerModal';
=======
import React from 'react';
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717

interface DocumentsProps {
  idVerification?: {
    uploaded: boolean;
    idType?: string;
    frontImage?: string;
<<<<<<< HEAD
    frontUrl?: string;
    frontVerificationStatus?: string;
    frontId?: number;
    backImage?: string;
    backUrl?: string;
    backVerificationStatus?: string;
    backId?: number;
=======
    backImage?: string;
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  };
  certificates?: Array<{
    id: number;
    name: string;
    image: string;
<<<<<<< HEAD
    url?: string;
    verification_status?: string;
    uploaded: boolean;
    institution?: string;
    issue_date?: string;
=======
    uploaded: boolean;
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
  }>;
  resume?: {
    uploaded: boolean;
    file?: string;
<<<<<<< HEAD
    url?: string;
    verification_status?: string;
    id?: number;
  };
  teacherId?: number;
  refreshDocuments?: () => void;
  isAdmin?: boolean;
}

const Documents: React.FC<DocumentsProps> = ({
  idVerification = { uploaded: false },
  certificates = [],
  resume = { uploaded: false },
  teacherId,
  refreshDocuments,
  isAdmin = true // Default to admin view
}) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyingCertId, setVerifyingCertId] = useState<number | null>(null);
  const [idType, setIdType] = useState('National ID');
  const { toast } = useToast();
  
  // Modal state for viewing documents
  const [viewingDocument, setViewingDocument] = useState<{
    open: boolean;
    title: string;
    url?: string;
    path?: string;
    isImage: boolean;
    extension?: string;
  }>({
    open: false,
    title: '',
    isImage: false
  });

  // Debug: Log certificate data
  // React.useEffect(() => {
  //   console.log('Certificates received by component:', certificates);
    
  //   // Only check certificates that are actually uploaded
  //   certificates.forEach((cert, index) => {
  //     if (!cert.uploaded) {
  //       console.log(`Certificate ${index} (${cert.name || 'unnamed'}) is not uploaded, skipping verification check`);
  //       return;
  //     }
      
  //     if (!cert.verification_status) {
  //       console.log(`Certificate ${index} (${cert.name || 'unnamed'}) is missing verification_status`);
  //     } else {
  //       console.log(`Certificate ${index} (${cert.name || 'unnamed'}) has verification_status: ${cert.verification_status}`);
  //     }
  //   });
  // }, [certificates]);

  // Helper function to get the appropriate URL for a document
  const getDocumentUrl = (path?: string, directUrl?: string): string => {
    // If we have a direct URL from the backend, use that first
    if (directUrl) return directUrl;
    
    // Otherwise format the path
    return formatFileUrl(path);
  };

  // Determine if a file is an image based on path/extension
  const isImageFile = (path?: string): boolean => {
    if (!path) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerPath = path.toLowerCase();
    
    return imageExtensions.some(ext => lowerPath.endsWith(ext));
  };

  // Get file extension from path
  const getFileExtension = (path?: string): string => {
    if (!path) return '';
    
    const filename = path.split('/').pop() || '';
    const parts = filename.split('.');
    
    if (parts.length > 1) {
      return parts.pop()?.toLowerCase() || '';
    }
    
    return '';
  };

  // Render appropriate document preview based on file type
  const renderDocumentPreview = (path?: string, url?: string, name?: string) => {
    if (!path) return null;
    
    const fileUrl = getDocumentUrl(path, url);
    const extension = getFileExtension(path);
    
    if (isImageFile(path)) {
      return (
        <img 
          src={fileUrl}
          alt={name || "Document"} 
          className="w-full h-full object-contain"
        />
      );
    }
    
    // Different icons based on file type
    if (extension === 'pdf') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
            <path fill="#e53935" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path fill="#ffebee" d="M14 3v5h5v12H6V3h8z"/>
            <path fill="#e53935" d="M13.5 14.5c0 .83-.67 1.5-1.5 1.5v.5h1v1h-3v-1h1V16c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2zm-1-2H11v2h1.5v-2z"/>
            <path fill="#e53935" d="M14 3v5h5l-5-5z"/>
          </svg>
          <span className="text-xs mt-2 font-medium text-gray-600">PDF Document</span>
        </div>
      );
    }
    
    if (['doc', 'docx'].includes(extension)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
            <path fill="#2196f3" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path fill="#e3f2fd" d="M14 3v5h5v12H6V3h8z"/>
            <path fill="#2196f3" d="M14 3v5h5l-5-5z"/>
            <path fill="#2196f3" d="M11.15 15H12.5l-1.6-6h-1.8L7.5 15h1.35l.35-1.5h1.6l.35 1.5zm-1.7-4.5l.6 2h-1.2l.6-2z"/>
          </svg>
          <span className="text-xs mt-2 font-medium text-gray-600">Word Document</span>
        </div>
      );
    }
    
    // Default document icon
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path fill="#607d8b" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path fill="#eceff1" d="M14 3v5h5v12H6V3h8z"/>
          <path fill="#607d8b" d="M14 3v5h5l-5-5z"/>
          <path fill="#607d8b" d="M11.5 14.5h-2v-1h2v1zm2 2h-4v-1h4v1zm0-3h-2v-1h2v1z"/>
        </svg>
        <span className="text-xs mt-2 font-medium text-gray-600">{extension.toUpperCase()} File</span>
      </div>
    );
  };

  // Handle document verification
  const handleVerifyID = async () => {
    if (!teacherId || !idVerification.uploaded) {
      toast({
        title: "Verification Error",
        description: "No ID documents to verify",
        variant: "destructive"
      });
      return;
    }

    // Show document IDs via toast instead of console
    toast({
      title: "Document IDs",
      description: `Front ID: ${idVerification.frontId || 'Missing'}, Back ID: ${idVerification.backId || 'Missing'}`,
      variant: "info"
    });

    try {
      setVerifying(true);

      // Verify both front and back ID if available
      const verificationPromises = [];
      
      if (idVerification.frontId && idVerification.frontVerificationStatus !== 'verified') {
        toast({
          title: "Verifying",
          description: `Front ID document: ${idVerification.frontId}`,
          variant: "info"
        });
        
        verificationPromises.push(
          axios.post(`/admin/teachers/${teacherId}/documents/${idVerification.frontId}/verify`, {
            verification_status: 'verified',
            verification_notes: 'Verified by admin'
          })
        );
      }
      
      if (idVerification.backId && idVerification.backVerificationStatus !== 'verified') {
        toast({
          title: "Verifying",
          description: `Back ID document: ${idVerification.backId}`,
          variant: "info"
        });
        
        verificationPromises.push(
          axios.post(`/admin/teachers/${teacherId}/documents/${idVerification.backId}/verify`, {
            verification_status: 'verified',
            verification_notes: 'Verified by admin'
          })
        );
      }

      if (verificationPromises.length === 0) {
        toast({
          title: "Verification Notice",
          description: "No documents need verification or document IDs are missing",
          variant: "info"
        });
        setVerifying(false);
        return;
      }

      await Promise.all(verificationPromises);
      
      toast({
        title: "Verification Success",
        description: "ID documents have been verified",
        variant: "success"
      });
      
      // Refresh documents after verification
      if (refreshDocuments) refreshDocuments();
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Handle document rejection
  const handleRejectID = async () => {
    if (!teacherId || !idVerification.uploaded) {
      toast({
        title: "Rejection Error",
        description: "No ID documents to reject",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifying(true);

      // Reject both front and back ID if available
      const rejectionPromises = [];
      
      if (idVerification.frontId && idVerification.frontVerificationStatus !== 'rejected') {
        toast({
          title: "Rejecting",
          description: `Front ID document: ${idVerification.frontId}`,
          variant: "info"
        });
        
        rejectionPromises.push(
          axios.post(`/admin/teachers/${teacherId}/documents/${idVerification.frontId}/verify`, {
            verification_status: 'rejected',
            verification_notes: 'Rejected by admin'
          })
        );
      }
      
      if (idVerification.backId && idVerification.backVerificationStatus !== 'rejected') {
        toast({
          title: "Rejecting",
          description: `Back ID document: ${idVerification.backId}`,
          variant: "info"
        });
        
        rejectionPromises.push(
          axios.post(`/admin/teachers/${teacherId}/documents/${idVerification.backId}/verify`, {
            verification_status: 'rejected',
            verification_notes: 'Rejected by admin'
          })
        );
      }

      if (rejectionPromises.length === 0) {
        toast({
          title: "Rejection Notice",
          description: "No documents need rejection or document IDs are missing",
          variant: "info"
        });
        setVerifying(false);
        return;
      }

      await Promise.all(rejectionPromises);
      
      toast({
        title: "Rejection Success",
        description: "ID documents have been rejected",
        variant: "success"
      });
      
      // Refresh documents after rejection
      if (refreshDocuments) refreshDocuments();
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Rejection Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Handle certificate verification
  const handleVerifyCertificate = async (certificateId: number) => {
    if (!teacherId || !certificateId) {
      toast({
        title: "Verification Error",
        description: "Certificate ID is required for verification",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifyingCertId(certificateId);
      
      toast({
        title: "Verifying",
        description: `Certificate document: ${certificateId}`,
        variant: "info"
      });
      
      await axios.post(`/admin/teachers/${teacherId}/documents/${certificateId}/verify`, {
        verification_status: 'verified',
        verification_notes: 'Verified by admin'
      });
      
      toast({
        title: "Verification Success",
        description: "Certificate has been verified",
        variant: "success"
      });
      
      // Refresh documents after verification
      if (refreshDocuments) refreshDocuments();
    } catch (error) {
      console.error('Certificate verification error:', error);
      toast({
        title: "Verification Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifyingCertId(null);
    }
  };

  // Handle certificate rejection
  const handleRejectCertificate = async (certificateId: number) => {
    if (!teacherId || !certificateId) {
      toast({
        title: "Rejection Error",
        description: "Certificate ID is required for rejection",
        variant: "destructive"
      });
      return;
    }

    try {
      setVerifyingCertId(certificateId);
      
      toast({
        title: "Rejecting",
        description: `Certificate document: ${certificateId}`,
        variant: "info"
      });
      
      await axios.post(`/admin/teachers/${teacherId}/documents/${certificateId}/verify`, {
        verification_status: 'rejected',
        verification_notes: 'Rejected by admin'
      });
      
      toast({
        title: "Rejection Success",
        description: "Certificate has been rejected",
        variant: "success"
      });
      
      // Refresh documents after rejection
      if (refreshDocuments) refreshDocuments();
    } catch (error) {
      console.error('Certificate rejection error:', error);
      toast({
        title: "Rejection Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setVerifyingCertId(null);
    }
  };

  // Handle document upload
  const handleUpload = async (documentType: string, file: File) => {
    if (!teacherId) {
      toast({
        title: "Upload Error",
        description: "Teacher ID is required for upload",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('document_type', documentType);
      formData.append('file', file);
      
      // Add document-specific data
      if (documentType === 'id_front' || documentType === 'id_back') {
        formData.append('id_type', idType);
      } else if (documentType === 'certificate') {
        const name = prompt('Enter certificate name:', 'Certificate');
        if (name) formData.append('certificate_name', name);
        
        const institution = prompt('Enter institution (optional):');
        if (institution) formData.append('certificate_institution', institution);
      }
      
      // Submit form
      const response = await axios.post(
        `/admin/teachers/${teacherId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      if (response.data.success) {
        toast({
          title: "Upload Successful",
          description: `${getDocumentTypeName(documentType)} has been uploaded successfully`,
          variant: "success"
        });
        
        if (refreshDocuments) refreshDocuments();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to get human-readable document type name
  const getDocumentTypeName = (type: string): string => {
    switch(type) {
      case 'id_front': return 'ID Front';
      case 'id_back': return 'ID Back';
      case 'certificate': return 'Certificate';
      case 'resume': return 'Resume/CV';
      default: return 'Document';
    }
  };
  
  // File input change handler
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      // For certificates, check if this is a re-upload (has a certificate ID)
      if (type === 'certificate') {
        const certificateId = e.target.getAttribute('data-certificate-id');
        console.log('Certificate upload/re-upload. Certificate ID:', certificateId);
      }
      
      handleUpload(type, e.target.files[0]);
      
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // Helper to check if both ID documents are verified
  const areIDsVerified = (): boolean => {
    const frontVerified = idVerification.frontVerificationStatus === 'verified';
    const backVerified = idVerification.backVerificationStatus === 'verified';
    return frontVerified && backVerified;
  };

  // Helper to check if either ID document is rejected
  const areIDsRejected = (): boolean => {
    const frontRejected = idVerification.frontVerificationStatus === 'rejected';
    const backRejected = idVerification.backVerificationStatus === 'rejected';
    return frontRejected || backRejected;
  };

  // Check if a certificate is verified
  const isCertificateVerified = (cert: any): boolean => {
    // Skip check if certificate is not uploaded or doesn't exist
    if (!cert || !cert.uploaded || cert.uploaded === false) return false;
    
    // Skip if no image (no actual file uploaded)
    if (!cert.image) return false;
    
    // Check for various forms of "verified" status (case insensitive)
    if (!cert.verification_status) return false;
    
    return cert.verification_status.toLowerCase() === 'verified';
  };

  // Check if a certificate is rejected
  const isCertificateRejected = (cert: any): boolean => {
    // Skip check if certificate is not uploaded or doesn't exist
    if (!cert || !cert.uploaded || cert.uploaded === false) return false;
    
    // Skip if no image (no actual file uploaded)
    if (!cert.image) return false;
    
    // Check for various forms of "rejected" status (case insensitive)
    if (!cert.verification_status) return false;
    
    return cert.verification_status.toLowerCase() === 'rejected';
  };

  // Get document status display text and color
  const getStatusDisplay = (status?: string): { text: string, color: string } => {
    if (!status || status === 'pending') {
      return { text: '• Pending', color: 'text-yellow-600' };
    } else if (status === 'verified') {
      return { text: '• Verified', color: 'text-green-600' };
    } else if (status === 'rejected') {
      return { text: '• Rejected', color: 'text-red-600' };
    }
    return { text: '', color: '' };
  };

  // Handle certificate re-upload
  const handleReUpload = async (certificateId: number, type: string) => {
    if (!teacherId || !certificateId) {
      toast({
        title: "Re-Upload Error",
        description: "Certificate ID is required for re-upload",
        variant: "destructive"
      });
      return;
    }

    try {
      // Open file dialog
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf';
      
      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files[0]) return;
        
        const file = target.files[0];
        
        try {
          setLoading(true);
          
          // First, delete the existing document
          toast({
            title: "Processing",
            description: "Removing existing certificate...",
            variant: "info"
          });
          
          await axios.delete(`/admin/teachers/${teacherId}/documents/${certificateId}`);
          
          // Then upload the new document
          toast({
            title: "Processing",
            description: "Uploading new certificate...",
            variant: "info"
          });
          
          const formData = new FormData();
          formData.append('document_type', type);
          formData.append('file', file);
          
          if (type === 'certificate') {
            const name = prompt('Enter certificate name:', 'Certificate');
            if (name) formData.append('certificate_name', name);
            
            const institution = prompt('Enter institution (optional):');
            if (institution) formData.append('certificate_institution', institution);
          }
          
          // Submit form
          const response = await axios.post(
            `/admin/teachers/${teacherId}/documents`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
          );
          
          if (response.data.success) {
            toast({
              title: "Re-Upload Successful",
              description: `Certificate has been replaced successfully`,
              variant: "success"
            });
            
            if (refreshDocuments) refreshDocuments();
          }
        } catch (error) {
          console.error('Re-upload error:', error);
          toast({
            title: "Re-Upload Failed",
            description: "There was a problem replacing your document. Please try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      // Trigger file selection
      input.click();
      
    } catch (error) {
      console.error('Re-upload initialization error:', error);
      toast({
        title: "Error",
        description: "Could not initiate re-upload process",
        variant: "destructive"
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: number, documentType: string) => {
    if (!teacherId || !documentId) {
      toast({
        title: "Delete Error",
        description: "Document ID is required for deletion",
        variant: "destructive"
      });
      return;
    }

    // Ask for confirmation before deleting
    if (!confirm(`Are you sure you want to delete this ${documentType}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      
      toast({
        title: "Processing",
        description: `Deleting ${documentType}...`,
        variant: "info"
      });
      
      // Delete document
      await axios.delete(`/admin/teachers/${teacherId}/documents/${documentId}`);
      
      toast({
        title: "Success",
        description: `${documentType} has been deleted successfully`,
        variant: "success"
      });
      
      // Refresh documents after deletion
      if (refreshDocuments) refreshDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 md:mb-6">
        {isAdmin ? `Document Management${teacherId ? ' (Admin)' : ''}` : 'Your Documents'}
      </h2>

      {/* ID Verification Section */}
      <div className="bg-white border rounded-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="mb-4 md:mb-8">
          <h3 className="text-base font-medium inline-flex items-center flex-wrap">
            ID Verification: 
            {idVerification.uploaded && (
              <span className="text-gray-600 ml-1 text-sm flex items-center flex-wrap">
                ✓ Uploaded {idVerification.idType && `(${idVerification.idType})`}
                {areIDsVerified() && (
                  <span className="ml-2 text-green-600">• Verified</span>
                )}
                {areIDsRejected() && (
                  <span className="ml-2 text-red-600">• Rejected</span>
                )}
                {!areIDsVerified() && !areIDsRejected() && (
                  <span className="ml-2 text-yellow-600">• Pending</span>
                )}
              </span>
            )}
          </h3>
          
          {!idVerification.uploaded && (
            <div className="mt-2">
              <label htmlFor="idType" className="block text-sm text-gray-600">ID Type:</label>
              <select 
                id="idType"
                className="mt-1 p-1 border rounded text-sm"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                disabled={loading}
              >
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6">
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <p className="text-lg text-gray-700 mb-2 md:mb-0 md:mr-4 flex items-center">
                Document Front
                {idVerification.frontImage && (
                  <>
                    {idVerification.frontVerificationStatus === 'verified' && (
                      <span className="text-xs text-green-600 ml-2">• Verified</span>
                    )}
                    {idVerification.frontVerificationStatus === 'rejected' && (
                      <span className="text-xs text-red-600 ml-2">• Rejected</span>
                    )}
                    {(!idVerification.frontVerificationStatus || idVerification.frontVerificationStatus === 'pending') && (
                      <span className="text-xs text-yellow-600 ml-2">• Pending</span>
                    )}
                  </>
                )}
              </p>
              
              <label className={`bg-gray-100 rounded-md w-full md:w-60 h-40 flex items-center justify-center cursor-pointer overflow-hidden relative ${loading ? 'opacity-50' : ''}`}>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'id_front')}
                  disabled={loading}
                />
                
                {idVerification.frontImage ? (
                  <img 
                    src={getDocumentUrl(idVerification.frontImage, idVerification.frontUrl)}
                    alt="ID Front" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                      <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                    </svg>
                    <span className="sr-only">Upload ID Front</span>
                  </>
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </label>
=======
  };
}

const Documents: React.FC<DocumentsProps> = ({
  idVerification = { uploaded: true, idType: 'NIN Card' },
  certificates = [
    { id: 1, name: 'Quran Memorization Certificate (Al-Azhar)', image: '/placeholder.jpg', uploaded: true },
    { id: 2, name: 'Ijazah in Tajweed', image: '/placeholder.jpg', uploaded: true }
  ],
  resume = { uploaded: true, file: 'CV.pdf' }
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Document Section</h2>

      {/* ID Verification Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-8">
          <h3 className="text-base font-medium inline-flex items-center">
            ID Verification: 
            {idVerification.uploaded && (
              <span className="text-gray-600 ml-1 text-sm flex items-center">
                ✓ Uploaded {idVerification.idType && `(${idVerification.idType})`}
              </span>
            )}
          </h3>
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex-1 mr-4">
            <div className="flex items-center">
              <p className="text-xl text-gray-700 mr-10">Document Front</p>
              <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                  <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                </svg>
              </div>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
            </div>
          </div>

          <div className="flex-1">
<<<<<<< HEAD
            <div className="flex flex-col md:flex-row md:items-center">
              <p className="text-lg text-gray-700 mb-2 md:mb-0 md:mr-4 flex items-center">
                Document Back
                {idVerification.backImage && (
                  <>
                    {idVerification.backVerificationStatus === 'verified' && (
                      <span className="text-xs text-green-600 ml-2">• Verified</span>
                    )}
                    {idVerification.backVerificationStatus === 'rejected' && (
                      <span className="text-xs text-red-600 ml-2">• Rejected</span>
                    )}
                    {(!idVerification.backVerificationStatus || idVerification.backVerificationStatus === 'pending') && (
                      <span className="text-xs text-yellow-600 ml-2">• Pending</span>
                    )}
                  </>
                )}
              </p>
              
              <label className={`bg-gray-100 rounded-md w-full md:w-60 h-40 flex items-center justify-center cursor-pointer overflow-hidden relative ${loading ? 'opacity-50' : ''}`}>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'id_back')}
                  disabled={loading}
                />
                
                {idVerification.backImage ? (
                  <img 
                    src={getDocumentUrl(idVerification.backImage, idVerification.backUrl)}
                    alt="ID Back" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                      <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                    </svg>
                    <span className="sr-only">Upload ID Back</span>
                  </>
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </label>
=======
            <div className="flex items-center">
              <p className="text-xl text-gray-700 mr-10">Document Back</p>
              <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                  <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                </svg>
              </div>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex flex-wrap justify-center gap-2">
          <button 
            className={`text-sm px-4 py-2 rounded ${loading ? 'bg-gray-300 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => {
              if (idVerification.frontId) {
                handleReUpload(idVerification.frontId, 'id_front');
              } else {
                const frontInput = document.querySelector('input[accept="image/*"]:first-of-type') as HTMLInputElement;
                if (frontInput) frontInput.click();
              }
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : idVerification.frontId ? 'Replace Front ID' : 'Upload Front ID'}
          </button>
          
          <button 
            className={`text-sm px-4 py-2 rounded ${loading ? 'bg-gray-300 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => {
              if (idVerification.backId) {
                handleReUpload(idVerification.backId, 'id_back');
              } else {
                const backInput = document.querySelector('input[accept="image/*"]:last-of-type') as HTMLInputElement;
                if (backInput) backInput.click();
              }
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : idVerification.backId ? 'Replace Back ID' : 'Upload Back ID'}
          </button>
          
          {isAdmin && idVerification.uploaded && !areIDsVerified() && !areIDsRejected() && (
            <>
              <button 
                className={`text-green-600 text-sm px-4 py-2 rounded border border-green-600 hover:bg-green-50 ${verifying ? 'opacity-50' : ''}`}
                onClick={handleVerifyID}
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Verify ID'}
              </button>
              
              <button 
                className={`text-red-600 text-sm px-4 py-2 rounded border border-red-600 hover:bg-red-50 ${verifying ? 'opacity-50' : ''}`}
                onClick={handleRejectID}
                disabled={verifying}
              >
                {verifying ? 'Processing...' : 'Reject ID'}
              </button>
            </>
          )}
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {idVerification.frontId && (
              <button 
                className="text-red-600 text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                onClick={() => handleDeleteDocument(idVerification.frontId!, 'ID Front')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete Front ID'}
              </button>
            )}
            
            {idVerification.backId && (
              <button 
                className="text-red-600 text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                onClick={() => handleDeleteDocument(idVerification.backId!, 'ID Back')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete Back ID'}
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Certificates Section */}
      <div className="bg-white border rounded-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="mb-4 md:mb-8">
=======
        <div className="flex justify-end">
          <button className="text-gray-600 mr-4 text-sm">Re-upload</button>
          <button className="text-green-600 text-sm">Verify certificates</button>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-8">
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
          <h3 className="text-base font-medium inline-flex items-center">
            Certificates: 
            {certificates.some(cert => cert.uploaded) && (
              <span className="text-gray-600 ml-1 text-sm flex items-center">
                ✓ Uploaded
              </span>
            )}
          </h3>
        </div>

<<<<<<< HEAD
        <div className="flex flex-wrap justify-between mb-4 md:mb-6">
          {/* Map through certificates */}
          {certificates.map((certificate, index) => (
            <div key={certificate.id || index} id={`certificate-container-${certificate.id}`} className="w-full sm:w-1/2 mb-6 pr-0 sm:pr-3">
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="text-green-600 text-sm mb-2 sm:mb-0 sm:mr-auto flex items-center">
                    {certificate.name}
                    {certificate.uploaded && (
                      <>
                        {isCertificateVerified(certificate) && (
                          <span className="text-xs text-green-600 ml-2">• Verified</span>
                        )}
                        {isCertificateRejected(certificate) && (
                          <span className="text-xs text-red-600 ml-2">• Rejected</span>
                        )}
                        {!isCertificateVerified(certificate) && !isCertificateRejected(certificate) && (
                          <span className="text-xs text-yellow-600 ml-2">• Pending</span>
                        )}
                      </>
                    )}
                  </p>
                  
                  <label className="bg-gray-100 rounded-md w-full sm:w-60 h-40 flex items-center justify-center cursor-pointer overflow-hidden relative mx-auto sm:mx-0">
                    <input 
                      type="file" 
                      className="hidden" 
                      id={`certificate-input-${certificate.id}`}
                      data-certificate-id={certificate.id}
                      accept="image/*,.pdf"
                      onChange={(e) => onFileChange(e, 'certificate')}
                      disabled={loading}
                    />
                    
                    {certificate.image ? (
                      isImageFile(certificate.image) ? (
                        <img 
                          src={getDocumentUrl(certificate.image, certificate.url)}
                          alt={certificate.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        // Handle non-image files with appropriate icons
                        <div className="flex flex-col items-center justify-center h-full">
                          {getFileExtension(certificate.image) === 'pdf' ? (
                            // PDF icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                              <path fill="#e53935" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                              <path fill="#ffebee" d="M14 3v5h5v12H6V3h8z"/>
                              <path fill="#e53935" d="M13.5 14.5c0 .83-.67 1.5-1.5 1.5v.5h1v1h-3v-1h1V16c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2zm-1-2H11v2h1.5v-2z"/>
                              <path fill="#e53935" d="M14 3v5h5l-5-5z"/>
                            </svg>
                          ) : (
                            // Generic document icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                              <path fill="#607d8b" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                              <path fill="#eceff1" d="M14 3v5h5v12H6V3h8z"/>
                              <path fill="#607d8b" d="M14 3v5h5l-5-5z"/>
                              <path fill="#607d8b" d="M11.5 14.5h-2v-1h2v1zm2 2h-4v-1h4v1zm0-3h-2v-1h2v1z"/>
                            </svg>
                          )}
                          <span className="text-xs mt-2 font-medium text-gray-600">
                            {getFileExtension(certificate.image).toUpperCase()} File
                          </span>
                        </div>
                      )
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9.5 14.5H9a.5.5 0 0 0 .8.4zm2-1.5l.3-.4a.5.5 0 0 0-.6 0zm2 1.5l-.3.4a.5.5 0 0 0 .8-.4zm-2-3.5A2.5 2.5 0 0 1 9 8.5H8a3.5 3.5 0 0 0 3.5 3.5zM14 8.5a2.5 2.5 0 0 1-2.5 2.5v1A3.5 3.5 0 0 0 15 8.5zM11.5 6A2.5 2.5 0 0 1 14 8.5h1A3.5 3.5 0 0 0 11.5 5zm0-1A3.5 3.5 0 0 0 8 8.5h1A2.5 2.5 0 0 1 11.5 6zM9 10.5v4h1v-4zm.8 4.4l2-1.5l-.6-.8l-2 1.5zm1.4-1.5l2 1.5l.6-.8l-2-1.5zm2.8 1.1v-4h-1v4zM15 5V1.5h-1V5zm-1.5-5h-12v1h12zM0 1.5v12h1v-12zM1.5 15H8v-1H1.5zM0 13.5A1.5 1.5 0 0 0 1.5 15v-1a.5.5 0 0 1-.5-.5zM1.5 0A1.5 1.5 0 0 0 0 1.5h1a.5.5 0 0 1 .5-.5zM15 1.5A1.5 1.5 0 0 0 13.5 0v1a.5.5 0 0 1 .5.5zM3 5h5V4H3z"/>
                        </svg>
                        <span className="sr-only">Upload Certificate</span>
                      </>
                    )}
                  </label>
                </div>
                <div className="flex justify-center mt-4">
                  {certificate.image && (
                    <>
                      <button 
                        className="text-blue-600 text-sm mr-4"
                        onClick={() => {
                          setViewingDocument({
                            open: true,
                            title: certificate.name,
                            path: certificate.image,
                            url: certificate.url,
                            isImage: isImageFile(certificate.image),
                            extension: getFileExtension(certificate.image)
                          });
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="text-gray-600 text-sm mr-4"
                        onClick={() => handleReUpload(certificate.id, 'certificate')}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Re-Upload'}
                      </button>
                      
                      {isAdmin && certificate.id && (
                        <>
                          <button 
                            className="text-red-600 text-sm mr-4"
                            onClick={() => handleDeleteDocument(certificate.id, 'Certificate')}
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'Delete'}
                          </button>
                          
                          {!isCertificateVerified(certificate) && !isCertificateRejected(certificate) && (
                            <div className="flex mt-2">
                              <button 
                                className="text-green-600 text-sm px-3 py-1 mr-2 rounded border border-green-600 hover:bg-green-50"
                                onClick={() => handleVerifyCertificate(certificate.id)}
                                disabled={verifyingCertId === certificate.id}
                              >
                                {verifyingCertId === certificate.id ? 'Verifying...' : 'Verify'}
                              </button>
                              
                              <button 
                                className="text-red-600 text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectCertificate(certificate.id)}
                                disabled={verifyingCertId === certificate.id}
                              >
                                {verifyingCertId === certificate.id ? 'Processing...' : 'Reject'}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add certificate button if none or only one exists */}
          {certificates.length < 1 && (
            <div className="w-full flex justify-center">
              <input 
                type="file" 
                id="add-first-certificate-input"
                className="hidden" 
                accept="image/*,.pdf"
                onChange={(e) => onFileChange(e, 'certificate')}
                disabled={loading}
              />
              <button 
                className="text-blue-600 text-sm px-4 py-2 border border-blue-600 rounded hover:bg-blue-50"
                onClick={() => {
                  const input = document.getElementById('add-first-certificate-input');
                  if (input) {
                    input.click();
                  } else {
                    toast({
                      title: "Error",
                      description: "Could not find file input element",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={loading}
              >
                Add Certificate
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          {certificates.length > 0 && (
            <>
              <input 
                type="file" 
                id="add-certificate-input"
                className="hidden" 
                accept="image/*,.pdf"
                onChange={(e) => onFileChange(e, 'certificate')}
                disabled={loading}
              />
              <button 
                className="text-blue-600 text-sm px-4 py-2 border border-blue-600 rounded hover:bg-blue-50"
                onClick={() => {
                  const input = document.getElementById('add-certificate-input');
                  if (input) {
                    input.click();
                  } else {
                    toast({
                      title: "Error",
                      description: "Could not find file input element",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={loading}
              >
                Add Another Certificate
              </button>
            </>
=======
        <div className="flex justify-between mb-6">
          {certificates.length >= 1 && (
            <div className="flex-1 mr-4">
              <div className="flex items-center">
                <p className="text-green-600 text-sm mr-auto">{certificates[0].name}</p>
                <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                    <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button className="text-green-600 text-sm mr-4">View</button>
                <button className="text-gray-600 text-sm">Re-Upload</button>
              </div>
            </div>
          )}

          {certificates.length >= 2 && (
            <div className="flex-1">
              <div className="flex items-center">
                <p className="text-green-600 text-sm mr-auto">{certificates[1].name}</p>
                <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                    <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button className="text-green-600 text-sm mr-4">View</button>
                <button className="text-gray-600 text-sm">Re-Upload</button>
              </div>
            </div>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
          )}
        </div>
      </div>

      {/* CV/Resume Section */}
<<<<<<< HEAD
      <div className="bg-white border rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
          <div className="flex items-center mb-2 sm:mb-0">
            <h3 className="text-base font-medium">CV/Resume: </h3>
            {resume.uploaded && (
              <span className="text-gray-600 ml-1 text-sm flex items-center flex-wrap">
                ✓ Uploaded
                {resume.file && (
                  <>
                    {resume.verification_status === 'verified' && (
                      <span className="ml-2 text-green-600">• Verified</span>
                    )}
                    {resume.verification_status === 'rejected' && (
                      <span className="ml-2 text-red-600">• Rejected</span>
                    )}
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <label className="bg-gray-100 rounded-md w-full sm:w-80 h-48 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileChange(e, 'resume')}
              disabled={loading}
            />
            
            {resume.uploaded && resume.file ? (
              <>
                <div className="flex items-center justify-center h-32 w-full">
                  {isImageFile(resume.file) ? (
                    <img 
                      src={getDocumentUrl(resume.file, resume.url)}
                      alt="Resume" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      {getFileExtension(resume.file) === 'pdf' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                          <path fill="#e53935" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <path fill="#ffebee" d="M14 3v5h5v12H6V3h8z"/>
                          <path fill="#e53935" d="M13.5 14.5c0 .83-.67 1.5-1.5 1.5v.5h1v1h-3v-1h1V16c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2zm-1-2H11v2h1.5v-2z"/>
                          <path fill="#e53935" d="M14 3v5h5l-5-5z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
                          <path fill="#2196f3" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <path fill="#e3f2fd" d="M14 3v5h5v12H6V3h8z"/>
                          <path fill="#2196f3" d="M14 3v5h5l-5-5z"/>
                          <path fill="#2196f3" d="M11.15 15H12.5l-1.6-6h-1.8L7.5 15h1.35l.35-1.5h1.6l.35 1.5zm-1.7-4.5l.6 2h-1.2l.6-2z"/>
                        </svg>
                      )}
                    </>
                  )}
                </div>
                <div className="text-center px-4">
                  <p className="text-green-600 text-sm font-medium truncate max-w-full">
                    {resume.file.split('/').pop()} ({getFileExtension(resume.file).toUpperCase()})
                  </p>
                </div>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="104" height="104" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 4.5A1.25 1.25 0 1 0 8 2a1.25 1.25 0 0 0 0 2.5"/>
                  <path fill="currentColor" d="M8 4.5c.597 0 1.13.382 1.32.949l.087.26a.22.22 0 0 1-.21.291h-2.39a.222.222 0 0 1-.21-.291l.087-.26a1.39 1.39 0 0 1 1.32-.949zm-3 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m.5 1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                  <path fill="currentColor" fillRule="evenodd" d="M2.33 1.64c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3 3 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.8c0-1.68 0-2.52-.327-3.16A3 3 0 0 0 12.36.33C11.718.003 10.88.003 9.2.003H6.8c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31m6.87-.638H6.8c-.857 0-1.44 0-1.89.038c-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819c-.037.45-.038 1.03-.038 1.89v6.4c0 .857.001 1.44.038 1.89c.036.438.101.663.18.819c.192.376.498.682.874.874c.156.08.381.145.819.18c.45.036 1.03.037 1.89.037h2.4c.857 0 1.44 0 1.89-.037c.438-.036.663-.101.819-.18c.376-.192.682-.498.874-.874c.08-.156.145-.381.18-.82c.037-.45.038-1.03.038-1.89v-6.4c0-.856-.001-1.44-.038-1.89c-.036-.437-.101-.662-.18-.818a2 2 0 0 0-.874-.874c-.156-.08-.381-.145-.819-.18c-.45-.037-1.03-.038-1.89-.038" clipRule="evenodd"/>
                </svg>
                <p className="text-gray-500 mt-2">Click to upload CV/Resume</p>
              </>
            )}
          </label>
        </div>

        <div className="flex justify-center">
          {resume.uploaded && resume.file && (
            <>
              <button 
                className="text-green-600 text-sm mr-4"
                onClick={() => {
                  setViewingDocument({
                    open: true,
                    title: "Resume/CV",
                    path: resume.file,
                    url: resume.url,
                    isImage: isImageFile(resume.file || ''),
                    extension: getFileExtension(resume.file || '')
                  });
                }}
              >
                View {resume.file?.split('/').pop()}
              </button>
              <button 
                className="text-gray-600 text-sm mr-4"
                onClick={() => resume.id ? handleReUpload(resume.id, 'resume') : null}
                disabled={loading || !resume.id}
              >
                {loading ? 'Processing...' : 'Replace Resume'}
              </button>
              
              {isAdmin && resume.id && (
                <>
                  {resume.verification_status !== 'verified' && resume.verification_status !== 'rejected' && (
                    <div className="flex mt-2">
                      <button 
                        className="text-green-600 text-sm px-3 py-1 mr-2 rounded border border-green-600 hover:bg-green-50"
                        onClick={async () => {
                          if (!teacherId || !resume.id) return;
                          
                          try {
                            setVerifying(true);
                            await axios.post(`/admin/teachers/${teacherId}/documents/${resume.id}/verify`, {
                              verification_status: 'verified',
                              verification_notes: 'Resume verified by admin'
                            });
                            
                            toast({
                              title: "Verification Success",
                              description: "Resume has been verified",
                              variant: "success"
                            });
                            
                            if (refreshDocuments) refreshDocuments();
                          } catch (error) {
                            console.error('Resume verification error:', error);
                            toast({
                              title: "Verification Failed",
                              description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                              variant: "destructive"
                            });
                          } finally {
                            setVerifying(false);
                          }
                        }}
                        disabled={verifying}
                      >
                        {verifying ? 'Verifying...' : 'Verify Resume'}
                      </button>
                      
                      <button 
                        className="text-red-600 text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                        onClick={async () => {
                          if (!teacherId || !resume.id) return;
                          
                          try {
                            setVerifying(true);
                            await axios.post(`/admin/teachers/${teacherId}/documents/${resume.id}/verify`, {
                              verification_status: 'rejected',
                              verification_notes: 'Resume rejected by admin'
                            });
                            
                            toast({
                              title: "Rejection Success",
                              description: "Resume has been rejected",
                              variant: "success"
                            });
                            
                            if (refreshDocuments) refreshDocuments();
                          } catch (error) {
                            console.error('Resume rejection error:', error);
                            toast({
                              title: "Rejection Failed",
                              description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                              variant: "destructive"
                            });
                          } finally {
                            setVerifying(false);
                          }
                        }}
                        disabled={verifying}
                      >
                        {verifying ? 'Processing...' : 'Reject Resume'}
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="text-red-600 text-sm mt-3"
                    onClick={() => handleDeleteDocument(resume.id!, 'Resume')}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Delete Resume'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewingDocument.open}
        onClose={() => setViewingDocument(prev => ({ ...prev, open: false }))}
        title={viewingDocument.title}
        path={viewingDocument.path}
        url={viewingDocument.url}
        isImage={viewingDocument.isImage}
        extension={viewingDocument.extension}
        getDocumentUrl={getDocumentUrl}
      />
=======
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-base font-medium">CV/Resume: </h3>
            {resume.uploaded && (
              <span className="text-gray-600 ml-1 text-sm flex items-center">
                ✓ Uploaded
              </span>
            )}
          </div>
          {resume.file && (
            <button className="text-green-600 text-sm">Download CV.pdf</button>
          )}
        </div>
      </div>
>>>>>>> a27505c68686d606cd7863d0cd73ed8724ccd717
    </div>
  );
};

export default Documents;
