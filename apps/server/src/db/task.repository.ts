import { getPrisma } from './client';
import type { PrismaClient } from '../generated/prisma/client';
import { Task, CreateTaskInput, UpdateTaskInput } from '../task.types';

// The repository normally goes through the default singleton (getPrisma()).
// Tests inject a per-suite client via setPrismaForTesting for isolation,
// and reset it via resetPrismaForTesting in afterEach/afterAll.
let overrideClient: PrismaClient | null = null;

function db(): PrismaClient {
  return overrideClient ?? getPrisma();
}

export function setPrismaForTesting(client: PrismaClient): void {
  overrideClient = client;
}

export function resetPrismaForTesting(): void {
  overrideClient = null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const task = await db().task.create({
    data: {
      title: input.title,
      description: input.description || '',
    },
  });
  return mapToTask(task);
}

export async function getTask(id: string): Promise<Task | null> {
  const task = await db().task.findUnique({ where: { id } });
  return task ? mapToTask(task) : null;
}

export async function listTasks(): Promise<Task[]> {
  const tasks = await db().task.findMany({ orderBy: { createdAt: 'desc' } });
  return tasks.map(mapToTask);
}

export async function updateTask(input: UpdateTaskInput): Promise<Task | null> {
  try {
    const task = await db().task.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });
    return mapToTask(task);
  } catch {
    return null;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await db().task.delete({ where: { id } });
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
