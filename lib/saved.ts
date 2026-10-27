import { z } from "zod";
import { savedListingSchema } from "@/lib/schemas";
import type { SavedListing } from "@/types";

export const SAVED_STORAGE_KEY = "havenfind:saved";

/** Parses the stored JSON; corrupt or tampered data yields an empty list instead of throwing. */
export function parseSaved(raw: string | null): SavedListing[] {
  if (!raw) return [];
  try {
    const result = z.array(savedListingSchema).safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function isSaved(saved: readonly SavedListing[], listingId: string): boolean {
  return saved.some((item) => item.listingId === listingId);
}

/** Adds the listing (newest first) or removes it if already saved. */
export function toggleSaved(saved: readonly SavedListing[], listingId: string, now: Date = new Date()): SavedListing[] {
  if (isSaved(saved, listingId)) return saved.filter((item) => item.listingId !== listingId);
  return [{ listingId, savedAt: now.toISOString() }, ...saved];
}
