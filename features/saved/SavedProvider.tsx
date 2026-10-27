"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { isSaved } from "@/lib/saved";
import {
  getSavedSnapshot,
  getServerSavedSnapshot,
  subscribeSaved,
  toggleSavedListing,
} from "@/lib/saved-store";
import type { SavedListing } from "@/types";

interface SavedContextValue {
  saved: SavedListing[];
  /** False during server render and hydration; true once localStorage can be read. */
  ready: boolean;
  isSaved: (listingId: string) => boolean;
  toggle: (listingId: string) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

const subscribeNever = (): (() => void) => () => {};

export function SavedProvider({ children }: { children: ReactNode }) {
  // Server and hydration use the empty snapshot, so markup matches; React then switches to localStorage.
  const saved = useSyncExternalStore(subscribeSaved, getSavedSnapshot, getServerSavedSnapshot);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);

  const value = useMemo<SavedContextValue>(
    () => ({ saved, ready, toggle: toggleSavedListing, isSaved: (listingId) => isSaved(saved, listingId) }),
    [saved, ready],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used inside <SavedProvider>");
  return context;
}
