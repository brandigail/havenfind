# HavenFind: Real Estate Discovery Portal

Read the portfolio-root `CLAUDE.md` first for global rules. This file is the brief for this project.

## What it is
A property discovery site. Users pan an interactive map, filter by price, beds, size and amenities, estimate mortgage payments, bookmark homes and book a viewing slot with an agent.

## Stack
Next.js (App Router), TypeScript strict, Tailwind CSS, Leaflet + react-leaflet with OpenStreetMap tiles, leaflet.markercluster, Drizzle with Neon Postgres (PostGIS extension). Hosted on Netlify. No Mapbox, no Supabase. No Supabase, no Vercel, no Gemini/OpenAI.

## MVP (build first)
1. Map + list view: listings from PostGIS bounding-box query for the current viewport, clustered pins, hover/click syncing with cards.
2. Filters: price range, bedrooms, bathrooms, square footage, property type, amenities; URL-synced state; sort.
3. Listing detail page with local image gallery, mortgage estimator (price, deposit, rate, term), and saved/bookmarked homes.

## Phase 2
Agent viewing booking calendar, Draw-a-boundary polygon search, Compare listings, Email alert signups (stored only).

## Data model (put in `types/`)
```ts
export interface Listing { id: string; title: string; price: number; bedrooms: number; bathrooms: number; areaSqm: number; type: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND'; amenities: string[]; lat: number; lng: number; address: string; images: string[]; agentId: string }
export interface Agent { id: string; name: string; phone: string; email: string }
export interface Booking { id: string; listingId: string; name: string; email: string; slot: string }
export interface SavedListing { listingId: string; savedAt: string }
```

## Rules specific to this project
- Map components must be client-only (dynamic import, `ssr: false`) to avoid hydration errors.
- Enable PostGIS with `CREATE EXTENSION IF NOT EXISTS postgis` and use a GIST index on the geometry column.
- Property images are stored locally under `/public` (placeholders listed in `TODO-ASSETS.md`); never hotlink.
- Saved homes live in localStorage (read after mount only) unless accounts are added.
- Seed 40+ realistic listings clustered around one city.
- Seed realistic demo data so the app looks alive on first load without sign-up.

## Start here
1. Ask me for the Neon `DATABASE_URL` and confirm PostGIS can be enabled.
2. Scaffold Next.js + Tailwind + Drizzle, commit.
3. Work through `PLAN.md` from step 2.
