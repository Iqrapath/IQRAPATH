import React, { useState } from 'react';

interface DocumentsProps {
  idVerification?: {
    uploaded: boolean;
    idType?: string;
    frontImage?: string;
    backImage?: string;
  };
  certificates?: Array<{
    id: number;
    name: string;
    image: string;
    uploaded: boolean;
  }>;
  resume?: {
    uploaded: boolean;
    file?: string;
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
                {idVerification.frontImage ? (
                  <img src={idVerification.frontImage} alt="ID Front" className="w-full h-full object-contain" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                    <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <p className="text-xl text-gray-700 mr-10">Document Back</p>
              <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                {idVerification.backImage ? (
                  <img src={idVerification.backImage} alt="ID Back" className="w-full h-full object-contain" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                    <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-8">
          <h3 className="text-base font-medium inline-flex items-center">
            Certificates: 
            {certificates.some(cert => cert.uploaded) && (
              <span className="text-gray-600 ml-1 text-sm flex items-center">
                ✓ Uploaded
              </span>
            )}
          </h3>
        </div>

        <div className="flex justify-between mb-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="flex-1 mr-4">
              <div className="flex items-center">
                <p className="text-green-600 text-sm mr-auto">{certificate.name}</p>
                <div className="bg-gray-100 rounded-md w-60 h-40 flex items-center justify-center">
                  {certificate.image ? (
                    <img src={certificate.image} alt={certificate.name} className="w-full h-full object-contain" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                      <path fill="currentColor" className="text-gray-400" d="M14.154 12.462h4.077v-1h-4.077zm0-2.77h4.077v-1h-4.077zm-8.385 5.616h6.616v-.166q0-.875-.88-1.355t-2.428-.48t-2.429.48t-.879 1.355zm3.308-3.616q.633 0 1.066-.433q.434-.434.434-1.067t-.434-1.066t-1.066-.434t-1.066.434t-.434 1.066t.434 1.067t1.066.433M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button className="text-green-600 text-sm mr-4">View</button>
                <button className="text-gray-600 text-sm">Re-Upload</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CV/Resume Section */}
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
    </div>
  );
};

export default Documents;
