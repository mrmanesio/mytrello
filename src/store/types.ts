import { Column, Task } from '../types';

// Типы для состояния доски
export interface BoardState {
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

// Типы для действий
export interface AddColumnPayload {
  title: string;
  boardId: string;
}

export interface UpdateColumnPayload {
  id: string;
  updates: Partial<Column>;
}

export interface AddTaskPayload {
  title: string;
  description?: string;
  columnId: string;
}

export interface UpdateTaskPayload {
  id: string;
  updates: Partial<Task>;
}

export interface MoveTaskPayload {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
}

export interface ReorderColumnsPayload {
  startIndex: number;
  endIndex: number;
}

// Типы для localStorage
export interface LocalStorageState {
  columns: Column[];
  tasks: Task[];
}
