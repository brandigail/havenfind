import { and, arrayContains, asc, desc, gte, inArray, lte, sql, type SQL } from "drizzle-orm";
import { listings } from "@/db/schema";
import { db } from "@/lib/db";
import type { Listing, ListingFilters, MapBounds } from "@/types";

export const MAX_RESULTS = 500;

/** Columns matching the `Listing` interface; lat/lng are derived from the PostGIS point. */
export const listingColumns = {
  id: listings.id,
  title: listings.title,
  price: listings.price,
  bedrooms: listings.bedrooms,
  bathrooms: listings.bathrooms,
  areaSqm: listings.areaSqm,
  type: listings.type,
  amenities: listings.amenities,
  lat: sql<number>`ST_Y(${listings.location})`,
  lng: sql<number>`ST_X(${listings.location})`,
  address: listings.address,
  images: listings.images,
  agentId: listings.agentId,
};

const ORDER = {
  "price-asc": [asc(listings.price)],
  "price-desc": [desc(listings.price)],
  "size-desc": [desc(listings.areaSqm)],
  newest: [desc(listings.id)],
} as const;

function buildWhere(filters: ListingFilters, bounds?: MapBounds, ids?: string[]): SQL | undefined {
  const conditions: (SQL | undefined)[] = [
    ids ? inArray(listings.id, ids) : undefined,
    // `&&` uses the GIST index on listings.location
    bounds
      ? sql`${listings.location} && ST_MakeEnvelope(${bounds.west}, ${bounds.south}, ${bounds.east}, ${bounds.north}, 4326)`
      : undefined,
    filters.minPrice !== undefined ? gte(listings.price, filters.minPrice) : undefined,
    filters.maxPrice !== undefined ? lte(listings.price, filters.maxPrice) : undefined,
    filters.minBedrooms !== undefined ? gte(listings.bedrooms, filters.minBedrooms) : undefined,
    filters.minBathrooms !== undefined ? gte(listings.bathrooms, filters.minBathrooms) : undefined,
    filters.minAreaSqm !== undefined ? gte(listings.areaSqm, filters.minAreaSqm) : undefined,
    filters.maxAreaSqm !== undefined ? lte(listings.areaSqm, filters.maxAreaSqm) : undefined,
    filters.types?.length ? inArray(listings.type, filters.types) : undefined,
    filters.amenities?.length ? arrayContains(listings.amenities, filters.amenities) : undefined,
  ];
  return and(...conditions);
}

export interface ListingsResult {
  listings: Listing[];
  /** Total matches before the MAX_RESULTS cap. */
  total: number;
}

export async function queryListings(
  filters: ListingFilters,
  bounds?: MapBounds,
  ids?: string[],
): Promise<ListingsResult> {
  const where = buildWhere(filters, bounds, ids);

  const [rows, [totalRow]] = await Promise.all([
    db
      .select(listingColumns)
      .from(listings)
      .where(where)
      .orderBy(...ORDER[filters.sort])
      .limit(MAX_RESULTS),
    db.select({ total: sql<number>`count(*)::int` }).from(listings).where(where),
  ]);

  return { listings: rows, total: totalRow.total };
}
