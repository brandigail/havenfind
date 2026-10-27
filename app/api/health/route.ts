import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const res = await getDb().execute(sql`SELECT postgis_version() AS postgis`);
    return Response.json({ ok: true, postgis: res.rows[0]?.postgis ?? null });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
