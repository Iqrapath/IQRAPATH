import * as React from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ChildData {
  // User table fields
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Student profile fields
  age: string;
  gender: string;
  dateOfBirth: string;
  educationLevel: string;
  schoolName: string;
  gradeLevel: string;
}

interface ChildRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (childData: ChildData[]) => void;
}

export function ChildRegistrationModal({
  open,
  onOpenChange,
  onSave,
}: ChildRegistrationModalProps) {
  const [children, setChildren] = React.useState<ChildData[]>([
    {
      // User table fields
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",

      // Student profile fields
      age: "",
      gender: "",
      dateOfBirth: "",
      educationLevel: "",
      schoolName: "",
      gradeLevel: "",
    },
  ]);

  const [currentChildIndex, setCurrentChildIndex] = React.useState<number>(0);
  const { toast } = useToast();

  const educationLevels = [
    "Pre-School",
    "Elementary School",
    "Middle School",
    "High School",
    "Homeschool",
    "Other"
  ];

  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        // User table fields
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",

        // Student profile fields
        age: "",
        gender: "",
        dateOfBirth: "",
        educationLevel: "",
        schoolName: "",
        gradeLevel: "",
      },
    ]);

    // Navigate to the first child
    setCurrentChildIndex(children.length);
  };

  const handleChange = (
    index: number,
    field: keyof ChildData,
    value: string
  ) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setChildren(updatedChildren);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length <= 1) {
      // Don't allow removing the last child
      toast({
        title: "Cannot Remove Child",
        description: "At least one child must be registered.",
        variant: "destructive",
      });
      return;
    }

    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);

    // If we're removing the current child, select the first one
    if (currentChildIndex >= updatedChildren.length) {
      setCurrentChildIndex(0);
    }
  };

  const handleSave = () => {
    if (!validateAllChildren()) {
      return;
    }
    onSave(children);
    onOpenChange(false);
  };

  const handleSelectChild = (index: number) => {
    setCurrentChildIndex(index);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const updatedChildren = [...children];
    updatedChildren[currentChildIndex] = {
      ...updatedChildren[currentChildIndex],
      password: password,
      confirmPassword: password
    };
    setChildren(updatedChildren);
  };

  // Validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Validate all children before saving
  const validateAllChildren = () => {
    // Fields required for each child
    const requiredFields: (keyof ChildData)[] = [
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'age',
      'gender'
    ];

    // Check each child for required fields
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const invalidFields: string[] = [];

      // Check required fields
      for (const field of requiredFields) {
        if (!child[field] || (typeof child[field] === 'string' && !(child[field] as string).trim())) {
          invalidFields.push(field);
        }
      }

      // Email validation
      if (child.email && !/^\S+@\S+\.\S+$/.test(child.email)) {
        invalidFields.push('email (invalid format)');
      }

      // Password length
      if (child.password && child.password.length < 8) {
        invalidFields.push('password (too short)');
      }

      // Password confirmation
      if (child.password !== child.confirmPassword) {
        invalidFields.push('confirmPassword (doesn\'t match)');
      }

      if (invalidFields.length > 0) {
        toast({
          title: `Child ${i + 1} (${child.fullName || 'Unnamed'}) has missing or invalid fields`,
          description: `Please complete: ${invalidFields.join(', ')}`,
          variant: "destructive",
        });

        // Switch to the child with errors
        setCurrentChildIndex(i);
        return false;
      }
    }

    return true;
  };

  const validateCurrentChild = () => {
    const newErrors: Record<string, string> = {};
    const child = children[currentChildIndex];

    if (!child.fullName.trim()) newErrors.fullName = "Name is required";
    if (!child.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(child.email)) newErrors.email = "Invalid email format";

    if (!child.password) newErrors.password = "Password is required";
    else if (child.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (child.password !== child.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!child.gender) newErrors.gender = "Gender is required";
    if (!child.age.trim()) newErrors.age = "Age is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderChildForm = () => {
    const child = children[currentChildIndex];

    return (
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Child's Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Fatima Bello"
            value={child.fullName}
            onChange={(e) => handleChange(currentChildIndex, "fullName", e.target.value)}
            className={`w-full bg-gray-50 ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          {/* This maps to the 'name' field in the user database table */}
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            placeholder="child@example.com"
            value={child.email}
            onChange={(e) => handleChange(currentChildIndex, "email", e.target.value)}
            className={`w-full bg-gray-50 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 mt-1">
            This will be used for login. For younger children, you can use your email with +child suffix (e.g. yourname+child@example.com)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={child.password}
                onChange={(e) => handleChange(currentChildIndex, "password", e.target.value)}
                className={`w-full bg-gray-50 ${errors.password ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-2 top-1.5 text-xs h-6"
                onClick={generatePassword}
              >
                Generate
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={child.confirmPassword}
              onChange={(e) => handleChange(currentChildIndex, "confirmPassword", e.target.value)}
              className={`w-full bg-gray-50 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Age <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. 7 years"
              value={child.age}
              onChange={(e) => handleChange(currentChildIndex, "age", e.target.value)}
              className={`w-full bg-gray-50 ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={child.gender}
              onValueChange={(value) => handleChange(currentChildIndex, "gender", value)}
            >
              <SelectTrigger className={`w-full bg-gray-50 ${errors.gender ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </Label>
            <Input
              type="date"
              value={child.dateOfBirth}
              onChange={(e) => handleChange(currentChildIndex, "dateOfBirth", e.target.value)}
              className="w-full bg-gray-50"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Education Level
            </Label>
            <Select
              value={child.educationLevel}
              onValueChange={(value) => handleChange(currentChildIndex, "educationLevel", value)}
            >
              <SelectTrigger className="w-full bg-gray-50">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </Label>
            <Input
              placeholder="e.g. Al-Huda Academy"
              value={child.schoolName}
              onChange={(e) => handleChange(currentChildIndex, "schoolName", e.target.value)}
              className="w-full bg-gray-50"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level
            </Label>
            <Input
              placeholder="e.g. Grade 3"
              value={child.gradeLevel}
              onChange={(e) => handleChange(currentChildIndex, "gradeLevel", e.target.value)}
              className="w-full bg-gray-50"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold">Register Your Child for Quran Learning</DialogTitle>
        <DialogDescription className="text-gray-600">
          As a Guardian, you can manage multiple children from one account. Add
          each child's information below to register them.
        </DialogDescription>

        {/* Child tabs when there are multiple children */}
        {children.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
            {children.map((child, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => handleSelectChild(index)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentChildIndex === index
                      ? "bg-[#2c7870] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {child.fullName || `Child ${index + 1}`}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChild(index);
                  }}
                  className="ml-1 text-gray-400 hover:text-red-500"
                  title="Remove this child"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-lg font-medium mb-4">Child Information</h3>

        {/* Form content */}
        {renderChildForm()}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <div></div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAddChild}
              className="text-[#2c7870]"
            >
              Add Another Child
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#2c7870] hover:bg-[#236158] text-white"
            >
              Save and Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
