"use client";

import { useSaved } from "./SavedProvider";

interface SaveButtonProps {
  listingId: string;
  /** Shows a text label next to the heart (used on the detail page). */
  withLabel?: boolean;
  className?: string;
}

export function SaveButton({ listingId, withLabel = false, className = "" }: SaveButtonProps) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(listingId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved homes" : "Save home"}
      onClick={() => toggle(listingId)}
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-teal-600 ${
        saved ? "text-rose-600" : "text-zinc-500 hover:text-rose-600"
      } ${className}`}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        {saved ? "♥" : "♡"}
      </span>
      {withLabel && <span className="font-medium">{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
