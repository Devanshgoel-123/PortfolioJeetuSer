import Link from "next/link";
import type { AdminProject } from "@/app/admin/actions";
import { logoutAction } from "@/app/admin/actions";
import { DeleteProjectButton } from "@/components/admin/ProjectEditor";

export default function AdminDashboard({ projects }: { projects: AdminProject[] }) {
  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Project Admin</h1>
          <p className="admin-note">Manage the projects shown in the Selected Work section.</p>
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

      {projects.length === 0 ? (
        <div className="admin-card">
          <p className="admin-note">No projects yet. Create your first one to populate the website.</p>
        </div>
      ) : (
        <div className="admin-list">
          {projects.map((project) => (
            <div key={project.id} className="admin-list-item">
              <div>
                <strong>{project.client}</strong>
                <div className="admin-list-meta">
                  {project.category} · {project.year} · {project.videos.length} videos
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
      )}
    </>
  );
}
