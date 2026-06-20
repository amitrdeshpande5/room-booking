const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MINUTES = 5 * 60 + 30;

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: IST_TIME_ZONE,
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST_TIME_ZONE,
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: IST_TIME_ZONE,
  }).format(new Date(value));
}

export function minutesBetween(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

export function dateBounds(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const startMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0) - IST_OFFSET_MINUTES * 60000;
  const endMs = startMs + 24 * 60 * 60 * 1000;

  return {
    start: new Date(startMs).toISOString(),
    end: new Date(endMs).toISOString(),
  };
}

export function todayBounds() {
  return dateBounds(istDateInputValue());
}

export function istDateInputValue(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

export function localDateInputValue(date = new Date()) {
  return istDateInputValue(date);
}

export function timeSlots() {
  const slots: string[] = [];
  for (let hour = 8; hour <= 19; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 19 && minute === 30) {
        continue;
      }
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
}

export function localDateTimeToIso(date: string, time: string, timezoneOffsetMinutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) + timezoneOffsetMinutes * 60000;
  return new Date(utcMs).toISOString();
}

export function istDateTimeToIso(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET_MINUTES * 60000;
  return new Date(utcMs).toISOString();
}
