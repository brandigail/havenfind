import { eq } from "drizzle-orm";
import { agents, listings } from "@/db/schema";
import { db } from "@/lib/db";
import type { Agent, Listing } from "@/types";
import { listingColumns } from "./query";

export interface ListingDetail {
  listing: Listing;
  agent: Agent;
}

export async function getListingDetail(id: string): Promise<ListingDetail | null> {
  const [listing] = await db.select(listingColumns).from(listings).where(eq(listings.id, id)).limit(1);
  if (!listing) return null;

  const [agent] = await db.select().from(agents).where(eq(agents.id, listing.agentId)).limit(1);
  return agent ? { listing, agent } : null;
}
