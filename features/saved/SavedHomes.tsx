"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/types";
import { SaveButton } from "./SaveButton";
import { useSaved } from "./SavedProvider";

export function SavedHomes() {
  const { saved, ready } = useSaved();
  const [byId, setById] = useState<Record<string, Listing | null>>({});
  const [failedKey, setFailedKey] = useState<string | null>(null);

  const missingKey = saved
    .map((s) => s.listingId)
    .filter((id) => !(id in byId))
    .join(",");
  const loading = missingKey !== "" && failedKey !== missingKey;
  const failed = missingKey !== "" && failedKey === missingKey;

  // Fetch only homes we haven't loaded yet, so unsaving a card doesn't refetch the list.
  useEffect(() => {
    if (!missingKey || failedKey === missingKey) return;
    const controller = new AbortController();

    fetch(`/api/listings?ids=${encodeURIComponent(missingKey)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<{ listings: Listing[] }>;
      })
      .then((data) => {
        // Ids the server no longer knows are recorded as null so they aren't requested again.
        const found = Object.fromEntries(data.listings.map((l) => [l.id, l]));
        setById((prev) => ({ ...prev, ...Object.fromEntries(missingKey.split(",").map((id) => [id, found[id] ?? null])) }));
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setFailedKey(missingKey);
      });

    return () => controller.abort();
  }, [missingKey, failedKey]);

  if (!ready) return <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading your saved homes…</p>;
  if (saved.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No saved homes yet. Tap the heart on a listing to keep it here.
      </p>
    );
  }
  if (failed) return <p role="alert">Could not load your saved homes. Please try again.</p>;

  // Homes removed from the database since saving simply don't appear.
  const homes = saved.flatMap((s) => byId[s.listingId] ?? []);
  if (!loading && homes.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">Your saved homes are no longer available.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-busy={loading}>
      {homes.map((listing) => (
        <li key={listing.id} className="relative flex gap-3 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
          <Image
            src={listing.images[0]}
            alt=""
            width={120}
            height={80}
            unoptimized
            className="h-20 w-28 shrink-0 rounded-md object-cover"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-semibold">{formatPrice(listing.price)}</p>
            <Link href={`/listings/${listing.id}`} className="truncate text-sm text-teal-700 underline dark:text-teal-400">
              {listing.title}
            </Link>
            <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{listing.address}</p>
          </div>
          <SaveButton listingId={listing.id} className="absolute bottom-1 right-1" />
        </li>
      ))}
    </ul>
  );
}
