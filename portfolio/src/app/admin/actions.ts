"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, getAdminPassword, isAdminAuthenticated, isValidAdminPassword } from "@/lib/auth";
import { isMediaUrl, saveMediaFile } from "@/lib/media";
import {
  createProject,
  deleteProject,
  listAllProjectsForAdmin,
  updateProject,
} from "@/lib/projects";
import { extractYoutubeId } from "@/lib/youtube";
import type { ProjectInput, WorkKind } from "@/types/project";
import { isWorkKind } from "@/types/project";

export type AdminProject = {
  id: number;
  client: string;
  category: string;
  year: string;
  kind: WorkKind;
  sortOrder: number;
  published: boolean;
  videos: Array<{ youtubeId: string; label: string; thumbnail: string; sortOrder: number }>;
  images: Array<{ url: string; label: string; sortOrder: number }>;
};

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

async function parseVideos(formData: FormData) {
  const labels = formData.getAll("videoLabel").map((value) => String(value).trim());
  const ids = formData.getAll("videoYoutubeId").map((value) => String(value).trim());
  const thumbs = formData.getAll("videoThumbnail").map((value) => String(value).trim());

  const videos: ProjectInput["videos"] = [];

  for (let index = 0; index < labels.length; index += 1) {
    const label = labels[index];
    const youtubeId = extractYoutubeId(ids[index] ?? "");
    if (!label || !youtubeId) continue;

    const file = formData.get(`videoThumbnailFile-${index}`);
    let thumbnail: string | undefined;

    if (file instanceof File && file.size > 0) {
      thumbnail = await saveMediaFile(file);
    } else if (isMediaUrl(thumbs[index] ?? "")) {
      thumbnail = thumbs[index];
    }

    videos.push({
      label,
      youtubeId,
      thumbnail,
      sortOrder: index,
    });
  }

  return videos;
}

function parseImages(formData: FormData) {
  const urls = formData.getAll("imageUrl").map((value) => String(value).trim());
  const labels = formData.getAll("imageLabel").map((value) => String(value).trim());

  return urls
    .map((url, index) => {
      if (!isMediaUrl(url)) return null;
      return {
        url,
        label: labels[index] || `Image ${index + 1}`,
        sortOrder: index,
      };
    })
    .filter((image): image is NonNullable<typeof image> => image !== null);
}

async function parseProjectForm(formData: FormData): Promise<ProjectInput | null> {
  const client = String(formData.get("client") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const kindValue = String(formData.get("kind") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const published = formData.get("published") === "on";

  if (!client || !category || !year || !isWorkKind(kindValue)) return null;

  const kind: WorkKind = kindValue;
  const videos = kind === "film" ? await parseVideos(formData) : [];
  const images = kind === "print" ? parseImages(formData) : [];

  return {
    client,
    category,
    year,
    kind,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    published,
    videos,
    images,
  };
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!getAdminPassword()) {
    return { error: "ADMIN_PASSWORD is not configured in environment variables." };
  }

  if (!isValidAdminPassword(password)) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  await requireAdmin();

  const rows = await listAllProjectsForAdmin();
  return rows.map((project) => ({
    id: project.id,
    client: project.client,
    category: project.category,
    year: project.year,
    kind: isWorkKind(project.kind) ? project.kind : "film",
    sortOrder: project.sortOrder,
    published: project.published,
    videos: project.videos.map((video) => ({
      youtubeId: video.youtubeId,
      label: video.label,
      thumbnail: video.thumbnail ?? "",
      sortOrder: video.sortOrder,
    })),
    images: project.images.map((image) => ({
      url: image.url,
      label: image.label,
      sortOrder: image.sortOrder,
    })),
  }));
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();

  let input: ProjectInput | null;
  try {
    input = await parseProjectForm(formData);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save the thumbnail image.",
    };
  }

  if (!input) {
    return { error: "Please fill in client, category, year, and choose Film or Print." };
  }

  if (input.kind === "film" && input.videos.length === 0) {
    return { error: "Add at least one video with a valid YouTube URL or ID and a label." };
  }

  if (input.kind === "print" && input.images.length === 0) {
    return { error: "Add at least one image with a valid image URL." };
  }

  const projectId = Number(formData.get("projectId"));
  if (projectId) {
    await updateProject(projectId, input);
  } else {
    await createProject(input);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const projectId = Number(formData.get("projectId"));
  if (!projectId || Number.isNaN(projectId)) {
    return { error: "Invalid project id." };
  }

  await deleteProject(projectId);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
