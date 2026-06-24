import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projectVideos, projects } from "@/db/schema";
import type { DisplayProject, ProjectInput } from "@/types/project";
import { yt, ytUrl } from "@/lib/youtube";

export function toDisplayProject(
  project: typeof projects.$inferSelect,
  videos: Array<typeof projectVideos.$inferSelect>,
): DisplayProject {
  const sortedVideos = [...videos].sort((a, b) => a.sortOrder - b.sortOrder);
  const primary = sortedVideos[0];

  return {
    id: project.id,
    client: project.client,
    category: project.category,
    year: project.year,
    thumb: primary ? yt(primary.youtubeId) : "",
    href: primary ? ytUrl(primary.youtubeId) : "#",
    videos: sortedVideos.map((video) => ({
      id: video.youtubeId,
      label: video.label,
    })),
  };
}

export async function listPublishedProjects(): Promise<DisplayProject[]> {
  const db = getDb();
  const rows = await db.query.projects.findMany({
    where: eq(projects.published, true),
    with: {
      videos: {
        orderBy: asc(projectVideos.sortOrder),
      },
    },
    orderBy: asc(projects.sortOrder),
  });

  return rows.map((row) => toDisplayProject(row, row.videos));
}

export async function listAllProjects(): Promise<DisplayProject[]> {
  const db = getDb();
  const rows = await db.query.projects.findMany({
    with: {
      videos: {
        orderBy: asc(projectVideos.sortOrder),
      },
    },
    orderBy: asc(projects.sortOrder),
  });

  return rows.map((row) => toDisplayProject(row, row.videos));
}

export async function getProjectById(id: number) {
  const db = getDb();
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      videos: {
        orderBy: asc(projectVideos.sortOrder),
      },
    },
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
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
    })
    .returning();

  if (input.videos.length > 0) {
    await db.insert(projectVideos).values(
      input.videos.map((video, index) => ({
        projectId: project.id,
        youtubeId: video.youtubeId,
        label: video.label,
        sortOrder: video.sortOrder ?? index,
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
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  await db.delete(projectVideos).where(eq(projectVideos.projectId, id));

  if (input.videos.length > 0) {
    await db.insert(projectVideos).values(
      input.videos.map((video, index) => ({
        projectId: id,
        youtubeId: video.youtubeId,
        label: video.label,
        sortOrder: video.sortOrder ?? index,
      })),
    );
  }

  return getProjectById(id);
}

export async function listAllProjectsForAdmin() {
  const db = getDb();
  return db.query.projects.findMany({
    with: {
      videos: {
        orderBy: asc(projectVideos.sortOrder),
      },
    },
    orderBy: asc(projects.sortOrder),
  });
}

export async function deleteProject(id: number) {
  const db = getDb();
  await db.delete(projects).where(eq(projects.id, id));
}
