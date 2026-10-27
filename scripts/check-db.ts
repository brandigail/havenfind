import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function main(): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
  const res = await db.execute(
    sql`SELECT postgis_version() AS postgis, version() AS pg, ST_AsText(ST_MakePoint(18.42, -33.92)) AS point`,
  );
  console.log(res.rows[0]);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
