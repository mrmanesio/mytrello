import { Task } from '../../../types';

export interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}
