import Link from "next/link";
import type { AdminProject } from "@/app/admin/actions";
import { logoutAction } from "@/app/admin/actions";
import { DeleteProjectButton } from "@/components/admin/ProjectEditor";

function ProjectList({ projects, emptyLabel }: { projects: AdminProject[]; emptyLabel: string }) {
  if (projects.length === 0) {
    return (
      <div className="admin-card">
        <p className="admin-note">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="admin-list">
      {projects.map((project) => (
        <div key={project.id} className="admin-list-item">
          <div>
            <strong>{project.client}</strong>
            <div className="admin-list-meta">
              {project.category} · {project.year} ·{" "}
              {project.kind === "print"
                ? `${project.images.length} images`
                : `${project.videos.length} videos`}
              {!project.published && " · Hidden"}
            </div>
          </div>
          <div className="admin-actions">
            <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn admin-btn-secondary">
              Edit
            </Link>
            <DeleteProjectButton projectId={project.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ projects }: { projects: AdminProject[] }) {
  const filmProjects = projects.filter((project) => project.kind !== "print");
  const printProjects = projects.filter((project) => project.kind === "print");

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Project Admin</h1>
          <p className="admin-note">Manage Film and Print projects shown under Work.</p>
        </div>
        <div className="admin-actions">
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
            New project
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="admin-btn admin-btn-secondary">
              Log out
            </button>
          </form>
        </div>
      </header>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Film</h2>
          <span className="admin-section-count">{filmProjects.length}</span>
        </div>
        <ProjectList projects={filmProjects} emptyLabel="No Film projects yet." />
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Print</h2>
          <span className="admin-section-count">{printProjects.length}</span>
        </div>
        <ProjectList projects={printProjects} emptyLabel="No Print projects yet." />
      </section>
    </>
  );
}
