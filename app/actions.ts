"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { type ActionState } from "@/lib/types";
import { localDateTimeToIso, minutesBetween } from "@/lib/time";

const unavailableMessage = "That room is already booked for the selected time. Please choose another slot.";
const setupMessage = "Supabase is not configured for this deployment.";

export async function signIn(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: setupMessage };
  }

  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/");
}

export async function signUp(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: setupMessage };
  }

  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Account created. Check your email if confirmation is enabled, then sign in." };
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createBooking(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: setupMessage };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const roomId = String(formData.get("room_id") || "");
  const date = String(formData.get("date") || "");
  const start = String(formData.get("start_time") || "");
  const end = String(formData.get("end_time") || "");
  const purpose = String(formData.get("purpose") || "").trim();
  const timezoneOffset = Number(formData.get("timezone_offset") || "0");

  if (!roomId || !date || !start || !end || !purpose) {
    return { ok: false, message: "Please complete every required field." };
  }

  if (start >= end) {
    return { ok: false, message: "End time must be after start time." };
  }

  const startTime = localDateTimeToIso(date, start, timezoneOffset);
  const endTime = localDateTimeToIso(date, end, timezoneOffset);
  const durationMinutes = minutesBetween(startTime, endTime);

  if (durationMinutes < 30 || durationMinutes > 8 * 60) {
    return { ok: false, message: "Bookings must be between 30 minutes and 8 hours." };
  }

  const { data: conflicts, error: conflictError } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "confirmed")
    .lt("start_time", endTime)
    .gt("end_time", startTime)
    .limit(1);

  if (conflictError) {
    return { ok: false, message: conflictError.message };
  }

  if (conflicts.length > 0) {
    return { ok: false, message: unavailableMessage };
  }

  const { error } = await supabase.from("bookings").insert({
    room_id: roomId,
    user_id: user.id,
    start_time: startTime,
    end_time: endTime,
    purpose,
    status: "confirmed",
  });

  if (error) {
    const message = error.code === "23P01" ? unavailableMessage : error.message;
    return { ok: false, message };
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath("/my-bookings");
  return { ok: true, message: "Booking created." };
}

export async function cancelBooking(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath("/my-bookings");
}
