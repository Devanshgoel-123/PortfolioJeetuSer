import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projectImages, projectVideos, projects } from "@/db/schema";
import type { DisplayProject, ProjectInput, WorkKind } from "@/types/project";
import { isWorkKind } from "@/types/project";
import { yt, ytUrl } from "@/lib/youtube";

function asWorkKind(value: string | null | undefined): WorkKind {
  return isWorkKind(value ?? "") ? (value as WorkKind) : "film";
}

export function toDisplayProject(
  project: typeof projects.$inferSelect,
  videos: Array<typeof projectVideos.$inferSelect>,
  images: Array<typeof projectImages.$inferSelect> = [],
): DisplayProject {
  const kind = asWorkKind(project.kind);
  const sortedVideos = [...videos].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryVideo = sortedVideos[0];
  const primaryImage = sortedImages[0];

  const videosDisplay = sortedVideos.map((video) => ({
    id: video.youtubeId,
    label: video.label,
    thumb: video.thumbnail || yt(video.youtubeId),
  }));

  const imagesDisplay = sortedImages.map((image) => ({
    url: image.url,
    label: image.label,
  }));

  const thumb =
    kind === "print"
      ? (primaryImage?.url ?? "")
      : (primaryVideo?.thumbnail || (primaryVideo ? yt(primaryVideo.youtubeId) : ""));

  return {
    id: project.id,
    client: project.client,
    category: project.category,
    year: project.year,
    kind,
    thumb,
    href: primaryVideo ? ytUrl(primaryVideo.youtubeId) : "#",
    videos: videosDisplay,
    images: imagesDisplay,
  };
}

const projectWithMedia = {
  videos: {
    orderBy: asc(projectVideos.sortOrder),
  },
  images: {
    orderBy: asc(projectImages.sortOrder),
  },
} as const;

export async function listPublishedProjects(): Promise<DisplayProject[]> {
  const db = getDb();
  const rows = await db.query.projects.findMany({
    where: eq(projects.published, true),
    with: projectWithMedia,
    orderBy: asc(projects.sortOrder),
  });

  return rows.map((row) => toDisplayProject(row, row.videos, row.images));
}

export async function listAllProjects(): Promise<DisplayProject[]> {
  const db = getDb();
  const rows = await db.query.projects.findMany({
    with: projectWithMedia,
    orderBy: asc(projects.sortOrder),
  });

  return rows.map((row) => toDisplayProject(row, row.videos, row.images));
}

export async function getProjectById(id: number) {
  const db = getDb();
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: projectWithMedia,
  });
}

export async function createProject(input: ProjectInput) {
  const db = getDb();

  const [project] = await db
    .insert(projects)
    .values({
      client: input.client,
      category: input.category,
      year: input.year,
      kind: input.kind,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
    })
    .returning();

  if (input.kind === "film" && input.videos.length > 0) {
    await db.insert(projectVideos).values(
      input.videos.map((video, index) => ({
        projectId: project.id,
        youtubeId: video.youtubeId,
        label: video.label,
        thumbnail: video.thumbnail || null,
        sortOrder: video.sortOrder ?? index,
      })),
    );
  }

  if (input.kind === "print" && input.images.length > 0) {
    await db.insert(projectImages).values(
      input.images.map((image, index) => ({
        projectId: project.id,
        url: image.url,
        label: image.label,
        sortOrder: image.sortOrder ?? index,
      })),
    );
  }

  return getProjectById(project.id);
}

export async function updateProject(id: number, input: ProjectInput) {
  const db = getDb();

  await db
    .update(projects)
    .set({
      client: input.client,
      category: input.category,
      year: input.year,
      kind: input.kind,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  await db.delete(projectVideos).where(eq(projectVideos.projectId, id));
  await db.delete(projectImages).where(eq(projectImages.projectId, id));

  if (input.kind === "film" && input.videos.length > 0) {
    await db.insert(projectVideos).values(
      input.videos.map((video, index) => ({
        projectId: id,
        youtubeId: video.youtubeId,
        label: video.label,
        thumbnail: video.thumbnail || null,
        sortOrder: video.sortOrder ?? index,
      })),
    );
  }

  if (input.kind === "print" && input.images.length > 0) {
    await db.insert(projectImages).values(
      input.images.map((image, index) => ({
        projectId: id,
        url: image.url,
        label: image.label,
        sortOrder: image.sortOrder ?? index,
      })),
    );
  }

  return getProjectById(id);
}

export async function listAllProjectsForAdmin() {
  const db = getDb();
  return db.query.projects.findMany({
    with: projectWithMedia,
    orderBy: asc(projects.sortOrder),
  });
}

export async function deleteProject(id: number) {
  const db = getDb();
  await db.delete(projects).where(eq(projects.id, id));
}
