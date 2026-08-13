#!/bin/sh
# Container entrypoint: run Prisma migrations against DATABASE_URL, then exec the server.
# SQLite has no separate service to wait on, so migrations are applied directly.

set -e

echo "[entrypoint] running prisma migrate deploy..."
npx prisma migrate deploy

echo "[entrypoint] starting server..."
exec "$@"
