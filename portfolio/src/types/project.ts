export type DisplayVideo = {
  id: string;
  label: string;
};

export type DisplayProject = {
  id: number;
  client: string;
  category: string;
  year: string;
  thumb: string;
  href: string;
  videos: DisplayVideo[];
};

export type ProjectInput = {
  client: string;
  category: string;
  year: string;
  sortOrder?: number;
  published?: boolean;
  videos: Array<{ youtubeId: string; label: string; sortOrder?: number }>;
};
