"use client";

import { useCallback, useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { MapBounds } from "@/types";

interface ViewportReporterProps {
  onBoundsChange: (bounds: MapBounds) => void;
}

/** Reports the visible bounds once on mount and after every pan/zoom. */
export function ViewportReporter({ onBoundsChange }: ViewportReporterProps) {
  const map = useMap();

  const report = useCallback((): void => {
    const b = map.getBounds();
    const bounds = { south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() };
    // A hidden (zero-size) map has empty bounds, which the API rejects, so wait until it is visible.
    if (bounds.south >= bounds.north || bounds.west >= bounds.east) return;
    onBoundsChange(bounds);
  }, [map, onBoundsChange]);

  useMapEvents({ moveend: report });
  useEffect(report, [report]);

  return null;
}
