import { RoomCards } from "@/app/components/RoomCards";
import { createClient } from "@/lib/supabase/server";
import { todayBounds } from "@/lib/time";
import { type Booking, type Room } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const supabase = await createClient();
  const { start, end } = todayBounds();

  const [{ data: rooms, error: roomsError }, { data: bookings, error: bookingsError }] = await Promise.all([
    supabase.from("rooms").select("*").order("name"),
    supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .gte("start_time", start)
      .lt("start_time", end)
      .order("start_time"),
  ]);

  if (roomsError || bookingsError) {
    throw new Error(roomsError?.message || bookingsError?.message);
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">Room availability</h2>
        <p className="mt-1 text-sm text-slate-500">Room-wise booking schedule for today.</p>
      </div>
      <RoomCards rooms={(rooms ?? []) as Room[]} bookings={(bookings ?? []) as Booking[]} />
    </div>
  );
}
