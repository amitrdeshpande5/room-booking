import { createClient } from "@/lib/supabase/server";
import { type Room } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const supabase = await createClient();
  const { data: rooms, error } = await supabase.from("rooms").select("*").order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">Room management</h2>
        <p className="mt-1 text-sm text-slate-500">
          Room records are seeded through Supabase SQL for this MVP. Add admin editing here when roles are introduced.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {((rooms ?? []) as Room[]).map((room) => (
          <article key={room.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">{room.name}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Capacity</dt>
                <dd className="font-medium text-slate-900">{room.capacity}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-900">{room.location}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-slate-600">{room.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
