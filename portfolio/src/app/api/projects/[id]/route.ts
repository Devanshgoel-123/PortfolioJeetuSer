import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminRequest } from "@/lib/auth";
import { deleteProject, getProjectById, toDisplayProject, updateProject } from "@/lib/projects";
import { extractYoutubeId } from "@/lib/youtube";
import type { ProjectInput } from "@/types/project";

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

    return NextResponse.json({ project: toDisplayProject(project, project.videos) });
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

    return NextResponse.json({ project: toDisplayProject(project, project.videos) });
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
