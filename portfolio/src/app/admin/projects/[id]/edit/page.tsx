import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import "@/styles/admin.css";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProjectById } from "@/lib/projects";
import ProjectEditor from "@/components/admin/ProjectEditor";
import type { AdminProject } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const { id } = await params;
  const projectId = Number(id);
  if (Number.isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);
  if (!project) {
    notFound();
  }

  const adminProject: AdminProject = {
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
  };

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Edit Project</h1>
            <p className="admin-note">{project.client}</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">
            Back
          </Link>
        </header>
        <ProjectEditor project={adminProject} />
      </div>
    </div>
  );
}
