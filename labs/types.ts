export interface TaskItem {
  title: string;
  isDone: boolean;
  assigned_to?: string;
  tags?: string[];
}

export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  subTasks: TaskItem[] | null;
  createdAt: string;
  updatedAt: string;
}
