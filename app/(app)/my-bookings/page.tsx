import { BookingTable } from "@/app/components/BookingTable";
import { createClient } from "@/lib/supabase/server";
import { type Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, room:rooms(name, location, capacity)")
    .eq("user_id", user?.id)
    .order("start_time", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">My bookings</h2>
        <p className="mt-1 text-sm text-slate-500">Review and cancel your own room reservations.</p>
      </div>
      <BookingTable
        bookings={(bookings ?? []) as Booking[]}
        emptyTitle="You do not have any bookings yet."
        showDate
        allowCancel
      />
    </section>
  );
}
