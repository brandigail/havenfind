import { describe, expect, it } from "vitest";
import { isSaved, parseSaved, toggleSaved } from "./saved";

const NOW = new Date("2026-10-27T10:00:00.000Z");

describe("parseSaved", () => {
  it("returns an empty list for missing, corrupt or wrongly shaped data", () => {
    expect(parseSaved(null)).toEqual([]);
    expect(parseSaved("not json")).toEqual([]);
    expect(parseSaved('{"listingId":"a"}')).toEqual([]);
    expect(parseSaved('[{"listingId":"a","savedAt":"yesterday"}]')).toEqual([]);
  });

  it("parses valid stored data", () => {
    const raw = JSON.stringify([{ listingId: "listing-001", savedAt: NOW.toISOString() }]);
    expect(parseSaved(raw)).toEqual([{ listingId: "listing-001", savedAt: NOW.toISOString() }]);
  });
});

describe("toggleSaved", () => {
  it("adds a listing newest-first with a timestamp", () => {
    const first = toggleSaved([], "a", NOW);
    const second = toggleSaved(first, "b", new Date("2026-10-28T10:00:00.000Z"));
    expect(second.map((s) => s.listingId)).toEqual(["b", "a"]);
    expect(first[0].savedAt).toBe(NOW.toISOString());
  });

  it("removes a listing that is already saved", () => {
    const saved = toggleSaved(toggleSaved([], "a", NOW), "b", NOW);
    expect(toggleSaved(saved, "a", NOW).map((s) => s.listingId)).toEqual(["b"]);
  });

  it("does not mutate its input", () => {
    const saved = toggleSaved([], "a", NOW);
    const copy = [...saved];
    toggleSaved(saved, "b", NOW);
    expect(saved).toEqual(copy);
    expect(isSaved(saved, "a")).toBe(true);
  });
});
