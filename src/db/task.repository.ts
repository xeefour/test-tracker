import { PrismaClient } from '../generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { Task, CreateTaskInput, UpdateTaskInput } from '../task.types';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description || '',
    },
  });
  return mapToTask(task);
}

export async function getTask(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({ where: { id } });
  return task ? mapToTask(task) : null;
}

export async function listTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return tasks.map(mapToTask);
}

export async function updateTask(input: UpdateTaskInput): Promise<Task | null> {
  const task = await prisma.task.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
    },
  });
  return mapToTask(task);
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

function mapToTask(task: { id: string; title: string; description: string; status: string; createdAt: Date; updatedAt: Date }): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as Task['status'],
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
