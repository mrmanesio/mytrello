import { Task } from '../../../types';

export interface TaskCardProps {
  task: Task;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskToggleCompleted?: (taskId: string) => void;
  isSelected?: boolean;
  onTaskSelect?: (taskId: string, isSelected: boolean) => void;
}
