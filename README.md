# Make It Here

Portfolio site for **Make It Here**, a video content studio by Varsha. The public site shows brand films, campaigns, and stories across beauty, finance, healthcare, and food. An admin dashboard lets you manage the work without editing code.

The Next.js app lives in [`portfolio/`](portfolio/).

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19
- TypeScript
- [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.tech) PostgreSQL
- Custom CSS (public site + admin)

If `DATABASE_URL` is missing or the database is empty, the homepage falls back to a static project list so the site still renders.

## Features

- Single-page portfolio: hero, work, about, services, contact
- YouTube-backed project galleries (thumbnails + watch links)
- Password-protected admin at `/admin` to create, edit, publish, and reorder projects
- Seed script for the initial client/work list

## Getting started

```bash
cd portfolio
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard |

Then push the schema, seed projects, and start the app:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at [http://localhost:3000/admin](http://localhost:3000/admin).

You can skip the database for a first look — the homepage will use fallback projects. Admin and live project updates need Neon plus `db:push`.

## Scripts

Run these from `portfolio/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push the Drizzle schema to Neon |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Insert seed projects (no-op if projects already exist) |

## Project layout

```
portfolio/
  src/app/              Public homepage and /admin routes
  src/app/api/          Project CRUD API
  src/components/       Home page and admin UI
  src/data/             Site copy, nav, and seed projects
  src/db/               Drizzle schema and Neon client
  src/lib/              Auth, YouTube helpers, project queries
  scripts/seed.ts       One-time database seed
```

Site copy (nav, services, contact, hero slides) lives in `portfolio/src/data/site.ts`. Work items are stored in Postgres (`projects` and `project_videos`).

## Deploy

The app is set up for [Vercel](https://vercel.com). Add `DATABASE_URL` and `ADMIN_PASSWORD` in the project environment variables, then deploy the `portfolio` directory as the root.
