export const BOOKING_TIME_ZONE = "Africa/Johannesburg";

/** South Africa has no daylight saving, so SAST is a fixed UTC+2. */
const SAST_OFFSET_HOURS = 2;
const FIRST_HOUR = 9;
const LAST_HOUR = 16;
const DAYS_AHEAD = 7;

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TIME_ZONE });
const dayLabelFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: BOOKING_TIME_ZONE,
});
const timeFormat = new Intl.DateTimeFormat("en-ZA", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: BOOKING_TIME_ZONE,
});

/**
 * Hourly viewing slots (09:00 to 16:00 SAST, Monday to Saturday) from tomorrow for a week, as UTC ISO strings.
 * The booking form and the API both use this so they always agree on what can be booked.
 */
export function availableSlots(now: Date = new Date()): string[] {
  const sastNow = new Date(now.getTime() + SAST_OFFSET_HOURS * 3_600_000);
  const slots: string[] = [];

  for (let offset = 1; offset <= DAYS_AHEAD; offset += 1) {
    const day = new Date(Date.UTC(sastNow.getUTCFullYear(), sastNow.getUTCMonth(), sastNow.getUTCDate() + offset));
    if (day.getUTCDay() === 0) continue; // no Sunday viewings

    for (let hour = FIRST_HOUR; hour <= LAST_HOUR; hour += 1) {
      slots.push(
        new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour - SAST_OFFSET_HOURS)).toISOString(),
      );
    }
  }
  return slots;
}

/** True only for a slot that availableSlots() currently offers (normalises offset/format differences). */
export function isAvailableSlot(slot: string, now: Date = new Date()): boolean {
  const time = new Date(slot);
  return !Number.isNaN(time.getTime()) && availableSlots(now).includes(time.toISOString());
}

export interface SlotDay {
  key: string;
  label: string;
  slots: { iso: string; time: string }[];
}

export function groupSlotsByDay(slots: readonly string[]): SlotDay[] {
  const days = new Map<string, SlotDay>();
  for (const iso of slots) {
    const date = new Date(iso);
    const key = dayKeyFormat.format(date);
    const day = days.get(key) ?? { key, label: dayLabelFormat.format(date), slots: [] };
    day.slots.push({ iso, time: timeFormat.format(date) });
    days.set(key, day);
  }
  return [...days.values()];
}

export function formatSlot(iso: string): string {
  const date = new Date(iso);
  return `${dayLabelFormat.format(date)} at ${timeFormat.format(date)}`;
}
