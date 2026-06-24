import Link from "next/link";
import { redirect } from "next/navigation";
import "@/styles/admin.css";
import { isAdminAuthenticated } from "@/lib/auth";
import ProjectEditor from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">New Project</h1>
            <p className="admin-note">Add a client project with one or more YouTube videos.</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">
            Back
          </Link>
        </header>
        <ProjectEditor />
      </div>
    </div>
  );
}
