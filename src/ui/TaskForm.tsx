import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
        />
      </div>
      <button type="submit" className="btn btn-primary">
        <Plus size={18} />
        Add Task
      </button>
    </form>
  );
}
