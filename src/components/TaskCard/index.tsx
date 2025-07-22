import React from 'react';
import { useDraggable, useDragMonitor } from '../../hooks';
import { Task } from '../../types';
import styles from './styles/TaskCard.module.scss';
import { TaskCardProps } from './types';

// Компонент для подсветки совпадающего текста
const HighlightedText: React.FC<{ text: string; searchQuery: string }> = ({
  text,
  searchQuery,
}) => {
  if (!searchQuery.trim()) {
    return <>{text}</>;
  }

  const query = searchQuery.toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(query);

  if (index === -1) {
    return <>{text}</>;
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return (
    <>
      {before}
      <mark className={styles.taskCard__highlight}>{match}</mark>
      {after}
    </>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggleCompleted,
  isSelected = false,
  onTaskSelect,
  searchQuery = '',
}) => {
  const dragRef = useDraggable(task.id, 'task', task.columnId);
  const monitorRef = useDragMonitor();

  const handleCardClick = (e: React.MouseEvent) => {
    // Не вызываем onTaskSelect если клик был на чекбоксе или кнопке
    if (
      (e.target as HTMLElement).closest('input[type="checkbox"]') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    onTaskSelect?.(task.id, !isSelected);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onTaskSelect?.(task.id, e.target.checked);
  };

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskToggleCompleted?.(task.id);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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
            title="Select task"
          />
        )}
        <button
          className={`${styles.taskCard__toggleButton} ${task.completed ? styles.taskCard__toggleButton_completed : ''}`}
          onClick={handleToggleCompleted}
          title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {task.completed ? '✓' : '○'}
        </button>
        <h4 className={styles.taskCard__title}>
          <HighlightedText text={task.title} searchQuery={searchQuery} />
        </h4>
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
