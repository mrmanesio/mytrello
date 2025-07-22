import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectSelectedTasksCount,
  selectSelectedTasks,
  selectColumns,
  bulkDeleteTasks,
  bulkMoveTasks,
  bulkToggleTasksCompleted,
  deselectAllTasks,
} from '../../store/slices/boardSlice';
import styles from './styles/BulkActionPanel.module.scss';

const BulkActionPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector(selectSelectedTasksCount);
  const selectedTasks = useAppSelector(selectSelectedTasks);
  const columns = useAppSelector(selectColumns);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);

  // Проверяем, все ли выбранные задачи выполнены
  const allCompleted =
    selectedTasks.length > 0 && selectedTasks.every(task => task.completed);

  const handleDelete = () => {
    if (
      window.confirm(`Вы уверены, что хотите удалить ${selectedCount} задач?`)
    ) {
      dispatch(
        bulkDeleteTasks({
          taskIds: selectedTasks.map(task => task.id),
        })
      );
    }
  };

  const handleToggleCompleted = () => {
    const newCompletedState = !allCompleted;
    dispatch(
      bulkToggleTasksCompleted({
        taskIds: selectedTasks.map(task => task.id),
        completed: newCompletedState,
      })
    );
  };

  const handleMoveToColumn = (columnId: string) => {
    dispatch(
      bulkMoveTasks({
        taskIds: selectedTasks.map(task => task.id),
        destinationColumnId: columnId,
      })
    );
    setIsMoveMenuOpen(false);
  };

  const handleClose = () => {
    dispatch(deselectAllTasks());
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.bulkActionPanel}>
      <div className={styles.bulkActionPanel__info}>
        <span className={styles.bulkActionPanel__count}>
          Selected tasks: {selectedCount}
        </span>
        <div className={styles.bulkActionPanel__shortcuts}>
          <span className={styles.bulkActionPanel__shortcut}>Ctrl+A</span>
          <span className={styles.bulkActionPanel__shortcut}>Esc</span>
        </div>
        <button
          className={styles.bulkActionPanel__closeButton}
          onClick={handleClose}
          title="Deselect"
        >
          ✕
        </button>
      </div>

      <div className={styles.bulkActionPanel__actions}>
        <button
          className={`${styles.bulkActionPanel__actionButton} ${styles.bulkActionPanel__actionButton_danger}`}
          onClick={handleDelete}
          title="Delete selected tasks"
        >
          🗑️ Delete
        </button>

        <button
          className={styles.bulkActionPanel__actionButton}
          onClick={handleToggleCompleted}
          title={allCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {allCompleted ? '○ Unmark as completed' : '✓ Mark as completed'}
        </button>

        <div className={styles.bulkActionPanel__moveContainer}>
          <button
            className={styles.bulkActionPanel__actionButton}
            onClick={() => setIsMoveMenuOpen(!isMoveMenuOpen)}
            title="Move to another column"
          >
            📁 Move
          </button>

          {isMoveMenuOpen && (
            <div className={styles.bulkActionPanel__moveMenu}>
              {columns.map(column => (
                <button
                  key={column.id}
                  className={styles.bulkActionPanel__moveMenuItem}
                  onClick={() => handleMoveToColumn(column.id)}
                >
                  {column.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionPanel;
