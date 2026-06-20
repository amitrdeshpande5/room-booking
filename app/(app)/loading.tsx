export default function Loading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-10 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
