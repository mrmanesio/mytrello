import { Column, Task } from '../types';

// Types for board state
export interface BoardState {
  columns: Column[];
  tasks: Task[];
  selectedTaskIds: string[]; // Array of selected tasks
  isLoading: boolean;
  error: string | null;
}

// Types for actions
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

// New types for multiple selection
export interface BulkTaskActionPayload {
  taskIds: string[];
}

export interface BulkMoveTasksPayload {
  taskIds: string[];
  destinationColumnId: string;
}

export interface BulkToggleTasksCompletedPayload {
  taskIds: string[];
  completed: boolean;
}

// Types for localStorage
export interface LocalStorageState {
  columns: Column[];
  tasks: Task[];
}
