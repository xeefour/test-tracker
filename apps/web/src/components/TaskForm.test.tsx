import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('should render form with title and description inputs', () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), 'New Task');
    await userEvent.type(screen.getByLabelText(/description/i), 'Task Description');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description',
    });
  });

  it('should clear form after submission', async () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/title/i), 'New Task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    const input = screen.getByLabelText(/title/i) as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
