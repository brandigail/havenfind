import type { Metadata } from "next";
import Link from "next/link";
import { SavedHomes } from "@/features/saved/SavedHomes";

export const metadata: Metadata = { title: "Saved homes | HavenFind" };

export default function SavedPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 p-4 lg:p-8">
      <Link href="/" className="self-start text-sm font-medium text-teal-700 underline dark:text-teal-400">
        ← Back to map
      </Link>
      <h1 className="text-2xl font-semibold">Saved homes</h1>
      <SavedHomes />
    </main>
  );
}
