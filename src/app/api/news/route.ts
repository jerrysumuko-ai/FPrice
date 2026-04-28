import { NextResponse } from "next/server";
import { storage } from "@/../server/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await storage.listNewsAlerts();
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/news error:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
