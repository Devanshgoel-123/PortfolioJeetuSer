import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminRequest } from "@/lib/auth";
import { createProject, listAllProjects, listPublishedProjects } from "@/lib/projects";
import { extractYoutubeId } from "@/lib/youtube";
import type { ProjectInput } from "@/types/project";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseProjectBody(body: unknown): ProjectInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const client = typeof data.client === "string" ? data.client.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  const year = typeof data.year === "string" ? data.year.trim() : "";

  if (!client || !category || !year) return null;

  const videosInput = Array.isArray(data.videos) ? data.videos : [];
  const videos = videosInput
    .map((video, index) => {
      if (!video || typeof video !== "object") return null;
      const item = video as Record<string, unknown>;
      const rawId =
        typeof item.youtubeId === "string"
          ? item.youtubeId
          : typeof item.id === "string"
            ? item.id
            : "";
      const youtubeId = extractYoutubeId(rawId);
      const label = typeof item.label === "string" ? item.label.trim() : "";
      if (!youtubeId || !label) return null;
      return {
        youtubeId,
        label,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
      };
    })
    .filter((video): video is NonNullable<typeof video> => video !== null);

  return {
    client,
    category,
    year,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
    published: typeof data.published === "boolean" ? data.published : true,
    videos,
  };
}

async function ensureAdmin(request: Request) {
  if (verifyAdminRequest(request)) return true;
  return isAdminAuthenticated();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    if (includeAll) {
      if (!(await ensureAdmin(request))) {
        return unauthorized();
      }
      const projects = await listAllProjects();
      return NextResponse.json({ projects });
    }

    const projects = await listPublishedProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json(
      { error: "Failed to load projects. Check DATABASE_URL and run migrations." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await ensureAdmin(request))) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const input = parseProjectBody(body);
    if (!input) {
      return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
    }

    const project = await createProject(input);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
