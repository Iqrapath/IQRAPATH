import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface UserTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (userType: string) => void;
}

export function UserTypeModal({ open, onOpenChange, onSelect }: UserTypeModalProps) {
  const userTypes: UserTypeOption[] = [
    {
      id: "student",
      title: "I'm a Student",
      description: "(Learning for myself)",
      icon: (
        <div className="bg-[#e3f1ef] rounded-full p-4 w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L3 8L12 12L21 8L12 4Z" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 8V16L12 20L21 16V8" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ),
    },
    {
      id: "guardian",
      title: "I'm a Guardian",
      description: "(Registering for my child/children)",
      icon: (
        <div className="bg-[#e3f1ef] rounded-full p-4 w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2c7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader className="pt-2 pb-4">
          <DialogTitle className="text-2xl font-semibold text-center">
            How do you want to use this platform?
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Kindly select how you like to use Iqrapath for learning
          </p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {userTypes.map((type) => (
            <button
              key={type.id}
              className="flex items-center gap-4 p-5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => onSelect(type.id)}
            >
              {type.icon}
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{type.title}</h3>
                <p className="text-gray-500 text-sm">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
