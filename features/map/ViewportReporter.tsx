"use client";

import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { MapBounds } from "@/types";

interface ViewportReporterProps {
  onBoundsChange: (bounds: MapBounds) => void;
}

/** Reports the visible bounds once on mount and after every pan/zoom. */
export function ViewportReporter({ onBoundsChange }: ViewportReporterProps) {
  const map = useMap();

  const report = (): void => {
    const b = map.getBounds();
    onBoundsChange({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() });
  };

  useMapEvents({ moveend: report });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- report once on mount only
  useEffect(report, []);

  return null;
}
