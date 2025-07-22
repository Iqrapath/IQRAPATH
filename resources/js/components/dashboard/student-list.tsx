import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddStudentFlow } from '@/components/dashboard/add-student-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatAvatarUrl } from '@/lib/helpers';

interface Student {
  id: string | number;
  name: string;
  avatar: string;
}

interface StudentListProps {
  students: Student[];
  totalCount: number;
}

export function StudentList({ students, totalCount }: StudentListProps) {
  const getInitials = useInitials();

  return (
    <Card className="border-1 rounded-3xl shadow-sm overflow-hidden bg-[#E9FFFD]/30 flex-1 min-h-[350px]">
      <CardContent className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
              <path fill="#2c7870" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z"/>
            </svg>
            <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
          </div>
          <AddStudentFlow
            buttonVariant="icon"
            buttonClassName="rounded-full bg-[#2c7870] hover:bg-[#236158] text-white h-8 w-8"
            onStudentAdded={(data) => {
              // Handle the newly added student data
              console.log('New student added:', data);
              // Here you would typically call an API to save the data
              // and then refresh the students list
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mb-4">You have {totalCount} students</p>

        {/* Student List */}
        <div className="space-y-3 flex-1">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 overflow-hidden">
                  <AvatarImage src={formatAvatarUrl(student.avatar)} alt={student.name} />
                  <AvatarFallback className="bg-neutral-200 text-black">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{student.name}</span>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-[#2c7870]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                <span className="sr-only">View profile</span>
              </Button>
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            className="text-[#2c7870] hover:text-[#2c7870] hover:bg-transparent p-0 h-auto text-sm font-normal"
          >
            View more
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
