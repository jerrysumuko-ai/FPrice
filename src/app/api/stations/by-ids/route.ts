import { NextResponse } from "next/server";
import { storage } from "@/../server/storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
    const rows = await storage.getStationsByIds(ids);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("POST /api/stations/by-ids error:", err);
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}
