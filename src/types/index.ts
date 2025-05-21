export type Priority = 'low' | 'medium' | 'high';

export type ColumnType = 'todo' | 'inProgress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  createdAt: string;
  column: ColumnType;
}

export interface Column {
  id: ColumnType;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: ColumnType[];
}