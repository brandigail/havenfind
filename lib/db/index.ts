import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

type Database = ReturnType<typeof drizzle>;

let instance: Database | undefined;

/**
 * Connects on first use, not at import, so `next build` works without a database
 * (Next imports route modules while collecting page data).
 */
export function getDb(): Database {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
    instance = drizzle(neon(url));
  }
  return instance;
}
