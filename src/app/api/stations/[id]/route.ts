import { NextResponse } from "next/server";
import { storage } from "@/../server/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const row = await storage.getStation(id);
    if (!row) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (err) {
    console.error("GET /api/stations/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch station" }, { status: 500 });
  }
}
