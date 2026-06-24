import "@/styles/admin.css";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminProjects, type AdminProject } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <div className="admin-root">
        <div className="admin-shell">
          <AdminLogin />
        </div>
      </div>
    );
  }

  let projects: AdminProject[] = [];
  let dbError: string | null = null;

  try {
    projects = await getAdminProjects();
  } catch (error) {
    console.error(error);
    dbError =
      error instanceof Error
        ? error.message
        : "Could not connect to the database. Check DATABASE_URL and run migrations.";
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        {dbError ? (
          <div className="admin-card">
            <h1 className="admin-title">Database setup required</h1>
            <p className="admin-note">{dbError}</p>
            <p className="admin-note" style={{ marginTop: "1rem" }}>
              1. Create a Neon database and add <code>DATABASE_URL</code> to <code>.env</code>
              <br />
              2. Run <code>npm run db:push</code>
              <br />
              3. Run <code>npm run db:seed</code>
            </p>
          </div>
        ) : (
          <AdminDashboard projects={projects} />
        )}
      </div>
    </div>
  );
}
