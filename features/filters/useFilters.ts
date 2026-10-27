"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { filtersToParams, parseFilters } from "@/lib/filters";
import type { ListingFilters } from "@/types";

interface UseFilters {
  filters: ListingFilters;
  /** Serialised filters, stable between renders; used as a fetch dependency. */
  filterQuery: string;
  setFilters: (next: ListingFilters) => void;
}

/** Filters live in the URL so a search can be shared and survives a reload. */
export function useFilters(): UseFilters {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const filterQuery = useMemo(() => filtersToParams(filters).toString(), [filters]);

  const setFilters = useCallback((next: ListingFilters) => {
    const query = filtersToParams(next).toString();
    // Next.js syncs history.replaceState with useSearchParams, so no server round trip is needed.
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, []);

  return { filters, filterQuery, setFilters };
}
