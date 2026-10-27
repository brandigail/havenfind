import { SAVED_STORAGE_KEY, parseSaved, toggleSaved } from "@/lib/saved";
import type { SavedListing } from "@/types";

/** Stable reference so React sees "no change" on the server and before anything is saved. */
export const EMPTY_SAVED: SavedListing[] = [];

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cached: SavedListing[] = EMPTY_SAVED;
/** Used only when localStorage is blocked, so saving still works for the session. */
let memoryFallback: SavedListing[] | null = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(SAVED_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Client snapshot. Returns the same array until the stored value actually changes. */
export function getSavedSnapshot(): SavedListing[] {
  if (memoryFallback) return memoryFallback;
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = raw === null ? EMPTY_SAVED : parseSaved(raw);
  }
  return cached;
}

export function getServerSavedSnapshot(): SavedListing[] {
  return EMPTY_SAVED;
}

export function subscribeSaved(onChange: () => void): () => void {
  listeners.add(onChange);
  // The `storage` event fires in other tabs, keeping them in sync.
  const onStorage = (event: StorageEvent): void => {
    if (event.key === SAVED_STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleSavedListing(listingId: string): void {
  const next = toggleSaved(getSavedSnapshot(), listingId);
  try {
    window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
    memoryFallback = null;
  } catch {
    memoryFallback = next;
  }
  listeners.forEach((listener) => listener());
}
