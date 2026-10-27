import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { getDb } from "../lib/db";

async function main(): Promise<void> {
  const db = getDb();
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("Migrations applied");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
