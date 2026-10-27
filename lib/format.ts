const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return zar.format(value).replace(/\s/g, " ");
}

/** Short price for map pins, e.g. R2.6M or R950K. */
export function formatPriceCompact(value: number): string {
  if (value >= 1_000_000) return `R${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  return `R${Math.round(value / 1_000)}K`;
}
