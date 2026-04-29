import { Task, CreateTaskInput, UpdateTaskInput } from './task.types';

const tasks: Map<string, Task> = new Map();

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date();
  const task: Task = {
    id: generateId(),
    title: input.title,
    description: input.description || '',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function getTask(id: string): Task | undefined {
  return tasks.get(id);
}

export function listTasks(): Task[] {
  return Array.from(tasks.values());
}

export function updateTask(input: UpdateTaskInput): Task | undefined {
  const task = tasks.get(input.id);
  if (!task) return undefined;

  const updated: Task = {
    ...task,
    title: input.title ?? task.title,
    description: input.description ?? task.description,
    status: input.status ?? task.status,
    updatedAt: new Date(),
  };
  tasks.set(input.id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}
