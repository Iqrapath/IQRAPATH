import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Booking {
  id: string | number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  subject: string;
}

interface BookingsListProps {
  bookings: Booking[];
  totalCount: number;
}

export function BookingsList({ bookings, totalCount }: BookingsListProps) {
  return (
    <Card className="bg-white border-1 rounded-3xl shadow-sm overflow-hidden flex-1">
      <CardContent className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">You have {totalCount} Booking</p>

        {/* Bookings List */}
        <div className="space-y-4 flex-1">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={booking.user.avatar}
                  alt={booking.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  <span className="text-gray-900">{booking.user.name}</span>
                  <span className="text-gray-500"> {booking.action} </span>
                  <span className="text-gray-900">{booking.subject}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Bookings Link */}
        <div className="mt-4 text-right">
          <Button
            variant="ghost"
            className="text-[#2c7870] hover:text-[#2c7870] hover:bg-transparent p-0 h-auto text-sm font-normal"
          >
            View All Bookings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
