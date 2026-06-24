"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, getAdminPassword, isAdminAuthenticated, isValidAdminPassword } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  listAllProjectsForAdmin,
  updateProject,
} from "@/lib/projects";
import { extractYoutubeId } from "@/lib/youtube";
import type { ProjectInput } from "@/types/project";

export type AdminProject = {
  id: number;
  client: string;
  category: string;
  year: string;
  sortOrder: number;
  published: boolean;
  videos: Array<{ youtubeId: string; label: string; sortOrder: number }>;
};

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function parseVideos(formData: FormData) {
  const labels = formData.getAll("videoLabel").map((value) => String(value).trim());
  const ids = formData.getAll("videoYoutubeId").map((value) => String(value).trim());

  return labels
    .map((label, index) => {
      const youtubeId = extractYoutubeId(ids[index] ?? "");
      if (!label || !youtubeId) return null;
      return { label, youtubeId, sortOrder: index };
    })
    .filter((video): video is NonNullable<typeof video> => video !== null);
}

function parseProjectForm(formData: FormData): ProjectInput | null {
  const client = String(formData.get("client") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const published = formData.get("published") === "on";

  if (!client || !category || !year) return null;

  return {
    client,
    category,
    year,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    published,
    videos: parseVideos(formData),
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
    sortOrder: project.sortOrder,
    published: project.published,
    videos: project.videos.map((video) => ({
      youtubeId: video.youtubeId,
      label: video.label,
      sortOrder: video.sortOrder,
    })),
  }));
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();

  const input = parseProjectForm(formData);
  if (!input) {
    return { error: "Please fill in client, category, year, and at least one valid video." };
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
