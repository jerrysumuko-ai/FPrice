import { NextResponse } from "next/server";
import { storage } from "@/../server/storage";
import { insertStationSchema } from "@shared/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await storage.listStations();
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/stations error:", err);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = insertStationSchema.parse({
      id: body.id,
      name: body.name,
      address: body.address,
      petrolPrice: body.petrolPrice,
      dieselPrice: body.dieselPrice,
      isOpen: body.isOpen ?? true,
      distance: body.distance ?? "",
      rating: body.rating ?? "0",
      lat: String(body.lat ?? "0"),
      lng: String(body.lng ?? "0"),
      image: body.image ?? "",
      lastUpdated: body.lastUpdated ?? "",
      phone: body.phone ?? null,
      logoUrl: body.logoUrl ?? null,
    });
    const row = await storage.createStation(input);
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/stations error:", err);
    return NextResponse.json({ error: "Failed to create station" }, { status: 400 });
  }
}
