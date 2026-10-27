"use client";

import { useEffect } from "react";
import type { Listing } from "@/types";
import { ListingCard } from "./ListingCard";

interface ListingListProps {
  listings: Listing[];
  activeId: string | null;
  selectedId: string | null;
  loading: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function ListingList({ listings, activeId, selectedId, loading, onHover, onSelect }: ListingListProps) {
  // Keep a card chosen from the map visible in the scrolling list.
  useEffect(() => {
    if (selectedId) document.getElementById(`card-${selectedId}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  if (!loading && listings.length === 0) {
    return <p className="p-4 text-sm text-zinc-600 dark:text-zinc-400">No homes in this area. Pan or zoom the map.</p>;
  }

  return (
    <ul className="flex flex-col gap-2 p-3" aria-busy={loading}>
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard
            listing={listing}
            active={listing.id === activeId}
            selected={listing.id === selectedId}
            onHover={onHover}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
