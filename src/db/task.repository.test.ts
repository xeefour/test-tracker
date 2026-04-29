import { PrismaClient } from '../generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { CreateTaskInput, UpdateTaskInput } from '../task.types';

const url = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaLibSql({ url });
let prisma: PrismaClient;

beforeEach(() => {
  prisma = new PrismaClient({ adapter });
});

afterEach(async () => {
  await prisma.task.deleteMany();
  await prisma.$disconnect();
});

describe('Task Repository', () => {
  describe('createTask', () => {
    it('should create a task in database', async () => {
      const { createTask } = await import('../db/task.repository');
      const input: CreateTaskInput = { title: 'DB Task', description: 'From database' };

      const task = await createTask(input);

      expect(task.id).toBeDefined();
      expect(task.title).toBe('DB Task');
      expect(task.status).toBe('pending');

      const found = await prisma.task.findUnique({ where: { id: task.id } });
      expect(found).not.toBeNull();
    });
  });

  describe('getTask', () => {
    it('should return task by id', async () => {
      const { createTask, getTask } = await import('../db/task.repository');
      const created = await createTask({ title: 'Find Me' });

      const task = await getTask(created.id);

      expect(task?.title).toBe('Find Me');
    });

    it('should return null when not found', async () => {
      const { getTask } = await import('../db/task.repository');
      const task = await getTask('non-existent');
      expect(task).toBeNull();
    });
  });

  describe('listTasks', () => {
    it('should return all tasks', async () => {
      const { createTask, listTasks } = await import('../db/task.repository');
      await createTask({ title: 'Task 1' });
      await createTask({ title: 'Task 2' });

      const tasks = await listTasks();

      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateTask', () => {
    it('should update task title', async () => {
      const { createTask, updateTask } = await import('../db/task.repository');
      const created = await createTask({ title: 'Old Title' });

      const updated = await updateTask({ id: created.id, title: 'New Title' });

      expect(updated?.title).toBe('New Title');
    });

    it('should update task status', async () => {
      const { createTask, updateTask } = await import('../db/task.repository');
      const created = await createTask({ title: 'Move Me' });

      const updated = await updateTask({ id: created.id, status: 'completed' });

      expect(updated?.status).toBe('completed');
    });
  });

  describe('deleteTask', () => {
    it('should delete task by id', async () => {
      const { createTask, deleteTask, getTask } = await import('../db/task.repository');
      const created = await createTask({ title: 'Delete Me' });

      const result = await deleteTask(created.id);

      expect(result).toBe(true);
      const found = await getTask(created.id);
      expect(found).toBeNull();
    });
  });
});
