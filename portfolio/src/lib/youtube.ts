export const yt = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export const ytUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] || null;
    }

    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}
