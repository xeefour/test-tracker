import express from 'express';
import cors from 'cors';
import { taskRouter } from './task.routes';
import { createPrismaClient } from './db/client';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Eagerly verify DATABASE_URL — fail fast at boot rather than at the first request.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required (file:./dev.db style SQLite URL).');
}

// CORS: explicit allowlist driven by env. Default to the local dev origins
// so the Vite dev server (5173) and the prod web origin can both reach the API
// without an explicit env override.
//
//   CORS_ORIGINS="http://localhost:5173,http://localhost:3000"   (dev)
//   CORS_ORIGINS="https://tracker.example.com"                    (prod)
//   CORS_ORIGINS="*"                                              (any origin, no credentials)
const rawOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);
const allowAnyOrigin = allowedOrigins.includes('*');

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin / curl / server-to-server: no Origin header → allow.
      if (!origin) return callback(null, true);
      if (allowAnyOrigin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[cors] rejected origin: ${origin}`);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length'],
    credentials: false,
    maxAge: 86400, // cache preflight for 24h
  }),
);

app.use(express.json());
app.use('/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`[cors] allowed origins: ${allowAnyOrigin ? '* (any)' : allowedOrigins.join(', ')}`);
});
