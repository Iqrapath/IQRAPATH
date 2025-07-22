import React, { useState } from 'react';
import { MoreVertical, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PayoutRequest {
  id: number;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  payment_details: any;
}

interface PayoutRequestsProps {
  payoutRequests: PayoutRequest[];
  onApproveRequest?: (id: number) => void;
  onDeclineRequest?: (id: number) => void;
}

const PayoutRequests: React.FC<PayoutRequestsProps> = ({ 
  payoutRequests, 
  onApproveRequest, 
  onDeclineRequest 
}) => {
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0).replace('NGN', '');
  };

  const formatPaymentMethod = (method: string) => {
    if (method === 'bank_transfer') return 'Bank Transfer (GTB)';
    if (method === 'paypal') return 'PayPal';
    return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-500';
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSelectRequest = (id: number) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(reqId => reqId !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(payoutRequests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleApprove = (id: number) => {
    if (onApproveRequest) {
      onApproveRequest(id);
    }
    setOpenActionId(null);
  };

  const handleDecline = (id: number) => {
    if (onDeclineRequest) {
      onDeclineRequest(id);
    }
    setOpenActionId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Payout Requests</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300"
                  onChange={handleSelectAll}
                  checked={selectedRequests.length === payoutRequests.length && payoutRequests.length > 0}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payoutRequests && payoutRequests.length > 0 ? (
              payoutRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {formatCurrency(request.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPaymentMethod(request.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(request.status)} capitalize`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.status === 'pending' ? (
                      <Popover open={openActionId === request.id} onOpenChange={(open) => {
                        if (open) setOpenActionId(request.id);
                        else setOpenActionId(null);
                      }}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0" align="end">
                          <div className="flex flex-col">
                            <Button 
                              variant="ghost" 
                              className="flex items-center justify-start px-4 py-2 hover:bg-green-50 text-green-600"
                              onClick={() => handleApprove(request.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve Request
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="flex items-center justify-start px-4 py-2 hover:bg-red-50 text-red-600"
                              onClick={() => handleDecline(request.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Decline Request
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No payout requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutRequests; 