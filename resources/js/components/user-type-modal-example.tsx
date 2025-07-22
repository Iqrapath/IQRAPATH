import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTypeModal } from "@/components/ui/user-type-modal";

export default function UserTypeModalExample() {
  const [open, setOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
    setOpen(false);
    console.log(`Selected user type: ${userType}`);
    // Here you would typically redirect the user to the appropriate registration flow
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">User Type Selection Example</h1>

      {selectedUserType ? (
        <div className="mb-4 text-center">
          <p className="text-lg">
            You selected: <span className="font-medium">{selectedUserType}</span>
          </p>
          <Button
            className="mt-2"
            onClick={() => setOpen(true)}
          >
            Change Selection
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
        >
          Select User Type
        </Button>
      )}

      <UserTypeModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleUserTypeSelect}
      />
    </div>
  );
}
