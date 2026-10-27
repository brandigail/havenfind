import type { Agent, Listing, PropertyType } from "@/types";

interface Area {
  name: string;
  lat: number;
  lng: number;
  /** Price multiplier relative to the city average. */
  tier: number;
  streets: string[];
  types: PropertyType[];
}

const AREAS: Area[] = [
  { name: "Sea Point", lat: -33.9166, lng: 18.3878, tier: 1.6, streets: ["Beach Road", "Regent Road", "Main Road"], types: ["APARTMENT", "APARTMENT", "TOWNHOUSE"] },
  { name: "Green Point", lat: -33.9049, lng: 18.4107, tier: 1.5, streets: ["Somerset Road", "Vredehoek Street", "Ebenezer Road"], types: ["APARTMENT", "TOWNHOUSE", "APARTMENT"] },
  { name: "Camps Bay", lat: -33.9503, lng: 18.3777, tier: 2.6, streets: ["Victoria Road", "Kloof Road", "Houghton Road"], types: ["HOUSE", "HOUSE", "APARTMENT"] },
  { name: "Gardens", lat: -33.9358, lng: 18.4106, tier: 1.2, streets: ["Kloof Street", "Orange Street", "Upper Union Street"], types: ["TOWNHOUSE", "HOUSE", "APARTMENT"] },
  { name: "Claremont", lat: -33.9825, lng: 18.4659, tier: 1.0, streets: ["Main Road", "Protea Road", "Cavendish Street"], types: ["HOUSE", "TOWNHOUSE", "APARTMENT"] },
  { name: "Constantia", lat: -34.0285, lng: 18.4237, tier: 2.2, streets: ["Constantia Main Road", "Spaanschemat River Road", "Brommersvlei Road"], types: ["HOUSE", "HOUSE", "LAND"] },
  { name: "Observatory", lat: -33.9378, lng: 18.4721, tier: 0.8, streets: ["Lower Main Road", "Trill Road", "Weltevreden Road"], types: ["HOUSE", "TOWNHOUSE", "APARTMENT"] },
  { name: "Durbanville", lat: -33.8329, lng: 18.6488, tier: 0.9, streets: ["Wellington Road", "Church Street", "Eversdal Road"], types: ["HOUSE", "HOUSE", "TOWNHOUSE", "LAND"] },
];

const AMENITIES = ["Pool", "Garden", "Garage", "Sea view", "Mountain view", "Fibre", "Solar", "Security estate", "Pet friendly", "Braai area", "Backup power", "Gym"];

/** Small deterministic PRNG so every seed run produces identical data. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SEED_AGENTS: Agent[] = [
  { id: "agent-1", name: "Thandi Mokoena", phone: "+27 21 555 0101", email: "thandi@havenfind.example" },
  { id: "agent-2", name: "Liam van der Merwe", phone: "+27 21 555 0102", email: "liam@havenfind.example" },
  { id: "agent-3", name: "Aisha Patel", phone: "+27 21 555 0103", email: "aisha@havenfind.example" },
  { id: "agent-4", name: "Pieter Botha", phone: "+27 21 555 0104", email: "pieter@havenfind.example" },
];

const SPECS: Record<PropertyType, { beds: [number, number]; baths: [number, number]; area: [number, number]; basePrice: number; label: string }> = {
  HOUSE: { beds: [3, 5], baths: [2, 4], area: [180, 420], basePrice: 4_200_000, label: "Family House" },
  APARTMENT: { beds: [1, 3], baths: [1, 2], area: [45, 140], basePrice: 2_300_000, label: "Apartment" },
  TOWNHOUSE: { beds: [2, 4], baths: [2, 3], area: [110, 220], basePrice: 3_000_000, label: "Townhouse" },
  LAND: { beds: [0, 0], baths: [0, 0], area: [400, 1200], basePrice: 1_600_000, label: "Vacant Plot" },
};

const PER_AREA = 6;

export function buildListings(): Listing[] {
  const rand = mulberry32(2026);
  const between = (min: number, max: number): number => min + Math.floor(rand() * (max - min + 1));
  const listings: Listing[] = [];

  AREAS.forEach((area, areaIndex) => {
    for (let i = 0; i < PER_AREA; i += 1) {
      const type = area.types[i % area.types.length];
      const spec = SPECS[type];
      const bedrooms = between(...spec.beds);
      const bathrooms = between(...spec.baths);
      const areaSqm = between(...spec.area);
      const sizeFactor = type === "LAND" ? areaSqm / 800 : 0.7 + (areaSqm - spec.area[0]) / (spec.area[1] - spec.area[0]);
      const price = Math.round((spec.basePrice * area.tier * sizeFactor) / 10_000) * 10_000;
      const amenityCount = type === "LAND" ? 1 : between(3, 6);
      const amenities = [...AMENITIES].sort(() => rand() - 0.5).slice(0, amenityCount).sort();
      const n = areaIndex * PER_AREA + i + 1;
      const variant = between(1, 3);
      const imageBase = type.toLowerCase();
      const street = area.streets[i % area.streets.length];

      listings.push({
        id: `listing-${String(n).padStart(3, "0")}`,
        title: type === "LAND" ? `${areaSqm} m² Plot in ${area.name}` : `${bedrooms} Bed ${spec.label} in ${area.name}`,
        price,
        bedrooms,
        bathrooms,
        areaSqm,
        type,
        amenities,
        // ~1.5 km scatter around the area centre
        lat: Number((area.lat + (rand() - 0.5) * 0.026).toFixed(6)),
        lng: Number((area.lng + (rand() - 0.5) * 0.026).toFixed(6)),
        address: `${between(1, 240)} ${street}, ${area.name}, Cape Town`,
        images: [1, 2, 3].map((k) => `/listings/${imageBase}-${((variant + k - 2) % 3) + 1}.svg`),
        agentId: SEED_AGENTS[n % SEED_AGENTS.length].id,
      });
    }
  });

  return listings;
}
