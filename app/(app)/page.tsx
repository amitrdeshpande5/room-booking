import { BookingForm } from "@/app/components/BookingForm";
import { BookingTable } from "@/app/components/BookingTable";
import { createClient } from "@/lib/supabase/server";
import { dateBounds, formatDate, istDateInputValue } from "@/lib/time";
import { type Booking, type Room } from "@/lib/types";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

function validDateInput(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : istDateInputValue();
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const selectedDate = validDateInput(params?.date);
  const supabase = await createClient();
  const { start, end } = dateBounds(selectedDate);

  const [{ data: rooms, error: roomsError }, { data: bookings, error: bookingsError }] = await Promise.all([
    supabase.from("rooms").select("*").order("name"),
    supabase
      .from("bookings")
      .select("*, room:rooms(name, location, capacity)")
      .eq("status", "confirmed")
      .gte("start_time", start)
      .lt("start_time", end)
      .order("start_time"),
  ]);

  if (roomsError || bookingsError) {
    throw new Error(roomsError?.message || bookingsError?.message);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <BookingForm rooms={(rooms ?? []) as Room[]} />
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Bookings for {formatDate(start)}</h2>
            <p className="mt-1 text-sm text-slate-500">Confirmed meetings shown in IST.</p>
          </div>
          <form action="/" className="flex items-end gap-2">
            <div>
              <label htmlFor="dashboard-date" className="text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                id="dashboard-date"
                name="date"
                type="date"
                defaultValue={selectedDate}
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              View
            </button>
          </form>
        </div>
        <BookingTable bookings={(bookings ?? []) as Booking[]} emptyTitle="No rooms are booked for this date." />
      </section>
    </div>
  );
}
