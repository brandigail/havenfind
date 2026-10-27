export type PropertyType = "HOUSE" | "APARTMENT" | "TOWNHOUSE" | "LAND";

export type SortOption = "price-asc" | "price-desc" | "newest" | "size-desc";

export interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  type: PropertyType;
  amenities: string[];
  lat: number;
  lng: number;
  address: string;
  images: string[];
  agentId: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Booking {
  id: string;
  listingId: string;
  name: string;
  email: string;
  slot: string;
}

export interface SavedListing {
  listingId: string;
  savedAt: string;
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minAreaSqm?: number;
  maxAreaSqm?: number;
  types?: PropertyType[];
  amenities?: string[];
  sort: SortOption;
}
