import { eq } from "drizzle-orm";
import { bookings, listings } from "@/db/schema";
import { isAvailableSlot } from "@/lib/booking-slots";
import { db } from "@/lib/db";
import { bookingInputSchema } from "@/lib/schemas";
import type { Booking } from "@/types";

export const dynamic = "force-dynamic";

/** Slots already taken for a listing. Only times are returned, never personal details. */
export async function GET(request: Request): Promise<Response> {
  const listingId = new URL(request.url).searchParams.get("listingId");
  if (!listingId) return Response.json({ error: "listingId is required" }, { status: 400 });

  try {
    const rows = await db.select({ slot: bookings.slot }).from(bookings).where(eq(bookings.listingId, listingId));
    return Response.json({ booked: rows.map((row) => row.slot.toISOString()) });
  } catch {
    return Response.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const parsed = bookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid booking", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  if (!isAvailableSlot(input.slot)) {
    return Response.json({ error: "That time is not available for viewings" }, { status: 422 });
  }

  try {
    const [listing] = await db.select({ id: listings.id }).from(listings).where(eq(listings.id, input.listingId)).limit(1);
    if (!listing) return Response.json({ error: "Listing not found" }, { status: 404 });

    const slot = new Date(input.slot);
    const [created] = await db
      .insert(bookings)
      .values({ id: crypto.randomUUID(), listingId: input.listingId, name: input.name, email: input.email, slot })
      .onConflictDoNothing() // the unique (listing, slot) index decides races
      .returning();

    if (!created) return Response.json({ error: "That slot has just been taken" }, { status: 409 });

    const booking: Booking = { ...created, slot: created.slot.toISOString() };
    return Response.json({ booking }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
