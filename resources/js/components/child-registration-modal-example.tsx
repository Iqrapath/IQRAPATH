import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChildRegistrationModal } from "@/components/ui/child-registration-modal";

export default function ChildRegistrationModalExample() {
  const [open, setOpen] = useState(false);
  const [childrenData, setChildrenData] = useState<any[]>([]);

  const handleSaveChildData = (data: any[]) => {
    setChildrenData(data);
    console.log("Children data saved:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Child Registration Example</h1>

      <Button
        onClick={() => setOpen(true)}
        className="bg-[#2c7870] hover:bg-[#236158] text-white"
      >
        Register Children
      </Button>

      {childrenData.length > 0 && (
        <div className="mt-8 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Registered Children:</h2>
          {childrenData.map((child, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">{child.fullName || `Child ${index + 1}`}</h3>
              <p><strong>Age:</strong> {child.age || "Not provided"}</p>
              <p><strong>Gender:</strong> {child.gender || "Not provided"}</p>
              <p><strong>Subjects:</strong> {child.subjects.length > 0
                ? child.subjects.join(", ")
                : "None selected"}
              </p>
              <p><strong>Learning Times:</strong> {child.learningTimes.length > 0
                ? child.learningTimes.join(", ")
                : "None selected"}
              </p>
            </div>
          ))}
        </div>
      )}

      <ChildRegistrationModal
        open={open}
        onOpenChange={setOpen}
        onSave={handleSaveChildData}
      />
    </div>
  );
}
