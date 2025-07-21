import React from 'react';
import styles from './styles/TaskCard.module.scss';
import { TaskCardProps } from './types';
import { formatDate } from '../../utils';
import { useDraggable, useDragMonitor } from '../../hooks';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggleCompleted,
  isSelected = false,
  onTaskSelect,
}) => {
  const dragRef = useDraggable(task.id, 'task', task.columnId);
  const monitorRef = useDragMonitor();

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskToggleCompleted?.(task.id);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onTaskSelect?.(task.id, e.target.checked);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Если нажата клавиша Ctrl или Cmd, добавляем к выбору
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      onTaskSelect?.(task.id, !isSelected);
    }
  };

  return (
    <div
      ref={element => {
        dragRef(element);
        monitorRef(element);
      }}
      className={`${styles.taskCard} ${task.completed ? styles.taskCard_completed : ''} ${isSelected ? styles.taskCard_selected : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.taskCard__header}>
        {onTaskSelect && (
          <input
            type="checkbox"
            className={styles.taskCard__checkbox}
            checked={isSelected}
            onChange={handleSelect}
            onClick={e => e.stopPropagation()}
            title="Выбрать задачу"
          />
        )}
        <button
          className={`${styles.taskCard__toggleButton} ${task.completed ? styles.taskCard__toggleButton_completed : ''}`}
          onClick={handleToggleCompleted}
          title={
            task.completed
              ? 'Отметить как невыполненную'
              : 'Отметить как выполненную'
          }
        >
          {task.completed ? '✓' : '○'}
        </button>
        <h4 className={styles.taskCard__title}>{task.title}</h4>
      </div>
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
