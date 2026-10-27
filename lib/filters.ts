import { listingFiltersSchema } from "@/lib/schemas";
import type { ListingFilters } from "@/types";

export const DEFAULT_FILTERS: ListingFilters = { sort: "price-asc" };

type ParamSource = { entries(): IterableIterator<[string, string]> };

/** Reads filters from URL search params; an invalid URL falls back to defaults. */
export function parseFilters(params: ParamSource): ListingFilters {
  const result = listingFiltersSchema.safeParse(Object.fromEntries(params.entries()));
  return result.success ? result.data : DEFAULT_FILTERS;
}

/** Serialises filters, omitting unset values and the default sort so URLs stay short. */
export function filtersToParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();
  const numeric = {
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minBedrooms: filters.minBedrooms,
    minBathrooms: filters.minBathrooms,
    minAreaSqm: filters.minAreaSqm,
    maxAreaSqm: filters.maxAreaSqm,
  };
  for (const [key, value] of Object.entries(numeric)) {
    if (value !== undefined) params.set(key, String(value));
  }
  if (filters.types?.length) params.set("types", filters.types.join(","));
  if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  return params;
}

/** Number of active filters, excluding sort. */
export function countActiveFilters(filters: ListingFilters): number {
  const { sort, ...rest } = filters;
  void sort;
  return Object.values(rest).filter((value) => (Array.isArray(value) ? value.length > 0 : value !== undefined)).length;
}
