import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  client: text("client").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectVideos = pgTable("project_videos", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  youtubeId: text("youtube_id").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  videos: many(projectVideos),
}));

export const projectVideosRelations = relations(projectVideos, ({ one }) => ({
  project: one(projects, {
    fields: [projectVideos.projectId],
    references: [projects.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectVideo = typeof projectVideos.$inferSelect;
export type NewProjectVideo = typeof projectVideos.$inferInsert;
