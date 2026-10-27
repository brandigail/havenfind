import { describe, expect, it } from "vitest";
import { availableSlots, formatSlot, groupSlotsByDay, isAvailableSlot } from "./booking-slots";

// Monday 26 Oct 2026, 10:00 SAST
const NOW = new Date("2026-10-26T08:00:00.000Z");

describe("availableSlots", () => {
  const slots = availableSlots(NOW);

  it("starts tomorrow at 09:00 SAST (07:00 UTC)", () => {
    expect(slots[0]).toBe("2026-10-27T07:00:00.000Z");
  });

  it("offers 8 hourly slots per day, skipping Sunday (6 days x 8 over the next week)", () => {
    expect(slots).toHaveLength(48);
    expect(slots.some((s) => new Date(s).getUTCDay() === 0)).toBe(false);
  });

  it("only offers future slots within a week", () => {
    const last = new Date(slots[slots.length - 1]).getTime();
    expect(slots.every((s) => new Date(s).getTime() > NOW.getTime())).toBe(true);
    expect(last - NOW.getTime()).toBeLessThanOrEqual(8 * 24 * 3_600_000);
  });

  it("uses the South African date late in the evening UTC (rolls to the next SAST day)", () => {
    // 23:30 UTC on Mon is already 01:30 Tue in SAST, so "tomorrow" is Wednesday
    const late = availableSlots(new Date("2026-10-26T23:30:00.000Z"));
    expect(late[0]).toBe("2026-10-28T07:00:00.000Z");
  });
});

describe("isAvailableSlot", () => {
  it("accepts an offered slot in any ISO spelling", () => {
    expect(isAvailableSlot("2026-10-27T07:00:00.000Z", NOW)).toBe(true);
    expect(isAvailableSlot("2026-10-27T09:00:00+02:00", NOW)).toBe(true);
  });

  it("rejects past, off-hour, Sunday and malformed slots", () => {
    expect(isAvailableSlot("2026-10-26T07:00:00.000Z", NOW)).toBe(false);
    expect(isAvailableSlot("2026-10-27T07:30:00.000Z", NOW)).toBe(false);
    expect(isAvailableSlot("2026-11-01T07:00:00.000Z", NOW)).toBe(false);
    expect(isAvailableSlot("tomorrow", NOW)).toBe(false);
  });
});

describe("grouping and formatting", () => {
  it("groups slots into SAST days with local times", () => {
    const days = groupSlotsByDay(availableSlots(NOW));
    expect(days).toHaveLength(6);
    expect(days[0].key).toBe("2026-10-27");
    expect(days[0].slots.map((s) => s.time)).toEqual(["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]);
  });

  it("formats a slot in South African time", () => {
    expect(formatSlot("2026-10-27T07:00:00.000Z")).toMatch(/09:00$/);
  });
});
