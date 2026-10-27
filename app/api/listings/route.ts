import { queryListings } from "@/lib/listings/query";
import { idsSchema, listingFiltersSchema, mapBoundsSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

const BOUNDS_KEYS = ["south", "west", "north", "east"] as const;

export async function GET(request: Request): Promise<Response> {
  const params = Object.fromEntries(new URL(request.url).searchParams);

  const filters = listingFiltersSchema.safeParse(params);
  if (!filters.success) {
    return Response.json({ error: "Invalid filters", issues: filters.error.issues }, { status: 400 });
  }

  // Bounds are optional, but if any edge is supplied all four must be valid.
  const hasBounds = BOUNDS_KEYS.some((key) => key in params);
  const bounds = hasBounds ? mapBoundsSchema.safeParse(params) : undefined;
  if (bounds && !bounds.success) {
    return Response.json({ error: "Invalid bounds", issues: bounds.error.issues }, { status: 400 });
  }

  // Optional comma-separated ids (used by the saved homes page). An empty list matches nothing.
  const ids = "ids" in params ? idsSchema.safeParse(params.ids) : undefined;
  if (ids && !ids.success) {
    return Response.json({ error: "Invalid ids", issues: ids.error.issues }, { status: 400 });
  }
  if (ids?.data.length === 0) return Response.json({ listings: [], total: 0 });

  try {
    return Response.json(await queryListings(filters.data, bounds?.data, ids?.data));
  } catch {
    return Response.json({ error: "Failed to load listings" }, { status: 500 });
  }
}
