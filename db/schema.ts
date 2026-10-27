import { geometry, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const propertyType = pgEnum("property_type", ["HOUSE", "APARTMENT", "TOWNHOUSE", "LAND"]);

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
});

export const listings = pgTable(
  "listings",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    price: integer("price").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    areaSqm: integer("area_sqm").notNull(),
    type: propertyType("type").notNull(),
    amenities: text("amenities").array().notNull().default([]),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
    address: text("address").notNull(),
    images: text("images").array().notNull().default([]),
    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id),
  },
  (t) => [
    index("listings_location_gist").using("gist", t.location),
    index("listings_price_idx").on(t.price),
  ],
);

export const bookings = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    slot: timestamp("slot", { withTimezone: true }).notNull(),
  },
  // One viewing per listing per time slot; the database enforces it so races can't double-book.
  (t) => [uniqueIndex("bookings_listing_slot_unique").on(t.listingId, t.slot)],
);
