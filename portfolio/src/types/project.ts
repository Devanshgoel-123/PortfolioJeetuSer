export const WORK_KINDS = ["film", "print"] as const;
export type WorkKind = (typeof WORK_KINDS)[number];

export function isWorkKind(value: string): value is WorkKind {
  return value === "film" || value === "print";
}

export type DisplayVideo = {
  id: string;
  label: string;
  thumb: string;
  featured?: boolean;
};

export type DisplayImage = {
  url: string;
  label: string;
};

export type DisplayProject = {
  id: number;
  client: string;
  category: string;
  year: string;
  kind: WorkKind;
  thumb: string;
  href: string;
  videos: DisplayVideo[];
  images: DisplayImage[];
};

export type ProjectInput = {
  client: string;
  category: string;
  year: string;
  kind: WorkKind;
  sortOrder?: number;
  published?: boolean;
  videos: Array<{
    youtubeId: string;
    label: string;
    thumbnail?: string;
    featured?: boolean;
    sortOrder?: number;
  }>;
  images: Array<{ url: string; label: string; sortOrder?: number }>;
};
