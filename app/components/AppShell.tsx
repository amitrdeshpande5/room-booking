import Link from "next/link";
import { signOut } from "@/app/actions";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/rooms", label: "Rooms" },
  { href: "/my-bookings", label: "My bookings" },
  { href: "/admin/rooms", label: "Admin" },
];

export function AppShell({ children, email }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-semibold text-slate-950">Room Booking</h1>
              <p className="text-sm text-slate-500">Internal meeting room reservations</p>
            </div>
            <form action={signOut} className="flex items-center gap-3">
              <span className="max-w-48 truncate text-sm text-slate-600">{email}</span>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Sign out
              </button>
            </form>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
