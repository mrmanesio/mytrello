import React from 'react';
import { Column as ColumnType, Task } from '../../types';
import {
  useDropTarget,
  useDraggable,
  useDragMonitor,
  DragItem,
  DropLocation,
} from '../../hooks';
import TaskCard from '../TaskCard';
import styles from './styles/Column.module.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  onColumnMove?: (
    columnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  onAddTask?: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
  onAddTask,
}) => {
  const columnDragRef = useDraggable(column.id, 'column');
  const columnMonitorRef = useDragMonitor();

  const handleDrop = (item: DragItem, location: DropLocation) => {
    if (item.type === 'task' && item.columnId) {
      // Находим индекс задачи в текущей колонке
      const taskIndex = tasks.findIndex(task => task.id === item.id);
      const destinationIndex = taskIndex === -1 ? tasks.length : taskIndex;

      onTaskMove(
        item.id,
        item.columnId,
        column.id,
        0, // sourceIndex будет вычислен в родительском компоненте
        destinationIndex
      );
    }
  };

  const dropRef = useDropTarget(handleDrop);

  return (
    <div
      ref={element => {
        columnDragRef(element);
        columnMonitorRef(element);
        dropRef(element);
      }}
      className={styles.column}
      data-column-id={column.id}
    >
      <div className={styles.column__header}>
        <h3 className={styles.column__title}>{column.title}</h3>
        <span className={styles.column__taskCount}>{tasks.length}</span>
      </div>
      <div className={styles.column__content}>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>
      {onAddTask && (
        <div className={styles.column__footer}>
          <button
            className={styles.column__addTaskButton}
            onClick={() => onAddTask(column.id)}
          >
            + Добавить задачу
          </button>
        </div>
      )}
    </div>
  );
};

export default Column;
