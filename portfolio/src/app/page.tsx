import HomePage from "@/components/HomePage";
import { getProjectsForSite } from "@/lib/get-projects-for-site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjectsForSite();
  return <HomePage projects={projects} />;
}
