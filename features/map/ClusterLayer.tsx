"use client";

import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { formatPrice, formatPriceCompact } from "@/lib/format";
import type { Listing } from "@/types";

interface ClusterLayerProps {
  listings: Listing[];
  /** Highlighted pin (hovered or selected card). */
  activeId: string | null;
  /** Pin to reveal and open when chosen from the list. */
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

interface MarkerEntry {
  marker: L.Marker;
  listing: Listing;
}

function pinIcon(listing: Listing, active: boolean): L.DivIcon {
  const label = document.createElement("span");
  label.className = active ? "hf-pin hf-pin--active" : "hf-pin";
  label.textContent = formatPriceCompact(listing.price);
  return L.divIcon({ html: label, className: "hf-pin-wrap", iconSize: [0, 0] });
}

function popupContent(listing: Listing): HTMLElement {
  const root = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = listing.title;
  const price = document.createElement("div");
  price.textContent = formatPrice(listing.price);
  const link = document.createElement("a");
  link.href = `/listings/${listing.id}`;
  link.textContent = "View details";
  root.append(title, price, link);
  return root;
}

export function ClusterLayer({ listings, activeId, selectedId, onHover, onSelect }: ClusterLayerProps) {
  const map = useMap();
  const entries = useRef(new Map<string, MarkerEntry>());
  const [group, setGroup] = useState<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: L.MarkerClusterGroup | undefined;

    async function mount(): Promise<void> {
      // leaflet.markercluster extends a global `L`, so expose it before loading the plugin.
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet.markercluster");
      if (cancelled) return;

      const next = new Map<string, MarkerEntry>();
      const markers = listings.map((listing) => {
        const marker = L.marker([listing.lat, listing.lng], { icon: pinIcon(listing, false), title: listing.title })
          .bindPopup(popupContent(listing))
          .on("click", () => onSelect(listing.id))
          .on("mouseover", () => onHover(listing.id))
          .on("mouseout", () => onHover(null));
        next.set(listing.id, { marker, listing });
        return marker;
      });

      created = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });
      created.addLayers(markers);
      map.addLayer(created);
      entries.current = next;
      setGroup(created);
    }

    void mount();
    return () => {
      cancelled = true;
      if (created) map.removeLayer(created);
      entries.current = new Map();
      setGroup(null);
    };
  }, [map, listings, onHover, onSelect]);

  // Highlight the active pin; setIcon also works while the marker is hidden inside a cluster.
  useEffect(() => {
    const entry = group && activeId ? entries.current.get(activeId) : undefined;
    if (!entry) return;
    entry.marker.setIcon(pinIcon(entry.listing, true)).setZIndexOffset(1000);
    return () => {
      entry.marker.setIcon(pinIcon(entry.listing, false)).setZIndexOffset(0);
    };
  }, [group, activeId]);

  // Zoom out of any cluster hiding the selected pin, then open its popup.
  useEffect(() => {
    const entry = group && selectedId ? entries.current.get(selectedId) : undefined;
    if (!group || !entry) return;
    map.invalidateSize(); // the map may have just been revealed on mobile
    group.zoomToShowLayer(entry.marker, () => entry.marker.openPopup());
  }, [map, group, selectedId]);

  return null;
}
