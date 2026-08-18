import { yt } from "@/lib/youtube";
import type { DisplayProject } from "@/types/project";

const POSTER_LABELS: Record<string, string> = {
  "Campaign Film": "Campaign Key Visual",
  "Brand Story": "Brand Identity Poster",
  "Product Reveal": "Product Launch Poster",
  "Social Series": "Social Campaign Sheet",
  "Brand Film": "Brand Campaign Poster",
  Campaign: "Campaign Visual",
  "Product Spot": "Product Sheet",
  "Digital Series": "Series Key Art",
  "Launch Film": "Launch Poster",
  Explainer: "Product Explainer Sheet",
  "Campaign Spot": "Campaign Visual",
  Documentary: "Documentary Poster",
  Series: "Series Key Art",
  "Awareness Film": "Awareness Poster",
  "Patient Stories": "Patient Story Sheet",
  "Brand Spot": "Brand Poster",
  "Social Content": "Social Key Art",
  "Recipe Series": "Recipe Sheet",
  "Impact Film": "Impact Poster",
  Awareness: "Awareness Sheet",
  "Community Story": "Community Key Art",
  "Short Film": "Short Film Poster",
};

function posterLabel(label: string): string {
  return POSTER_LABELS[label] ?? `${label} Poster`;
}

export function filmsToPrintPlaceholders(films: DisplayProject[]): DisplayProject[] {
  return films.map((film) => ({
    ...film,
    kind: "print" as const,
    videos: [],
    images: film.videos.map((video) => ({
      url: video.thumb || yt(video.id),
      label: posterLabel(video.label),
    })),
  }));
}
