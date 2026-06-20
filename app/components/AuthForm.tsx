"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type ActionState } from "@/lib/types";

type AuthFormProps = {
  title: string;
  description: string;
  action: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
  buttonLabel: string;
  alternateHref: string;
  alternateText: string;
};

const initialState: ActionState = { ok: false, message: "" };

export function AuthForm({
  title,
  description,
  action,
  buttonLabel,
  alternateHref,
  alternateText,
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Room Booking</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <form action={formAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {state.message ? (
          <p
            className={`mt-4 rounded-md border px-3 py-2 text-sm ${
              state.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Please wait..." : buttonLabel}
        </button>
      </form>

      <Link href={alternateHref} className="mt-5 text-center text-sm font-medium text-slate-700 hover:text-slate-950">
        {alternateText}
      </Link>
    </div>
  );
}
