import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: number;
    document_type: string;
    file_path: string;
    verification_status: string;
  } | null;
  onVerify?: (documentId: number) => void;
  onReject?: (documentId: number) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
  onVerify,
  onReject
}) => {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    if (!document) return;
    
    try {
      // Create a temporary anchor element
      const link = window.document.createElement('a');
      link.href = document.file_path;
      link.target = '_blank';
      link.download = document.file_path.split('/').pop() || 'document';
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

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

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

  const getFileExtension = (filePath: string): string => {
    return filePath.split('.').pop()?.toLowerCase() || '';
  };

  const renderDocumentPreview = () => {
    if (!document) return null;
    
    const extension = getFileExtension(document.file_path);
    const style = {
      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease'
    };
    
    if (['pdf'].includes(extension)) {
      return (
        <iframe 
          src={`${document.file_path}#toolbar=0&navpanes=0`}
          className="w-full h-[500px] border-0"
          title="Document Preview"
        />
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return (
        <div className="flex justify-center overflow-hidden h-[500px]">
          <img 
            src={document.file_path} 
            alt="Document Preview" 
            className="object-contain"
            style={style}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-600">Preview not available</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" /> Download to View
          </Button>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? getDocumentTypeName(document.document_type) : 'Document Viewer'}
          </DialogTitle>
        </DialogHeader>
        
        {document && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  File: {document.file_path.split('/').pop()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {zoom}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={rotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {renderDocumentPreview()}
            </div>
            
            <DialogFooter className="mt-4 flex justify-between">
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
              <div className="flex space-x-2">
                {onReject && document.verification_status !== 'rejected' && (
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      onReject(document.id);
                      onClose();
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject Document
                  </Button>
                )}
                {onVerify && document.verification_status !== 'verified' && (
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      onVerify(document.id);
                      onClose();
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Verify Document
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer; 