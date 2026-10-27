"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window`, so the map is client-only to avoid hydration errors.
export const ListingsMapLoader = dynamic(() => import("./ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900">
      Loading map…
    </div>
  ),
});
