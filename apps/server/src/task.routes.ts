import { Router, Request, Response } from 'express';
import { createTask, getTask, listTasks, updateTask, deleteTask } from './db/task.repository';

export const taskRouter = Router();

taskRouter.get('/', async (_req: Request, res: Response) => {
  const tasks = await listTasks();
  res.json(tasks);
});

taskRouter.get('/:id', async (req: Request, res: Response) => {
  const task = await getTask(req.params.id as string);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

taskRouter.post('/', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const task = await createTask({ title, description });
  res.status(201).json(task);
});

taskRouter.put('/:id', async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const updated = await updateTask({ id: req.params.id as string, title, description, status });
  if (!updated) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(updated);
});

taskRouter.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await deleteTask(req.params.id as string);
  if (!deleted) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.status(204).send();
});
