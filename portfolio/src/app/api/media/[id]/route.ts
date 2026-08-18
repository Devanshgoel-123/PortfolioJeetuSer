import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { media } from "@/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const mediaId = Number(id);
  if (!Number.isInteger(mediaId) || mediaId < 1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const db = getDb();
    const [row] = await db.select().from(media).where(eq(media.id, mediaId)).limit(1);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = Buffer.from(row.data, "base64");
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": row.mimeType,
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/media/[id] failed:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
