"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

/** Leaflet only listens to window resizes; this also reacts when the container is shown, hidden or resized. */
export function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}
