import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "listings");
mkdirSync(outDir, { recursive: true });

const palettes: Record<string, [string, string][]> = {
  house: [["#0f766e", "#5eead4"], ["#1d4ed8", "#93c5fd"], ["#b45309", "#fcd34d"]],
  apartment: [["#6d28d9", "#c4b5fd"], ["#0369a1", "#7dd3fc"], ["#be123c", "#fda4af"]],
  townhouse: [["#15803d", "#86efac"], ["#a16207", "#fde047"], ["#334155", "#cbd5e1"]],
  land: [["#4d7c0f", "#bef264"], ["#854d0e", "#fcd34d"], ["#166534", "#bbf7d0"]],
};

for (const [type, variants] of Object.entries(palettes)) {
  variants.forEach(([dark, light], i) => {
    const label = `${type} ${i + 1}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Placeholder ${label}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <path d="M300 480 600 250l300 230v200H300z" fill="#ffffff" fill-opacity=".85"/>
  <rect x="540" y="540" width="120" height="140" fill="${dark}"/>
  <text x="600" y="740" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#ffffff">${label} (placeholder)</text>
</svg>
`;
    writeFileSync(join(outDir, `${type}-${i + 1}.svg`), svg);
  });
}
console.log("Placeholders written to public/listings");
