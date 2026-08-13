# Multi-stage build for the @tracker/web workspace.
# Build context MUST be the monorepo root (.) so we can read the workspace files.
#
# Stages:
#   (default)   — production build (Vite build, nginx serve)
#   dev         — Vite dev server with source volume mounts for HMR
#
# Usage:
#   docker compose -f docker-compose.yml up --build           # prod (not in this repo)
#   docker compose -f docker-compose.dev.yml up --build       # dev (web only)

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY tsconfig.base.json ./
RUN npm ci

# ---------- dev ----------
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
# npm workspaces hoist all deps to /app/node_modules — no per-workspace node_modules.
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 5173
# The apps/web source is volume-mounted read-write at runtime so Vite can write
# its optimizer cache. The node_modules inside the image are preserved because
# Vite only writes to node_modules/.vite/ inside the mounted path.
CMD ["npm", "run", "dev", "--", "--host"]

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm run build

# ---------- runner ----------
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]