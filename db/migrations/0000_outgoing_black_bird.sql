CREATE TYPE "public"."property_type" AS ENUM('HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND');--> statement-breakpoint
CREATE TABLE "agents" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"slot" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"area_sqm" integer NOT NULL,
	"type" "property_type" NOT NULL,
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"location" geometry(Point,4326) NOT NULL,
	"address" text NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"agent_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "listings_location_gist" ON "listings" USING gist ("location");--> statement-breakpoint
CREATE INDEX "listings_price_idx" ON "listings" USING btree ("price");