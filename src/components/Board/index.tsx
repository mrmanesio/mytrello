import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectColumns,
  selectSelectedTaskIds,
  addColumn,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
  moveTask,
  reorderColumns,
  selectTask,
  deselectTask,
} from '../../store/slices/boardSlice';
import styles from './styles/Board.module.scss';
import { BoardProps } from './types';
import Header from '../Header';
import Column from '../Column';
import BulkActionPanel from '../BulkActionPanel';
import {
  useDropTarget,
  DragItem,
  DropLocation,
  useKeyboardShortcuts,
} from '../../hooks';

const Board: React.FC<BoardProps> = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const allTasks = useAppSelector(state => state.board.tasks);
  const selectedTaskIds = useAppSelector(selectSelectedTaskIds);

  // Подключаем клавиатурные сокращения
  useKeyboardShortcuts();

  const handleAddColumn = () => {
    const title = prompt('Введите название колонки:');
    if (title?.trim()) {
      dispatch(
        addColumn({
          title: title.trim(),
          boardId: 'board_1',
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
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleTaskToggleCompleted = (taskId: string) => {
    dispatch(toggleTaskCompleted(taskId));
  };

  const handleTaskSelect = (taskId: string, isSelected: boolean) => {
    if (isSelected) {
      dispatch(selectTask(taskId));
    } else {
      dispatch(deselectTask(taskId));
    }
  };

  const handleTaskMove = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    // Находим реальный sourceIndex
    const sourceTasks = allTasks
      .filter(task => task.columnId === sourceColumnId)
      .sort((a, b) => a.order - b.order);

    const actualSourceIndex = sourceTasks.findIndex(task => task.id === taskId);

    if (actualSourceIndex !== -1) {
      dispatch(
        moveTask({
          taskId,
          sourceColumnId,
          destinationColumnId,
          sourceIndex: actualSourceIndex,
          destinationIndex,
        })
      );
    }
  };

  const handleColumnDrop = (item: DragItem, location: DropLocation) => {
    if (item.type === 'column' && location.elementId) {
      // Находим индексы колонок
      const sourceIndex = columns.findIndex(col => col.id === item.id);
      const destinationIndex = columns.findIndex(
        col => col.id === location.elementId
      );

      if (
        sourceIndex !== -1 &&
        destinationIndex !== -1 &&
        sourceIndex !== destinationIndex
      ) {
        dispatch(
          reorderColumns({
            startIndex: sourceIndex,
            endIndex: destinationIndex,
          })
        );
      }
    }
  };

  const boardDropRef = useDropTarget(handleColumnDrop);

  const getTasksForColumn = (columnId: string) => {
    return allTasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className={styles.board}>
      <Header title="MyTrello" />
      <div className={styles.board__content}>
        <div ref={boardDropRef} className={styles.board__columns}>
          {columns.map((column, columnIndex) => {
            const columnTasks = getTasksForColumn(column.id);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskToggleCompleted={handleTaskToggleCompleted}
                onTaskMove={handleTaskMove}
                onAddTask={handleAddTask}
                selectedTaskIds={selectedTaskIds}
                onTaskSelect={handleTaskSelect}
              />
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
      <BulkActionPanel />
    </div>
  );
};

export default Board;
