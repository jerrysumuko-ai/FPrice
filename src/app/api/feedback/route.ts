import { NextResponse } from "next/server";
import { storage } from "@/../server/storage";
import { insertFeedbackSchema } from "@shared/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = insertFeedbackSchema.parse({
      stationId: body.stationId ?? null,
      subject: body.subject,
      message: body.message,
    });
    await storage.createFeedback(input);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 400 });
  }
}
