import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

function resolveDatabaseUrl(override?: string): string {
  const url = override ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required (file:./dev.db style SQLite URL).');
  }
  return url;
}

/**
 * Build a PrismaClient wired to the libsql (SQLite) adapter.
 * Pass an explicit url (used by tests); otherwise reads DATABASE_URL.
 */
export function createPrismaClient(url?: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaLibSql({ url: resolveDatabaseUrl(url) }) });
}

let defaultClient: PrismaClient | null = null;

/**
 * Process-wide default client. Created lazily on first call.
 * Used by the server at boot and during graceful shutdown.
 */
export function getPrisma(): PrismaClient {
  if (!defaultClient) defaultClient = createPrismaClient();
  return defaultClient;
}
