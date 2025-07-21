import React from 'react';
import styles from './styles/TaskCard.module.scss';
import { TaskCardProps } from './types';
import { formatDate } from '../../utils';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
}) => {
  return (
    <div className={styles.taskCard}>
      <h4 className={styles.taskCard__title}>{task.title}</h4>
      {task.description && (
        <p className={styles.taskCard__description}>{task.description}</p>
      )}
      <div className={styles.taskCard__meta}>
        <span className={styles.taskCard__date}>
          {formatDate(task.createdAt)}
        </span>
        <div className={styles.taskCard__actions}>
          <button
            className={styles.taskCard__actionButton}
            onClick={() => onTaskUpdate?.(task)}
          >
            ✏️
          </button>
          <button
            className={styles.taskCard__actionButton}
            onClick={() => onTaskDelete?.(task.id)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
