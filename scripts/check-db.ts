import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function main(): Promise<void> {
  const ext = await db.execute(sql`SELECT postgis_version() AS postgis`);
  const idx = await db.execute(
    sql`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'listings' ORDER BY indexname`,
  );
  const col = await db.execute(
    sql`SELECT type, srid FROM geometry_columns WHERE f_table_name = 'listings'`,
  );
  console.log(ext.rows[0], col.rows, idx.rows);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
