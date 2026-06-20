import { BookingForm } from "@/app/components/BookingForm";
import { BookingTable } from "@/app/components/BookingTable";
import { createClient } from "@/lib/supabase/server";
import { todayBounds } from "@/lib/time";
import { type Booking, type Room } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { start, end } = todayBounds();

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
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-950">Today&apos;s bookings</h2>
          <p className="mt-1 text-sm text-slate-500">Confirmed meetings scheduled for today.</p>
        </div>
        <BookingTable bookings={(bookings ?? []) as Booking[]} emptyTitle="No rooms are booked today." />
      </section>
    </div>
  );
}
