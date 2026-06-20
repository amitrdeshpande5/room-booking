export function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Room Booking</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Supabase setup required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This deployment needs valid Supabase environment variables before bookings and authentication can run.
        </p>
        <dl className="mt-5 space-y-3 rounded-md bg-slate-50 p-4 text-sm">
          <div>
            <dt className="font-medium text-slate-950">NEXT_PUBLIC_SUPABASE_URL</dt>
            <dd className="mt-1 text-slate-600">Your Supabase project URL.</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-950">NEXT_PUBLIC_SUPABASE_ANON_KEY</dt>
            <dd className="mt-1 text-slate-600">Your Supabase anon public key.</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Add both values in Vercel Project Settings, then redeploy the project.
        </p>
      </section>
    </main>
  );
}
