import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectColumns,
  addColumn,
  addTask,
  updateTask,
  deleteTask,
} from '../../store/slices/boardSlice';
import styles from './styles/Board.module.scss';
import { BoardProps } from './types';
import Header from '../Header';
import TaskCard from '../TaskCard';

const Board: React.FC<BoardProps> = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const allTasks = useAppSelector(state => state.board.tasks);

  console.log('columns', columns);
  console.log('allTasks', allTasks);

  const handleAddColumn = () => {
    const title = prompt('Введите название колонки:');
    if (title?.trim()) {
      dispatch(
        addColumn({
          title: title.trim(),
          boardId: 'board_1', // Пока используем фиксированный ID доски
        })
      );
    }
  };

  const handleAddTask = (columnId: string) => {
    const title = prompt('Введите название задачи:');
    if (title?.trim()) {
      dispatch(
        addTask({
          title: title.trim(),
          columnId,
        })
      );
    }
  };

  const handleTaskUpdate = (task: any) => {
    const newTitle = prompt('Введите новое название задачи:', task.title);
    if (newTitle?.trim() && newTitle !== task.title) {
      dispatch(
        updateTask({
          id: task.id,
          updates: {
            title: newTitle.trim(),
          },
        })
      );
    }
  };

  const handleTaskDelete = (taskId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const getTasksForColumn = (columnId: string) => {
    return allTasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className={styles.board}>
      <Header title="MyTrello" />
      <div className={styles.board__content}>
        <div className={styles.board__columns}>
          {columns.map(column => {
            const columnTasks = getTasksForColumn(column.id);

            return (
              <div key={column.id} className={styles.board__column}>
                <div className={styles.board__columnHeader}>
                  <h3 className={styles.board__columnTitle}>{column.title}</h3>
                  <button
                    className={styles.board__addTaskButton}
                    onClick={() => handleAddTask(column.id)}
                  >
                    + Добавить задачу
                  </button>
                </div>
                <div className={styles.board__columnContent}>
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onTaskUpdate={handleTaskUpdate}
                      onTaskDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <div className={styles.board__addColumn}>
            <button
              className={styles.board__addColumnButton}
              onClick={handleAddColumn}
            >
              + Добавить колонку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
