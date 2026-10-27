"use client";

import { useState } from "react";
import { FilterPanel } from "@/features/filters/FilterPanel";
import { useFilters } from "@/features/filters/useFilters";
import { ListingList } from "@/features/listings/ListingList";
import { ListingsMapLoader } from "@/features/map/ListingsMapLoader";
import type { MapBounds } from "@/types";
import { useListings } from "./useListings";

export function Explorer() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { filters, filterQuery, setFilters } = useFilters();
  const { listings, total, loading, error } = useListings(bounds, filterQuery);

  const activeId = hoveredId ?? selectedId;

  return (
    <main className="flex h-dvh flex-col lg:flex-row">
      <section aria-label="Map" className="relative h-[45dvh] shrink-0 lg:order-2 lg:h-full lg:flex-1">
        <ListingsMapLoader
          listings={listings}
          activeId={activeId}
          selectedId={selectedId}
          onHover={setHoveredId}
          onSelect={setSelectedId}
          onBoundsChange={setBounds}
        />
        <p
          role="status"
          className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow dark:bg-zinc-900/90 dark:text-zinc-100"
        >
          {error ? "Could not load listings" : loading ? "Loading…" : `${total} ${total === 1 ? "home" : "homes"} in view`}
        </p>
      </section>
      <aside aria-label="Listings" className="min-h-0 flex-1 overflow-y-auto lg:order-1 lg:w-[420px] lg:flex-none">
        <FilterPanel filters={filters} onChange={setFilters} />
        <ListingList
          listings={listings}
          activeId={activeId}
          selectedId={selectedId}
          loading={loading}
          onHover={setHoveredId}
          onSelect={setSelectedId}
        />
      </aside>
    </main>
  );
}
