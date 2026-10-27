import { count } from "drizzle-orm";
import { agents, bookings, listings } from "../db/schema";
import { SEED_AGENTS, buildListings } from "../db/seed-data";
import { db } from "../lib/db";

async function main(): Promise<void> {
  const rows = buildListings();

  // Reseeding is idempotent: clear in FK order, then insert in one batch.
  await db.batch([
    db.delete(bookings),
    db.delete(listings),
    db.delete(agents),
    db.insert(agents).values(SEED_AGENTS),
    db.insert(listings).values(
      rows.map(({ lat, lng, ...rest }) => ({ ...rest, location: { x: lng, y: lat } })),
    ),
  ]);

  const [a] = await db.select({ n: count() }).from(agents);
  const [l] = await db.select({ n: count() }).from(listings);
  console.log(`Seeded ${a.n} agents and ${l.n} listings`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
