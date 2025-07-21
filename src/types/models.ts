export interface Task {
  id: string;
  title: string;
  completed: boolean;
  columnId: string;
  selected: boolean;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  taskIds: string[];
}
