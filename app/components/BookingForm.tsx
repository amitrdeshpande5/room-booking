"use client";

import { useActionState, useRef } from "react";
import { createBooking } from "@/app/actions";
import { type ActionState, type Room } from "@/lib/types";
import { localDateInputValue, timeSlots } from "@/lib/time";

const initialState: ActionState = { ok: false, message: "" };

export function BookingForm({ rooms }: { rooms: Room[] }) {
  const [state, formAction, isPending] = useActionState(createBooking, initialState);
  const timezoneOffsetRef = useRef<HTMLInputElement>(null);
  const slots = timeSlots();

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (timezoneOffsetRef.current) {
          timezoneOffsetRef.current.value = String(new Date().getTimezoneOffset());
        }
      }}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">Book a room</h2>
        <p className="mt-1 text-sm text-slate-500">Select a room and time slot for your meeting.</p>
      </div>

      <input ref={timezoneOffsetRef} type="hidden" name="timezone_offset" defaultValue="0" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="room_id" className="text-sm font-medium text-slate-700">
            Room
          </label>
          <select
            id="room_id"
            name="room_id"
            required
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} · {room.location} · {room.capacity} people
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={localDateInputValue()}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start_time" className="text-sm font-medium text-slate-700">
              Start
            </label>
            <select
              id="start_time"
              name="start_time"
              defaultValue="09:00"
              required
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="end_time" className="text-sm font-medium text-slate-700">
              End
            </label>
            <select
              id="end_time"
              name="end_time"
              defaultValue="10:00"
              required
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="purpose" className="text-sm font-medium text-slate-700">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            required
            minLength={3}
            rows={3}
            placeholder="Team sync, client presentation, training..."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      {state.message ? (
        <p
          className={`mt-4 rounded-md border px-3 py-2 text-sm ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Checking availability..." : "Create booking"}
      </button>
    </form>
  );
}
