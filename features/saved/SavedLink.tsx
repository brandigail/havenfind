"use client";

import Link from "next/link";
import { useSaved } from "./SavedProvider";

export function SavedLink() {
  const { saved, ready } = useSaved();

  return (
    <Link
      href="/saved"
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-zinc-700"
    >
      ♥ Saved{ready && saved.length > 0 ? ` (${saved.length})` : ""}
    </Link>
  );
}
