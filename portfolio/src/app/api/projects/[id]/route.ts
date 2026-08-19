import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminRequest } from "@/lib/auth";
import { isMediaUrl } from "@/lib/media";
import { deleteProject, getProjectById, toDisplayProject, updateProject } from "@/lib/projects";
import { extractYoutubeId } from "@/lib/youtube";
import type { ProjectInput } from "@/types/project";
import { isWorkKind } from "@/types/project";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseProjectBody(body: unknown): ProjectInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const client = typeof data.client === "string" ? data.client.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  const year = typeof data.year === "string" ? data.year.trim() : "";
  const kindValue = typeof data.kind === "string" ? data.kind.trim() : "film";

  if (!client || !category || !year || !isWorkKind(kindValue)) return null;

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
      const thumbnail = typeof item.thumbnail === "string" ? item.thumbnail.trim() : "";
      if (!youtubeId || !label) return null;
      return {
        youtubeId,
        label,
        thumbnail: isMediaUrl(thumbnail) ? thumbnail : undefined,
        featured: item.featured === true,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
      };
    })
    .filter((video): video is NonNullable<typeof video> => video !== null);

  const imagesInput = Array.isArray(data.images) ? data.images : [];
  const images = imagesInput
    .map((image, index) => {
      if (!image || typeof image !== "object") return null;
      const item = image as Record<string, unknown>;
      const url = typeof item.url === "string" ? item.url.trim() : "";
      const label = typeof item.label === "string" ? item.label.trim() : "";
      if (!isMediaUrl(url)) return null;
      return {
        url,
        label: label || `Image ${index + 1}`,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
      };
    })
    .filter((image): image is NonNullable<typeof image> => image !== null);

  return {
    client,
    category,
    year,
    kind: kindValue,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
    published: typeof data.published === "boolean" ? data.published : true,
    videos: kindValue === "film" ? videos : [],
    images: kindValue === "print" ? images : [],
  };
}

async function ensureAdmin(request: Request) {
  if (verifyAdminRequest(request)) return true;
  return isAdminAuthenticated();
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: toDisplayProject(project, project.videos, project.images) });
  } catch (error) {
    console.error("GET /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await ensureAdmin(request))) {
    return unauthorized();
  }

  try {
    const { id } = await context.params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const body = await request.json();
    const input = parseProjectBody(body);
    if (!input) {
      return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
    }

    const project = await updateProject(projectId, input);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: toDisplayProject(project, project.videos, project.images) });
  } catch (error) {
    console.error("PUT /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await ensureAdmin(request))) {
    return unauthorized();
  }

  try {
    const { id } = await context.params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    await deleteProject(projectId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
