"use client";

import type { ReactNode } from "react";
import { SavedProvider } from "@/features/saved/SavedProvider";

/** Single client boundary for all context providers (wraps children in app/layout.tsx). */
export function Providers({ children }: { children: ReactNode }) {
  return <SavedProvider>{children}</SavedProvider>;
}
