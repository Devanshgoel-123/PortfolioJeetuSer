import { filmsToPrintPlaceholders } from "@/data/placeholder-prints";
import { listPublishedProjects } from "@/lib/projects";
import { FALLBACK_PROJECTS } from "@/lib/fallback-projects";
import type { DisplayProject } from "@/types/project";

function withPrintPlaceholders(projects: DisplayProject[]): DisplayProject[] {
  if (projects.some((project) => project.kind === "print")) {
    return projects;
  }

  const films = projects.filter((project) => project.kind !== "print");
  return [...projects, ...filmsToPrintPlaceholders(films)];
}

export async function getProjectsForSite(): Promise<DisplayProject[]> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_PROJECTS;
  }

  try {
    const projects = await listPublishedProjects();
    if (projects.length === 0) {
      return FALLBACK_PROJECTS;
    }
    return withPrintPlaceholders(projects);
  } catch (error) {
    console.error("Failed to load projects from database:", error);
    return FALLBACK_PROJECTS;
  }
}
