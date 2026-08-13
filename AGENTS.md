# AGENTS.md

Task Tracker — a small TDD-style fullstack todo app: Vite + React 19 frontend, Express 5 + Prisma 7 (libsql / SQLite) backend, Jest for tests. Strict TypeScript throughout.

## Setup commands

- Install deps: `npm ci` (or `npm install` for a fresh clone; `package-lock.json` is the source of truth)
- Generate Prisma client (required after install — output is gitignored): `npx prisma generate`
- Initialize the local DB: `npx prisma db push --accept-data-loss --schema=prisma/schema.prisma` (uses `DATABASE_URL` or falls back to `file:./dev.db`)
- Start backend:    `npm run server`     # Express on http://localhost:3000
- Start frontend:   `npm run dev`        # Vite dev server, proxies `/tasks` → :3000
- Build:            `npm run build`      # Vite production build into `dist/`
- Test:             `npm test`           # Jest + ts-jest, jsdom env
- Typecheck (manual, no script): `npx tsc --noEmit`

## Project layout

- `src/ui/`            — React components, pages, styles (`main.tsx`, `App.tsx`, `TaskForm.tsx`, `TaskList.tsx`, `styles.css`)
- `src/db/`            — Prisma-backed data-access layer (`task.repository.ts`)
- `src/`               — Express server, routes, types, top-level modules (`server.ts`, `task.routes.ts`, `task.ts`, `task.types.ts`)
- `src/generated/prisma/` — Prisma client output (gitignored; regenerate via `npx prisma generate`)
- `prisma/`            — Prisma schema (`schema.prisma`) and migrations (`migrations/`)
- `.github/workflows/` — CI: `npm ci` → `prisma generate` → `prisma db push` → `npm test` → `npm run build` on `developer` and `master`
- `index.html`, `vite.config.ts`, `jest.config.js`, `tsconfig.json`, `Dockerfile` — tool config & container build

## Code style

- TypeScript strict mode (`tsconfig.json: strict: true`), target `ES2020`, `module: commonjs`, `jsx: react-jsx`
- No ESLint / Prettier config is checked in — match the existing style: 2-space indent, single quotes, trailing commas, semicolons
- Co-locate unit tests next to source as `*.test.ts` / `*.test.tsx`; Jest auto-discovers them (`jest.config.js`)
- Backend modules import the generated Prisma client from `./generated/prisma` — do not hand-edit that directory

## Testing instructions

- Unit / integration tests: `npm test` (Jest + ts-jest, jsdom)
- DB-backed tests expect `DATABASE_URL=file:./test.db` and a pushed schema. CI runs:
  1. `npx prisma generate`
  2. `npx prisma db push --accept-data-loss --schema=prisma/schema.prisma`
  3. `npm test`
- Run a single file: `npx jest src/task.routes.test.ts`
- Add a test for every new behavior — keep them next to the code they cover
- All tests must be green before opening a PR

## PR & commit conventions

- Default branch is `master`; CI auto-merges `developer` → `master` on push (see `.github/workflows/ci.yml`)
- Branch from `developer` for normal work; branch from `master` only for hotfixes
- Keep commits small and focused; short imperative subject line
- Push the branch and open a PR into `developer` (or `master` for hotfixes); CI must pass before merge

## Security

- Never commit secrets — `.env`, `.env.local`, and `.env.*.local` are gitignored
- `DATABASE_URL` controls the database file location; keep test / dev URLs pointing at local SQLite files (`file:./dev.db`, `file:./test.db`)
- `prisma/dev.db` and any `*.db*` files are gitignored — do not commit real data
- Container build uses `node:20-alpine`; production image runs as the default `node` user — add a non-root user if hardening further
