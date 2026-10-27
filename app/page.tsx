import { Suspense } from "react";
import { Explorer } from "@/features/explorer/Explorer";

export default function Home() {
  // Explorer reads URL search params (filters), which requires a Suspense boundary.
  return (
    <Suspense>
      <Explorer />
    </Suspense>
  );
}
