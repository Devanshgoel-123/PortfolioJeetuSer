import { getDb } from "@/db";
import { media } from "@/db/schema";

export const MAX_MEDIA_BYTES = 3 * 1024 * 1024;

const ALLOWED_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export function isMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("blob:")) return false;
  if (trimmed.startsWith("/")) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function mimeFromFilename(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[ext] ?? null;
}

export async function saveMediaFile(file: File): Promise<string> {
  const mimeType = ALLOWED_MEDIA_TYPES.has(file.type)
    ? file.type
    : mimeFromFilename(file.name);

  if (!mimeType || !ALLOWED_MEDIA_TYPES.has(mimeType)) {
    throw new Error("Thumbnails must be JPEG, PNG, WebP, GIF, or AVIF images.");
  }

  if (file.size > MAX_MEDIA_BYTES) {
    throw new Error("Thumbnail images must be 3MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 180) || "thumbnail";

  const db = getDb();
  const [row] = await db
    .insert(media)
    .values({
      filename,
      mimeType,
      data: buffer.toString("base64"),
    })
    .returning({ id: media.id });

  if (!row) {
    throw new Error("Could not store the thumbnail image.");
  }

  return `/api/media/${row.id}`;
}
