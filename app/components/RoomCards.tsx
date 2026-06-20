import { formatTime } from "@/lib/time";
import { type Booking, type Room } from "@/lib/types";

type RoomCardsProps = {
  rooms: Room[];
  bookings: Booking[];
};

export function RoomCards({ rooms, bookings }: RoomCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rooms.map((room) => {
        const roomBookings = bookings.filter((booking) => booking.room_id === room.id);

        return (
          <section key={room.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{room.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{room.location}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {room.capacity} seats
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{room.description}</p>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-800">Today&apos;s availability</h3>
              {roomBookings.length === 0 ? (
                <p className="mt-2 text-sm text-emerald-700">No confirmed bookings today.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {roomBookings.map((booking) => (
                    <li key={booking.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {formatTime(booking.start_time)} to {formatTime(booking.end_time)} · {booking.purpose}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
