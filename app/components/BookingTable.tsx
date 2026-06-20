import { cancelBooking } from "@/app/actions";
import { formatDateTime, formatTime } from "@/lib/time";
import { type Booking } from "@/lib/types";

type BookingTableProps = {
  bookings: Booking[];
  emptyTitle: string;
  showDate?: boolean;
  allowCancel?: boolean;
};

export function BookingTable({ bookings, emptyTitle, showDate = false, allowCancel = false }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-700">{emptyTitle}</p>
        <p className="mt-1 text-sm text-slate-500">New bookings will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              {allowCancel ? <th className="px-4 py-3 text-right">Action</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-950">{booking.room?.name ?? "Room"}</div>
                  <div className="text-xs text-slate-500">{booking.room?.location}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                  {showDate ? formatDateTime(booking.start_time) : formatTime(booking.start_time)}
                  <span className="mx-1 text-slate-400">to</span>
                  {showDate ? formatDateTime(booking.end_time) : formatTime(booking.end_time)}
                </td>
                <td className="max-w-sm px-4 py-4 text-slate-700">{booking.purpose}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                {allowCancel ? (
                  <td className="px-4 py-4 text-right">
                    {booking.status === "confirmed" ? (
                      <form action={cancelBooking}>
                        <input type="hidden" name="id" value={booking.id} />
                        <button className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">
                          Cancel
                        </button>
                      </form>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
