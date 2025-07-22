import React from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  path?: string;
  url?: string;
  isImage: boolean;
  extension?: string;
  getDocumentUrl: (path?: string, directUrl?: string) => string;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  path,
  url,
  isImage,
  extension,
  getDocumentUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center">
          {isImage ? (
            <img 
              src={getDocumentUrl(path, url)} 
              alt={title}
              className="max-w-full max-h-[70vh] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              {extension === 'pdf' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                    <path fill="#e53935" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path fill="#ffebee" d="M14 3v5h5v12H6V3h8z"/>
                    <path fill="#e53935" d="M13.5 14.5c0 .83-.67 1.5-1.5 1.5v.5h1v1h-3v-1h1V16c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v2zm-1-2H11v2h1.5v-2z"/>
                    <path fill="#e53935" d="M14 3v5h5l-5-5z"/>
                  </svg>
                  <p className="mt-4 text-lg">PDF Document</p>
                  <a 
                    href={getDocumentUrl(path, url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-600 hover:underline px-4 py-2 border border-blue-600 rounded"
                  >
                    Open PDF in New Tab
                  </a>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                    <path fill="#607d8b" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path fill="#eceff1" d="M14 3v5h5v12H6V3h8z"/>
                    <path fill="#607d8b" d="M14 3v5h5l-5-5z"/>
                    <path fill="#607d8b" d="M11.5 14.5h-2v-1h2v1zm2 2h-4v-1h4v1zm0-3h-2v-1h2v1z"/>
                  </svg>
                  <p className="mt-4 text-lg">{extension?.toUpperCase()} Document</p>
                  <a 
                    href={getDocumentUrl(path, url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-600 hover:underline px-4 py-2 border border-blue-600 rounded"
                  >
                    Download Document
                  </a>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal; 