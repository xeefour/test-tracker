import { Task, CreateTaskInput, UpdateTaskInput } from './task.types';
import { createTask, getTask, listTasks, updateTask, deleteTask } from './task';

describe('Task Operations', () => {
  describe('createTask', () => {
    it('should create a task with generated id and timestamps', () => {
      const input: CreateTaskInput = { title: 'Test Task', description: 'Test Description' };
      const task = createTask(input);

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe('pending');
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should create task with empty description when not provided', () => {
      const input: CreateTaskInput = { title: 'Simple Task' };
      const task = createTask(input);

      expect(task.description).toBe('');
    });
  });

  describe('getTask', () => {
    it('should return task when id exists', () => {
      const input: CreateTaskInput = { title: 'Find Me' };
      const created = createTask(input);
      const found = getTask(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined when id does not exist', () => {
      const result = getTask('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('listTasks', () => {
    it('should return all tasks', () => {
      const task1 = createTask({ title: 'Task 1' });
      const task2 = createTask({ title: 'Task 2' });
      const tasks = listTasks();

      expect(tasks).toContainEqual(task1);
      expect(tasks).toContainEqual(task2);
      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateTask', () => {
    it('should update task title', () => {
      const created = createTask({ title: 'Old Title' });
      const update: UpdateTaskInput = { id: created.id, title: 'New Title' };
      const updated = updateTask(update);

      expect(updated?.title).toBe('New Title');
      expect(updated?.updatedAt).toBeInstanceOf(Date);
    });

    it('should update task status', () => {
      const created = createTask({ title: 'Move Me' });
      const update: UpdateTaskInput = { id: created.id, status: 'in-progress' };
      const updated = updateTask(update);

      expect(updated?.status).toBe('in-progress');
    });

    it('should return undefined when id does not exist', () => {
      const update: UpdateTaskInput = { id: 'non-existent', title: 'New' };
      const result = updateTask(update);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteTask', () => {
    it('should delete task by id', () => {
      const created = createTask({ title: 'Delete Me' });
      const deleted = deleteTask(created.id);

      expect(deleted).toBe(true);
      expect(getTask(created.id)).toBeUndefined();
    });

    it('should return false when id does not exist', () => {
      const result = deleteTask('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
