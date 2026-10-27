"use client";

import Image from "next/image";
import Link from "next/link";
import { SaveButton } from "@/features/saved/SaveButton";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  active: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const TYPE_LABEL: Record<Listing["type"], string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  TOWNHOUSE: "Townhouse",
  LAND: "Land",
};

export function ListingCard({ listing, active, selected, onHover, onSelect }: ListingCardProps) {
  const isLand = listing.type === "LAND";

  return (
    <div className="relative">
      <button
        type="button"
        id={`card-${listing.id}`}
        aria-pressed={selected}
        onClick={() => onSelect(listing.id)}
        onMouseEnter={() => onHover(listing.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(listing.id)}
        onBlur={() => onHover(null)}
        className={`flex w-full gap-3 rounded-lg border p-2 text-left transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
          selected
            ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
            : active
              ? "border-teal-400 bg-zinc-50 dark:bg-zinc-900"
              : "border-zinc-200 dark:border-zinc-800"
        }`}
      >
        <Image
          src={listing.images[0]}
          alt=""
          width={120}
          height={80}
          unoptimized
          className="h-20 w-28 shrink-0 rounded-md object-cover"
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold">{formatPrice(listing.price)}</span>
          <span className="truncate text-sm">{listing.title}</span>
          <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">{listing.address}</span>
          <span className="mt-auto text-xs text-zinc-700 dark:text-zinc-300">
            {isLand ? "" : `${listing.bedrooms} bd · ${listing.bathrooms} ba · `}
            {listing.areaSqm} m² · {TYPE_LABEL[listing.type]}
          </span>
        </span>
      </button>
      <Link
        href={`/listings/${listing.id}`}
        aria-label={`View details: ${listing.title}`}
        className="absolute right-3 top-2.5 text-xs font-medium text-teal-700 underline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-teal-400"
      >
        Details →
      </Link>
      <SaveButton listingId={listing.id} className="absolute bottom-1.5 right-2" />
    </div>
  );
}
