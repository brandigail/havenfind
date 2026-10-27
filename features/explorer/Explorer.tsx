"use client";

import { useCallback, useState } from "react";
import { FilterPanel } from "@/features/filters/FilterPanel";
import { useFilters } from "@/features/filters/useFilters";
import { ListingList } from "@/features/listings/ListingList";
import { ListingsMapLoader } from "@/features/map/ListingsMapLoader";
import type { MapBounds } from "@/types";
import { useListings } from "./useListings";
import { ViewToggle, type MobileView } from "./ViewToggle";

export function Explorer() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Only affects small screens; from `lg` up the map and list are shown side by side.
  const [view, setView] = useState<MobileView>("map");
  const { filters, filterQuery, setFilters } = useFilters();
  const { listings, total, loading, error } = useListings(bounds, filterQuery);

  const activeId = hoveredId ?? selectedId;

  // Choosing a card on mobile jumps to the map so the pin and popup are visible.
  const selectFromList = useCallback((id: string) => {
    setSelectedId(id);
    setView("map");
  }, []);

  return (
    <main className="flex h-dvh flex-col lg:flex-row">
      <a
        href="#listings"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[2000] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-900 max-lg:hidden"
      >
        Skip to listings
      </a>
      <h1 className="sr-only">HavenFind: homes for sale in Cape Town</h1>
      <section
        aria-label="Map"
        className={`relative min-h-0 flex-1 lg:order-2 lg:block ${view === "map" ? "block" : "hidden"}`}
      >
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
      <aside
        id="listings"
        tabIndex={-1}
        aria-label="Listings"
        className={`min-h-0 flex-1 overflow-y-auto pb-20 lg:order-1 lg:block lg:w-[420px] lg:flex-none lg:pb-0 ${
          view === "list" ? "block" : "hidden"
        }`}
      >
        <FilterPanel filters={filters} onChange={setFilters} />
        <ListingList
          listings={listings}
          activeId={activeId}
          selectedId={selectedId}
          loading={loading}
          onHover={setHoveredId}
          onSelect={selectFromList}
        />
      </aside>
      <ViewToggle view={view} count={total} onChange={setView} />
    </main>
  );
}
