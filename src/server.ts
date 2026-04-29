import express from 'express';
import cors from 'cors';
import { taskRouter } from './task.routes';
import { PrismaClient } from './generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
