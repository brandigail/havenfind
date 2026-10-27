import Link from "next/link";

export default function ListingNotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-start gap-3 p-8">
      <h1 className="text-2xl font-semibold">Listing not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">This home may have been sold or the link is wrong.</p>
      <Link href="/" className="font-medium text-teal-700 underline dark:text-teal-400">
        Back to the map
      </Link>
    </main>
  );
}
