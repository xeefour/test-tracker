import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';
import { Task } from '../types/task';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in-progress',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should render empty state when no tasks', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it('should render list of tasks', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should render task status badges', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should call onStatusChange when clicking status button', async () => {
    const onStatusChange = jest.fn();
    render(<TaskList tasks={mockTasks} onStatusChange={onStatusChange} />);

    const buttons = screen.getAllByRole('button');
    // mockTasks has 2 entries, so the first button must exist.
    await userEvent.click(buttons[0]!);

    expect(onStatusChange).toHaveBeenCalled();
  });

  it('should call onDelete when clicking delete button', async () => {
    const onDelete = jest.fn();
    render(<TaskList tasks={mockTasks} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    // mockTasks has 2 entries, so at least one delete button must exist.
    await userEvent.click(deleteButtons[0]!);

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
