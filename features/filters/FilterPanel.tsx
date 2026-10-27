"use client";

import { useId, useState } from "react";
import { AMENITIES } from "@/lib/amenities";
import { DEFAULT_FILTERS, countActiveFilters } from "@/lib/filters";
import { formatPriceCompact } from "@/lib/format";
import type { ListingFilters, PropertyType, SortOption } from "@/types";
import { NumberSelect, ToggleGroup } from "./fields";

interface FilterPanelProps {
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
}

const PRICES = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000];
const AREAS = [50, 100, 150, 200, 300, 400, 600, 800, 1000];

const priceOptions = PRICES.map((value) => ({ value, label: formatPriceCompact(value) }));
const areaOptions = AREAS.map((value) => ({ value, label: `${value} m²` }));
const plusOptions = (max: number) =>
  Array.from({ length: max }, (_, i) => ({ value: i + 1, label: `${i + 1}+` }));

const TYPES: { value: PropertyType; label: string }[] = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "LAND", label: "Land" },
];
const AMENITY_OPTIONS = AMENITIES.map((value) => ({ value, label: value }));

const SORTS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "size-desc", label: "Largest first" },
  { value: "newest", label: "Newest" },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const sortId = useId();
  const activeCount = countActiveFilters(filters);

  const patch = (changes: Partial<ListingFilters>): void => onChange({ ...filters, ...changes });
  const upTo = (min: number | undefined, options: { value: number; label: string }[]) =>
    min === undefined ? options : options.filter((option) => option.value > min);
  const downTo = (max: number | undefined, options: { value: number; label: string }[]) =>
    max === undefined ? options : options.filter((option) => option.value < max);

  return (
    <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-zinc-700"
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        <label htmlFor={sortId} className="sr-only">
          Sort by
        </label>
        <select
          id={sortId}
          value={filters.sort}
          onChange={(e) => patch({ sort: e.target.value as SortOption })}
          className="ml-auto min-w-0 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {SORTS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>

      {open && (
        <div id={panelId} className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <NumberSelect label="Min price" anyLabel="No min" value={filters.minPrice} options={downTo(filters.maxPrice, priceOptions)} onChange={(minPrice) => patch({ minPrice })} />
            <NumberSelect label="Max price" anyLabel="No max" value={filters.maxPrice} options={upTo(filters.minPrice, priceOptions)} onChange={(maxPrice) => patch({ maxPrice })} />
            <NumberSelect label="Bedrooms" anyLabel="Any" value={filters.minBedrooms} options={plusOptions(5)} onChange={(minBedrooms) => patch({ minBedrooms })} />
            <NumberSelect label="Bathrooms" anyLabel="Any" value={filters.minBathrooms} options={plusOptions(4)} onChange={(minBathrooms) => patch({ minBathrooms })} />
            <NumberSelect label="Min size" anyLabel="No min" value={filters.minAreaSqm} options={downTo(filters.maxAreaSqm, areaOptions)} onChange={(minAreaSqm) => patch({ minAreaSqm })} />
            <NumberSelect label="Max size" anyLabel="No max" value={filters.maxAreaSqm} options={upTo(filters.minAreaSqm, areaOptions)} onChange={(maxAreaSqm) => patch({ maxAreaSqm })} />
          </div>
          <ToggleGroup legend="Property type" options={TYPES} selected={filters.types ?? []} onChange={(types) => patch({ types: types.length ? types : undefined })} />
          <ToggleGroup legend="Amenities" options={AMENITY_OPTIONS} selected={filters.amenities ?? []} onChange={(amenities) => patch({ amenities: amenities.length ? amenities : undefined })} />
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...DEFAULT_FILTERS, sort: filters.sort })}
              className="self-start text-sm font-medium text-teal-700 underline dark:text-teal-400"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
