import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function main(): Promise<void> {
  const byType = await db.execute(
    sql`SELECT type, count(*)::int AS n, min(price)::int AS min_price, max(price)::int AS max_price FROM listings GROUP BY type ORDER BY type`,
  );
  console.log(byType.rows);
  const bbox = await db.execute(
    sql`SELECT count(*)::int AS in_view FROM listings WHERE location && ST_MakeEnvelope(18.36, -33.96, 18.42, -33.89, 4326)`,
  );
  console.log("Cape Town CBD/Atlantic seaboard bbox:", bbox.rows[0]);
  const sample = await db.execute(
    sql`SELECT title, price, ST_Y(location) AS lat, ST_X(location) AS lng, images[1] AS img FROM listings ORDER BY id LIMIT 3`,
  );
  console.log(sample.rows);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
