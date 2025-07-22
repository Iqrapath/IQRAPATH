import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

interface RegisteredChild {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface ChildRegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  onSetupTeachers: () => void;
  children: RegisteredChild[];
}

export function ChildRegistrationSuccessModal({
  isOpen,
  onClose,
  onGoToDashboard,
  onSetupTeachers,
  children,
}: ChildRegistrationSuccessModalProps) {
  const [copiedIds, setCopiedIds] = useState<number[]>([]);

  const copyToClipboard = (text: string, childId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIds([...copiedIds, childId]);
      setTimeout(() => {
        setCopiedIds(copiedIds.filter(id => id !== childId));
      }, 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              Children Successfully Registered!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {children.length === 1
                ? "Your child has been registered successfully."
                : `${children.length} children have been registered successfully.`}
            </DialogDescription>
          </DialogHeader>

          {children.length > 0 && (
            <div className="w-full mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Login Information:</h3>
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{child.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">Login email: {child.email}</p>
                      <button
                        onClick={() => copyToClipboard(child.email, child.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy email"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">Password: {child.password}</p>
                      <button
                        onClick={() => copyToClipboard(child.password, child.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy password"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    {copiedIds.includes(child.id) && (
                      <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please save this information for your records. Your children can use these credentials to log in.
              </p>
            </div>
          )}

          <div className="flex flex-col w-full space-y-3">
            <Button
              onClick={onSetupTeachers}
              className="bg-[#2c7870] hover:bg-[#236158] text-white w-full"
            >
              Find Teachers for My Children
            </Button>
            <Button
              variant="outline"
              onClick={onGoToDashboard}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
