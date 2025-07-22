export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
  selected?: boolean;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
