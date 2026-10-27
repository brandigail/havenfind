"use client";

import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { formatPrice, formatPriceCompact } from "@/lib/format";
import type { Listing } from "@/types";

interface ClusterLayerProps {
  listings: Listing[];
}

function pinIcon(listing: Listing): L.DivIcon {
  const label = document.createElement("span");
  label.className = "hf-pin";
  label.textContent = formatPriceCompact(listing.price);
  return L.divIcon({ html: label, className: "hf-pin-wrap", iconSize: [0, 0] });
}

function popupContent(listing: Listing): HTMLElement {
  const root = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = listing.title;
  const price = document.createElement("div");
  price.textContent = formatPrice(listing.price);
  root.append(title, price);
  return root;
}

export function ClusterLayer({ listings }: ClusterLayerProps) {
  const map = useMap();

  useEffect(() => {
    let cancelled = false;
    let group: L.MarkerClusterGroup | undefined;

    async function mount(): Promise<void> {
      // leaflet.markercluster extends a global `L`, so expose it before loading the plugin.
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet.markercluster");
      if (cancelled) return;

      group = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });
      group.addLayers(
        listings.map((listing) =>
          L.marker([listing.lat, listing.lng], { icon: pinIcon(listing), title: listing.title }).bindPopup(
            popupContent(listing),
          ),
        ),
      );
      map.addLayer(group);
    }

    void mount();
    return () => {
      cancelled = true;
      if (group) map.removeLayer(group);
    };
  }, [map, listings]);

  return null;
}
