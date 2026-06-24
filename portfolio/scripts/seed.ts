import "dotenv/config";
import { getDb } from "../src/db";
import { projects } from "../src/db/schema";
import { createProject } from "../src/lib/projects";
import { SEED_PROJECTS } from "../src/data/seed-projects";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to your .env file first.");
  }

  const db = getDb();
  const existing = await db.select().from(projects).limit(1);

  if (existing.length > 0) {
    console.log("Database already has projects. Skipping seed.");
    return;
  }

  for (const project of SEED_PROJECTS) {
    await createProject(project);
    console.log(`Seeded: ${project.client}`);
  }

  console.log(`Done. Seeded ${SEED_PROJECTS.length} projects.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
