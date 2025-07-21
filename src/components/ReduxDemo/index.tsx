import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectColumns,
  selectTasks,
  addColumn,
  addTask,
  deleteColumn,
  deleteTask,
  resetBoard,
} from '../../store/slices/boardSlice';
import styles from './ReduxDemo.module.scss';

const ReduxDemo: React.FC = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const tasks = useAppSelector(selectTasks);

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState('');

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch(
        addColumn({
          title: newColumnTitle,
          boardId: 'demo_board',
        })
      );
      setNewColumnTitle('');
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedColumnId) {
      dispatch(
        addTask({
          title: newTaskTitle,
          description: newTaskDescription,
          columnId: selectedColumnId,
        })
      );
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    dispatch(deleteColumn(columnId));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleResetBoard = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные?')) {
      dispatch(resetBoard());
    }
  };

  return (
    <div className={styles.demo}>
      <h2>Redux Store Demo</h2>

      <div className={styles.demo__stats}>
        <p>Колонок: {columns.length}</p>
        <p>Задач: {tasks.length}</p>
      </div>

      <div className={styles.demo__controls}>
        <div className={styles.demo__section}>
          <h3>Добавить колонку</h3>
          <input
            type="text"
            value={newColumnTitle}
            onChange={e => setNewColumnTitle(e.target.value)}
            placeholder="Название колонки"
            className={styles.demo__input}
          />
          <button onClick={handleAddColumn} className={styles.demo__button}>
            Добавить колонку
          </button>
        </div>

        <div className={styles.demo__section}>
          <h3>Добавить задачу</h3>
          <select
            value={selectedColumnId}
            onChange={e => setSelectedColumnId(e.target.value)}
            className={styles.demo__select}
          >
            <option value="">Выберите колонку</option>
            {columns.map(column => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Название задачи"
            className={styles.demo__input}
          />
          <input
            type="text"
            value={newTaskDescription}
            onChange={e => setNewTaskDescription(e.target.value)}
            placeholder="Описание задачи"
            className={styles.demo__input}
          />
          <button onClick={handleAddTask} className={styles.demo__button}>
            Добавить задачу
          </button>
        </div>

        <div className={styles.demo__section}>
          <button
            onClick={handleResetBoard}
            className={styles.demo__button_danger}
          >
            Сбросить все данные
          </button>
        </div>
      </div>

      <div className={styles.demo__content}>
        <h3>Текущее состояние</h3>

        {columns.length === 0 ? (
          <p>Нет колонок. Добавьте первую колонку!</p>
        ) : (
          <div className={styles.demo__columns}>
            {columns.map(column => {
              const columnTasks = tasks.filter(
                task => task.columnId === column.id
              );
              return (
                <div key={column.id} className={styles.demo__column}>
                  <div className={styles.demo__column_header}>
                    <h4>{column.title}</h4>
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      className={styles.demo__delete_button}
                    >
                      ✕
                    </button>
                  </div>

                  {columnTasks.length === 0 ? (
                    <p className={styles.demo__empty}>Нет задач</p>
                  ) : (
                    <div className={styles.demo__tasks}>
                      {columnTasks.map(task => (
                        <div key={task.id} className={styles.demo__task}>
                          <div className={styles.demo__task_content}>
                            <h5>{task.title}</h5>
                            {task.description && <p>{task.description}</p>}
                            <small>
                              Создано:{' '}
                              {new Date(task.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={styles.demo__delete_button}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReduxDemo;
