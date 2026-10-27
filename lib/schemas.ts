import { z } from "zod";
import type { ListingFilters, MapBounds } from "@/types";

export const propertyTypeSchema = z.enum(["HOUSE", "APARTMENT", "TOWNHOUSE", "LAND"]);
export const sortOptionSchema = z.enum(["price-asc", "price-desc", "newest", "size-desc"]);

export const bookingInputSchema = z.object({
  listingId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  slot: z.iso.datetime({ offset: true }),
});

export const savedListingSchema = z.object({
  listingId: z.string().min(1),
  savedAt: z.iso.datetime({ offset: true }),
});

export const mapBoundsSchema = z
  .object({
    south: z.coerce.number().min(-90).max(90),
    west: z.coerce.number().min(-180).max(180),
    north: z.coerce.number().min(-90).max(90),
    east: z.coerce.number().min(-180).max(180),
  })
  .refine((b) => b.south < b.north, { message: "south must be below north" }) satisfies z.ZodType<MapBounds>;

const csv = <T extends string>(item: z.ZodType<T, string>) =>
  z
    .string()
    .transform((s) => s.split(",").filter(Boolean))
    .pipe(z.array(item));

/** Parses URL search params (strings) into typed filters. */
export const listingFiltersSchema = z.object({
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minBedrooms: z.coerce.number().int().nonnegative().optional(),
  minBathrooms: z.coerce.number().int().nonnegative().optional(),
  minAreaSqm: z.coerce.number().nonnegative().optional(),
  maxAreaSqm: z.coerce.number().nonnegative().optional(),
  types: csv(propertyTypeSchema).optional(),
  amenities: csv(z.string()).optional(),
  sort: sortOptionSchema.default("price-asc"),
}) satisfies z.ZodType<ListingFilters, unknown>;

/** Comma-separated listing ids from a query string (capped to keep URLs and queries small). */
export const idsSchema = z
  .string()
  .transform((s) => s.split(",").filter(Boolean))
  .pipe(z.array(z.string().min(1).max(64)).max(100));
