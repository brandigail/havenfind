import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/features/booking/BookingForm";
import { Gallery } from "@/features/listing-detail/Gallery";
import { MortgageCalculator } from "@/features/listing-detail/MortgageCalculator";
import { SaveButton } from "@/features/saved/SaveButton";
import { formatPrice } from "@/lib/format";
import { getListingDetail } from "@/lib/listings/get";

export const dynamic = "force-dynamic";

const TYPE_LABEL = { HOUSE: "House", APARTMENT: "Apartment", TOWNHOUSE: "Townhouse", LAND: "Land" } as const;

export async function generateMetadata({ params }: PageProps<"/listings/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getListingDetail(id);
  return detail
    ? { title: `${detail.listing.title} | HavenFind`, description: `${formatPrice(detail.listing.price)} · ${detail.listing.address}` }
    : { title: "Listing not found | HavenFind" };
}

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const detail = await getListingDetail(id);
  if (!detail) notFound();

  const { listing, agent } = detail;
  const isLand = listing.type === "LAND";
  const facts = [
    ...(isLand
      ? []
      : [
          `${listing.bedrooms} ${listing.bedrooms === 1 ? "bedroom" : "bedrooms"}`,
          `${listing.bathrooms} ${listing.bathrooms === 1 ? "bathroom" : "bathrooms"}`,
        ]),
    `${listing.areaSqm} m²`,
    TYPE_LABEL[listing.type],
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-teal-700 underline dark:text-teal-400">
          ← Back to map
        </Link>
        <SaveButton listingId={listing.id} withLabel />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Gallery images={listing.images} title={listing.title} />

        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <p className="text-3xl font-semibold">{formatPrice(listing.price)}</p>
            <h1 className="text-lg">{listing.title}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{listing.address}</p>
          </header>

          <ul className="flex flex-wrap gap-2 text-sm">
            {facts.map((fact) => (
              <li key={fact} className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                {fact}
              </li>
            ))}
          </ul>

          <section aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="mb-2 text-sm font-semibold">
              Amenities
            </h2>
            <ul className="flex flex-wrap gap-1.5 text-xs">
              {listing.amenities.map((amenity) => (
                <li key={amenity} className="rounded-full border border-zinc-300 px-2.5 py-1 dark:border-zinc-700">
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <MortgageCalculator price={listing.price} />

          <BookingForm listingId={listing.id} agentName={agent.name} />

          <section aria-labelledby="agent-heading" className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <h2 id="agent-heading" className="mb-1 font-semibold">
              Listing agent
            </h2>
            <p>{agent.name}</p>
            <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="block text-teal-700 underline dark:text-teal-400">
              {agent.phone}
            </a>
            <a href={`mailto:${agent.email}`} className="block text-teal-700 underline dark:text-teal-400">
              {agent.email}
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
