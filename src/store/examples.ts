// Примеры использования Redux Toolkit store

import { store } from './index';
import {
  addColumn,
  addTask,
  updateColumn,
  deleteColumn,
  updateTask,
  deleteTask,
  moveTask,
  reorderColumns,
  resetBoard,
} from './slices/boardSlice';

// Пример 1: Создание колонок и задач
export const createSampleData = () => {
  // Добавляем колонки
  store.dispatch(addColumn({ title: 'To Do', boardId: 'board_1' }));
  store.dispatch(addColumn({ title: 'In Progress', boardId: 'board_1' }));
  store.dispatch(addColumn({ title: 'Done', boardId: 'board_1' }));

  // Получаем ID колонок
  const state = store.getState();
  const columns = state.board.columns;
  const todoColumn = columns.find(col => col.title === 'To Do');
  const progressColumn = columns.find(col => col.title === 'In Progress');
  const doneColumn = columns.find(col => col.title === 'Done');

  if (todoColumn) {
    // Добавляем задачи в колонку To Do
    store.dispatch(
      addTask({
        title: 'Изучить Redux Toolkit',
        description: 'Изучить основы Redux Toolkit и RTK Query',
        columnId: todoColumn.id,
      })
    );

    store.dispatch(
      addTask({
        title: 'Создать компоненты',
        description: 'Создать React компоненты для доски',
        columnId: todoColumn.id,
      })
    );
  }

  if (progressColumn) {
    // Добавляем задачу в колонку In Progress
    store.dispatch(
      addTask({
        title: 'Настроить TypeScript',
        description: 'Настроить TypeScript конфигурацию',
        columnId: progressColumn.id,
      })
    );
  }

  if (doneColumn) {
    // Добавляем задачу в колонку Done
    store.dispatch(
      addTask({
        title: 'Создать проект',
        description: 'Создать базовую структуру проекта',
        columnId: doneColumn.id,
      })
    );
  }
};

// Пример 2: Обновление данных
export const updateSampleData = () => {
  const state = store.getState();
  const columns = state.board.columns;
  const tasks = state.board.tasks;

  // Обновляем название колонки
  if (columns.length > 0) {
    store.dispatch(
      updateColumn({
        id: columns[0].id,
        updates: { title: 'Updated Column Title' },
      })
    );
  }

  // Обновляем задачу
  if (tasks.length > 0) {
    store.dispatch(
      updateTask({
        id: tasks[0].id,
        updates: {
          title: 'Updated Task Title',
          description: 'Updated task description',
        },
      })
    );
  }
};

// Пример 3: Перемещение задач
export const moveSampleTask = () => {
  const state = store.getState();
  const columns = state.board.columns;
  const tasks = state.board.tasks;

  if (columns.length >= 2 && tasks.length > 0) {
    const sourceColumn = columns[0];
    const destinationColumn = columns[1];
    const task = tasks[0];

    // Перемещаем задачу из первой колонки во вторую
    store.dispatch(
      moveTask({
        taskId: task.id,
        sourceColumnId: sourceColumn.id,
        destinationColumnId: destinationColumn.id,
        sourceIndex: 0,
        destinationIndex: 0,
      })
    );
  }
};

// Пример 4: Изменение порядка колонок
export const reorderSampleColumns = () => {
  const state = store.getState();
  const columns = state.board.columns;

  if (columns.length >= 2) {
    // Меняем местами первую и вторую колонки
    store.dispatch(
      reorderColumns({
        startIndex: 0,
        endIndex: 1,
      })
    );
  }
};

// Пример 5: Удаление данных
export const deleteSampleData = () => {
  const state = store.getState();
  const columns = state.board.columns;
  const tasks = state.board.tasks;

  // Удаляем первую задачу
  if (tasks.length > 0) {
    store.dispatch(deleteTask(tasks[0].id));
  }

  // Удаляем первую колонку (это также удалит все задачи в ней)
  if (columns.length > 0) {
    store.dispatch(deleteColumn(columns[0].id));
  }
};

// Пример 6: Сброс всех данных
export const resetAllData = () => {
  store.dispatch(resetBoard());
};

// Пример 7: Получение данных с фильтрацией
export const getFilteredData = () => {
  const state = store.getState();
  const columns = state.board.columns;
  const tasks = state.board.tasks;

  // Получаем задачи конкретной колонки
  if (columns.length > 0) {
    const columnId = columns[0].id;
    const columnTasks = tasks.filter(task => task.columnId === columnId);
    console.log(`Задачи в колонке "${columns[0].title}":`, columnTasks);
  }

  // Получаем задачи с описанием
  const tasksWithDescription = tasks.filter(task => task.description);
  console.log('Задачи с описанием:', tasksWithDescription);

  // Получаем колонки с задачами
  const columnsWithTaskCount = columns.map(column => ({
    ...column,
    taskCount: tasks.filter(task => task.columnId === column.id).length,
  }));
  console.log('Колонки с количеством задач:', columnsWithTaskCount);
};

// Пример 8: Работа с localStorage
export const localStorageExample = () => {
  // Данные автоматически сохраняются в localStorage при каждом изменении
  // Можно проверить содержимое localStorage
  const storedData = localStorage.getItem('mytrello_board_state');
  if (storedData) {
    console.log('Данные в localStorage:', JSON.parse(storedData));
  }

  // Можно также очистить localStorage
  // localStorage.removeItem('mytrello_board_state');
};

// Пример 9: Подписка на изменения store
export const subscribeToStore = () => {
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    console.log('Store обновлен:', {
      columnsCount: state.board.columns.length,
      tasksCount: state.board.tasks.length,
      isLoading: state.board.isLoading,
      error: state.board.error,
    });
  });

  // Возвращаем функцию для отписки
  return unsubscribe;
};

// Пример 10: Комплексный сценарий
export const complexScenario = () => {
  // 1. Создаем данные
  createSampleData();

  // 2. Ждем немного и обновляем
  setTimeout(() => {
    updateSampleData();
  }, 1000);

  // 3. Ждем и перемещаем задачи
  setTimeout(() => {
    moveSampleTask();
  }, 2000);

  // 4. Ждем и меняем порядок колонок
  setTimeout(() => {
    reorderSampleColumns();
  }, 3000);

  // 5. Ждем и получаем отфильтрованные данные
  setTimeout(() => {
    getFilteredData();
  }, 4000);
};
