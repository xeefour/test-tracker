/**
 * Web-side mirror of the server's `Task` type.
 *
 * Kept in the web app to avoid coupling the frontend to the server's source
 * layout. If the type starts to drift, extract a `@tracker/shared` workspace.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = Task['status'];
