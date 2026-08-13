# Multi-stage build for the @tracker/server workspace.
# Build context MUST be the monorepo root (.) so we can read the root
# package.json/lockfile plus apps/server source.
#
# Stages:
#   (default)   — production runner (built image, no source mount)
#   dev         — tsx watch, source mounted via docker-compose.dev.yml
#
# Usage:
#   docker compose -f docker-compose.yml up --build           # production
#   docker compose -f docker-compose.dev.yml up --build       # dev

# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY tsconfig.base.json ./
RUN npm ci

# ---------- dev ----------
# Source is volume-mounted at runtime; no build step needed.
# Use `target: dev` in docker-compose.dev.yml to activate this stage.
# npm workspaces hoist everything to /app/node_modules, so there's no
# per-workspace node_modules/ to copy separately.
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
RUN npm install -g tsx
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/tsconfig.base.json ./
COPY apps/server ./apps/server
WORKDIR /app/apps/server
# Generate the Prisma client inside the image so the volume-mounted source
# can import it at boot without needing another generate step.
# prisma.config.ts reads DATABASE_URL from env (set by docker-compose.dev.yml).
ARG DATABASE_URL=file:/data/dev.db
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
EXPOSE 3000
CMD ["tsx", "watch", "src/server.ts"]

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/server ./apps/server
WORKDIR /app/apps/server
RUN npx prisma generate
RUN npm run build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini

# Copy runtime artifacts only (no source, no build tools).
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/src/generated ./apps/server/src/generated
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/apps/server/docker-entrypoint.sh ./apps/server/docker-entrypoint.sh
COPY --from=deps /app/node_modules ./node_modules
RUN chmod +x /app/apps/server/docker-entrypoint.sh

WORKDIR /app/apps/server
ENTRYPOINT ["/sbin/tini", "--", "/app/apps/server/docker-entrypoint.sh"]
EXPOSE 3000
CMD ["npm", "start"]