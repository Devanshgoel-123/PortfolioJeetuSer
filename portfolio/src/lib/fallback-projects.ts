import { filmsToPrintPlaceholders } from "@/data/placeholder-prints";
import { SEED_PROJECTS } from "@/data/seed-projects";
import { yt, ytUrl } from "@/lib/youtube";
import type { DisplayProject } from "@/types/project";

const FALLBACK_FILMS: DisplayProject[] = SEED_PROJECTS.map((project, index) => {
  const primary = project.videos[0];

  return {
    id: index + 1,
    client: project.client,
    category: project.category,
    year: project.year,
    kind: project.kind,
    thumb: primary ? yt(primary.youtubeId) : "",
    href: primary ? ytUrl(primary.youtubeId) : "#",
    videos: project.videos.map((video) => ({
      id: video.youtubeId,
      label: video.label,
      thumb: video.thumbnail || yt(video.youtubeId),
    })),
    images: [],
  } satisfies DisplayProject;
});

export const FALLBACK_PROJECTS: DisplayProject[] = [
  ...FALLBACK_FILMS,
  ...filmsToPrintPlaceholders(FALLBACK_FILMS),
];
