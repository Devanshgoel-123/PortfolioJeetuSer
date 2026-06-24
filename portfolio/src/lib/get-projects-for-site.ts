import { listPublishedProjects } from "@/lib/projects";
import { FALLBACK_PROJECTS } from "@/lib/fallback-projects";
import type { DisplayProject } from "@/types/project";

export async function getProjectsForSite(): Promise<DisplayProject[]> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_PROJECTS;
  }

  try {
    const projects = await listPublishedProjects();
    return projects.length > 0 ? projects : FALLBACK_PROJECTS;
  } catch (error) {
    console.error("Failed to load projects from database:", error);
    return FALLBACK_PROJECTS;
  }
}
