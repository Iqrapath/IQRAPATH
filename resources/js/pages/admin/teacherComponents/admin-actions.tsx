import React, { useState } from 'react';

interface AdminActionsProps {
  onApprove?: () => void;
  onSendMessage?: (message: string) => void;
  onReject?: (reason: string) => void;
  onDelete?: () => void;
  isProcessing?: boolean;
}

const AdminActions: React.FC<AdminActionsProps> = ({
  onApprove,
  onSendMessage,
  onReject,
  onDelete,
  isProcessing = false
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveConfirm = () => {
    if (onApprove) onApprove();
    setShowApproveModal(false);
  };

  const handleSendMessageConfirm = () => {
    if (onSendMessage && message.trim()) onSendMessage(message.trim());
    setMessage('');
    setShowMessageModal(false);
  };

  const handleRejectConfirm = () => {
    if (onReject && rejectReason.trim()) onReject(rejectReason.trim());
    setRejectReason('');
    setShowRejectModal(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) onDelete();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setShowApproveModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-full transition duration-200"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Approve'}
        </button>
        
        <button
          onClick={() => setShowMessageModal(true)}
          className="border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-3 px-8 rounded-full transition duration-200"
          disabled={isProcessing}
        >
          Send Message
        </button>
        
        <button
          onClick={() => setShowRejectModal(true)}
          className="text-gray-800 hover:text-gray-600 font-medium py-3 px-4 transition duration-200"
          disabled={isProcessing}
        >
          Reject
        </button>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-red-500 hover:text-red-700 font-medium py-3 px-4 transition duration-200"
          disabled={isProcessing}
        >
          Delete Account
        </button>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this teacher? They will be able to start teaching immediately.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleApproveConfirm}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Send Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 min-h-[120px]"
              disabled={isProcessing}
            />
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendMessageConfirm}
                disabled={!message.trim() || isProcessing}
                className={`px-4 py-2 rounded ${
                  message.trim() && !isProcessing
                    ? 'bg-teal-600 text-white hover:bg-teal-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this teacher:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 min-h-[100px]"
              disabled={isProcessing}
            />
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim() || isProcessing}
                className={`px-4 py-2 rounded ${
                  rejectReason.trim() && !isProcessing
                    ? 'bg-gray-800 text-white hover:bg-gray-900' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this teacher account? This action cannot be undone.
            </p>
            <p className="text-red-500 font-medium mb-6">
              All associated data will be permanently removed.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminActions;
