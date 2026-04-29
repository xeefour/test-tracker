import request from 'supertest';
import express, { Express } from 'express';
import { taskRouter } from './task.routes';
import { createTask, deleteTask, listTasks } from './db/task.repository';
import { PrismaClient } from './generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';

let app: Express;
let prisma: PrismaClient;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/tasks', taskRouter);

  const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
  prisma = new PrismaClient({ adapter });
});

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /tasks', () => {
  it('should return empty array when no tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all tasks', async () => {
    await createTask({ title: 'Task 1' });
    await createTask({ title: 'Task 2' });

    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /tasks/:id', () => {
  it('should return 404 when task not found', async () => {
    const res = await request(app).get('/tasks/non-existent');
    expect(res.status).toBe(404);
  });

  it('should return task when exists', async () => {
    const task = await createTask({ title: 'Find Me' });

    const res = await request(app).get(`/tasks/${task.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find Me');
  });
});

describe('POST /tasks', () => {
  it('should create task and return 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'New Task', description: 'Desc' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.id).toBeDefined();
  });

  it('should return 400 when title missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ description: 'No title' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /tasks/:id', () => {
  it('should update task and return 200', async () => {
    const task = await createTask({ title: 'Old' });

    const res = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: 'Updated', status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.status).toBe('completed');
  });

  it('should return 404 when task not found', async () => {
    const res = await request(app)
      .put('/tasks/non-existent')
      .send({ title: 'Updated' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('should delete task and return 204', async () => {
    const task = await createTask({ title: 'Delete Me' });

    const res = await request(app).delete(`/tasks/${task.id}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 when task not found', async () => {
    const res = await request(app).delete('/tasks/non-existent');
    expect(res.status).toBe(404);
  });
});
