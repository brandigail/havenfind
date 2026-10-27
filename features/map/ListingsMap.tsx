"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Listing, MapBounds } from "@/types";
import { ClusterLayer } from "./ClusterLayer";
import { ViewportReporter } from "./ViewportReporter";

const CAPE_TOWN: [number, number] = [-33.95, 18.45];

export interface ListingsMapProps {
  listings: Listing[];
  onBoundsChange: (bounds: MapBounds) => void;
}

export default function ListingsMap({ listings, onBoundsChange }: ListingsMapProps) {
  return (
    <MapContainer center={CAPE_TOWN} zoom={11} className="h-full w-full" aria-label="Map of property listings">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ViewportReporter onBoundsChange={onBoundsChange} />
      <ClusterLayer listings={listings} />
    </MapContainer>
  );
}
