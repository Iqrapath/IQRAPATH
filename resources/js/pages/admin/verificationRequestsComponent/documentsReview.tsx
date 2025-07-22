import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentType {
  id: number;
  document_type: string;
  file_path: string;
  verification_status: string;
}

interface DocumentsReviewProps {
  documents: DocumentType[];
  onVerifyDocument?: (documentId: number) => void;
  onRejectDocument?: (documentId: number) => void;
  onViewDocument?: (documentId: number) => void;
}

const DocumentsReview: React.FC<DocumentsReviewProps> = ({
  documents,
  onVerifyDocument,
  onRejectDocument,
  onViewDocument
}) => {
  const { toast } = useToast();

  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'id_front':
        return 'ID Card (Front)';
      case 'id_back':
        return 'ID Card (Back)';
      case 'certificate':
        return 'Teaching Certificate';
      case 'resume':
        return 'Resume/CV';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  const handleDownload = (doc: DocumentType) => {
    try {
      // Create a temporary anchor element
      const link = window.document.createElement('a');
      link.href = doc.file_path;
      link.target = '_blank';
      link.download = doc.file_path.split('/').pop() || 'document';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your document download has started",
        variant: "success",
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "Could not download the document",
        variant: "destructive",
      });
    }
  };

  const viewDocument = (document: DocumentType) => {
    if (onViewDocument) {
      onViewDocument(document.id);
    } else {
      window.open(document.file_path, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Documents Review Panel</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getDocumentTypeName(doc.document_type)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {doc.file_path.split('/').pop() || 'Document'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(doc.verification_status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewDocument(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                        {onVerifyDocument && doc.verification_status !== 'verified' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => onVerifyDocument(doc.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Verify
                          </Button>
                        )}
                        {onRejectDocument && doc.verification_status !== 'rejected' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => onRejectDocument(doc.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No documents found for this verification request.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsReview; 