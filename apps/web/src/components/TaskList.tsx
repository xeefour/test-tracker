import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
}

const statusIcons = {
  pending: Circle,
  'in-progress': Clock,
  completed: CheckCircle,
};

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  const nextStatus = (current: TaskStatus): TaskStatus => {
    const order: TaskStatus[] = ['pending', 'in-progress', 'completed'];
    const idx = order.indexOf(current);
    // Math guarantees the index is in [0, order.length); noUncheckedIndexedAccess would otherwise mark this as undefined.
    return order[(idx + 1) % order.length]!;
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const StatusIcon = statusIcons[task.status];
        return (
          <div key={task.id} className="task-card">
            <button
              className="icon-btn"
              onClick={() => onStatusChange?.(task.id, nextStatus(task.status))}
              title={`Change to ${nextStatus(task.status)}`}
            >
              <StatusIcon size={20} />
            </button>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              <span className={`task-status ${task.status}`}>
                {statusLabels[task.status]}
              </span>
            </div>
            <div className="task-actions">
              <button
                className="icon-btn delete"
                onClick={() => onDelete?.(task.id)}
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
