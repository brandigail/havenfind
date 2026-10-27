"use client";

import { useState } from "react";
import { ListingsMapLoader } from "@/features/map/ListingsMapLoader";
import type { MapBounds } from "@/types";
import { useListings } from "./useListings";

export function Explorer() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const { listings, total, loading, error } = useListings(bounds);

  return (
    <main className="relative h-dvh w-full">
      <ListingsMapLoader listings={listings} onBoundsChange={setBounds} />
      <p
        role="status"
        className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow dark:bg-zinc-900/90 dark:text-zinc-100"
      >
        {error ? "Could not load listings" : loading ? "Loading…" : `${total} homes in view`}
      </p>
    </main>
  );
}
