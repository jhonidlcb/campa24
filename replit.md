# Alianza Por El Cambio - Campaign Website

## Overview
A full-stack political campaign web application built with React (frontend) and Express (backend), using a unified server that serves both via Vite middleware in development.

## Architecture

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui components, Wouter for routing
- **Backend**: Express 5, TypeScript via tsx, served on port 5000
- **Database**: PostgreSQL via Neon (serverless), Drizzle ORM
- **Auth**: Passport.js with local strategy, session-based
- **File uploads**: Multer, stored in `/uploads/` directory

## Project Structure

```
client/         - React frontend source
  src/
    pages/      - Page components (Home, Proposals, News, Admin, etc.)
    components/ - Reusable UI components
    hooks/      - Custom React hooks
    lib/        - Utilities
server/         - Express backend
  index.ts      - Entry point, HTTP server setup
  routes.ts     - API route registration + DB seeding
  auth.ts       - Passport authentication setup
  db.ts         - Drizzle DB connection (Neon PostgreSQL)
  storage.ts    - Data access layer
  vite.ts       - Vite dev server middleware setup
shared/
  schema.ts     - Drizzle schema + Zod types (shared between client/server)
  routes.ts     - Shared API route definitions
uploads/        - User-uploaded images (served at /uploads/)
```

## Key Features

- Public pages: Home, Proposals, News, Activities, Events, Join (Sumate)
- Admin panel (authenticated): Manage content, supporters, uploads
- Image upload support for activities, news, home content, candidate photo
- Supporter registration with neighborhood and phone
- Database-driven content (all editable via admin)

## Development

```bash
npm run dev       # Start dev server (port 5000)
npm run build     # Build for production
npm run start     # Run production build
npm run db:push   # Push schema changes to database
```

## Database

Uses Neon PostgreSQL. Connection string is hardcoded in `server/db.ts` and `drizzle.config.ts` with fallback to `DATABASE_URL` environment variable.

Tables: `users`, `supporters`, `activities`, `home_content`, `news`, `proposals`, `events`

## Deployment

Configured for autoscale deployment:
- Build: `npm run build`
- Run: `node dist/index.cjs`

## Notes

- Server runs on `0.0.0.0:5000` to support Replit proxy
- Vite is run in middleware mode (no separate port for HMR)
- `allowedHosts: true` is set in Vite config to bypass host header checks in Replit
