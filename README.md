# Tracker

Task tracker monorepo: Express + Prisma + SQLite (libsql) backend, React + Vite frontend.

## Structure

```
.
├── apps/
│   ├── server/   # Express API + Prisma (Node)
│   └── web/      # React + Vite UI
├── docker-compose.yml
├── package.json  # npm workspaces root
└── tsconfig.base.json
```

## Quick start (Docker)

```bash
docker compose up --build
# API at http://localhost:3000
```

Then in another terminal:

```bash
npm run dev:web
# UI at http://localhost:5173 (proxies /tasks -> :3000)
```

## Local dev (no Docker)

```bash
# 1. install everything
npm install

# 2. copy env template into the server workspace
cp apps/server/.env.example apps/server/.env

# 3. run both apps in parallel
npm run dev
```

`npm run dev` automatically runs `prisma migrate deploy` before booting the server, so the SQLite file is always in sync with the migrations. The server uses a local SQLite file (`apps/server/dev.db` by default). No external database required.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run server (`tsx watch`) + web (`vite`) in parallel |
| `npm run dev:server` | Server only |
| `npm run dev:web` | Web only |
| `npm run build` | Build all workspaces |
| `npm test` | Run all workspace tests |
| `npm run db:generate` | `prisma generate` (server) |
| `npm run db:migrate` | `prisma migrate dev` (server) |
| `npm run db:deploy` | `prisma migrate deploy` (server) |
| `npm run db:studio` | `prisma studio` (server) |

## Environment

`DATABASE_URL` is the only required env var. Format for SQLite:

```
file:./dev.db
```

Server reads it from `.env` (via `dotenv`) or the environment. Docker Compose passes it to the `server` service directly.

## Database

- Schema: `apps/server/prisma/schema.prisma`
- Migrations: `apps/server/prisma/migrations/`
- The server Dockerfile runs `prisma migrate deploy` on container start.
- The dev DB file lives at `apps/server/dev.db` by default; production Compose mounts a named volume at `/data`.
