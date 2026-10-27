"use client";

import { useEffect, useState } from "react";
import type { Listing, MapBounds } from "@/types";

const DEBOUNCE_MS = 250;

interface ListingsState {
  listings: Listing[];
  total: number;
  loading: boolean;
  error: boolean;
}

function sameListings(a: Listing[], b: Listing[]): boolean {
  return a.length === b.length && a.every((listing, i) => listing.id === b[i].id);
}

/** Fetches listings for the current viewport, debounced and cancelling stale requests. */
export function useListings(bounds: MapBounds | null, filterQuery: string): ListingsState {
  const [state, setState] = useState<ListingsState>({ listings: [], total: 0, loading: true, error: false });

  useEffect(() => {
    if (!bounds) return;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setState((s) => ({ ...s, loading: true, error: false }));
      try {
        const query = new URLSearchParams(filterQuery);
        for (const [key, value] of Object.entries(bounds)) query.set(key, String(value));
        const res = await fetch(`/api/listings?${query}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as { listings: Listing[]; total: number };
        setState((prev) => ({
          // Keep the same array when the visible homes are unchanged, so map markers (and an open popup) aren't rebuilt.
          listings: sameListings(prev.listings, data.listings) ? prev.listings : data.listings,
          total: data.total,
          loading: false,
          error: false,
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error: true }));
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [bounds, filterQuery]);

  return state;
}
