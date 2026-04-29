import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

describe('App', () => {
  it('should render header and task form', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/task tracker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('should load and display tasks on mount', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  it('should create new task when form is submitted', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', title: 'New Task', status: 'pending' }),
      });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => screen.getByLabelText(/title/i));

    await userEvent.type(screen.getByLabelText(/title/i), 'New Task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('should delete task when delete button clicked', async () => {
    const mockTasks = [
      { id: '1', title: 'Task to Delete', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTasks) })
      .mockResolvedValueOnce({ ok: true, status: 204 });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => screen.getByText('Task to Delete'));

    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
  });
});
