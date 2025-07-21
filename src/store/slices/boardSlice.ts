import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Column, Task } from '../../types';
import {
  BoardState,
  AddColumnPayload,
  UpdateColumnPayload,
  AddTaskPayload,
  UpdateTaskPayload,
  MoveTaskPayload,
  ReorderColumnsPayload,
} from '../types';

// Используем импортированный тип

// Начальное состояние
const initialState: BoardState = {
  columns: [],
  tasks: [],
  isLoading: false,
  error: null,
};

// Утилиты для работы с localStorage
const STORAGE_KEY = 'mytrello_board_state';

const saveToLocalStorage = (state: BoardState) => {
  try {
    const serializedState = JSON.stringify({
      columns: state.columns,
      tasks: state.tasks,
    });
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const loadFromLocalStorage = (): Partial<BoardState> => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return { columns: [], tasks: [] };
    }
    const parsedState = JSON.parse(serializedState);
    return {
      columns: parsedState.columns || [],
      tasks: parsedState.tasks || [],
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return { columns: [], tasks: [] };
  }
};

// Утилиты для работы с порядком
const reorderArray = <T extends { order: number }>(
  array: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Обновляем порядок
  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
};

const getNextOrder = (array: { order: number }[]): number => {
  if (array.length === 0) return 0;
  return Math.max(...array.map(item => item.order)) + 1;
};

// Создание slice
const boardSlice = createSlice({
  name: 'board',
  initialState: {
    ...initialState,
    ...loadFromLocalStorage(),
  },
  reducers: {
    // Действия для колонок
    addColumn: (state, action: PayloadAction<AddColumnPayload>) => {
      const newColumn: Column = {
        ...action.payload,
        id: `column_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: getNextOrder(state.columns),
      };
      state.columns.push(newColumn);
      saveToLocalStorage(state);
    },

    updateColumn: (state, action: PayloadAction<UpdateColumnPayload>) => {
      const { id, updates } = action.payload;
      const columnIndex = state.columns.findIndex(col => col.id === id);
      if (columnIndex !== -1) {
        state.columns[columnIndex] = {
          ...state.columns[columnIndex],
          ...updates,
        };
        saveToLocalStorage(state);
      }
    },

    deleteColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      // Удаляем колонку
      state.columns = state.columns.filter(col => col.id !== columnId);
      // Удаляем все задачи в этой колонке
      state.tasks = state.tasks.filter(task => task.columnId !== columnId);
      // Пересчитываем порядок колонок
      state.columns = state.columns.map((col, index) => ({
        ...col,
        order: index,
      }));
      saveToLocalStorage(state);
    },

    reorderColumns: (state, action: PayloadAction<ReorderColumnsPayload>) => {
      const { startIndex, endIndex } = action.payload;
      state.columns = reorderArray(state.columns, startIndex, endIndex);
      saveToLocalStorage(state);
    },

    // Действия для задач
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const newTask: Task = {
        ...action.payload,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: getNextOrder(
          state.tasks.filter(task => task.columnId === action.payload.columnId)
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.tasks.push(newTask);
      saveToLocalStorage(state);
    },

    updateTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        };
        saveToLocalStorage(state);
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        // Удаляем задачу
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        // Пересчитываем порядок задач в колонке
        const columnTasks = state.tasks.filter(
          t => t.columnId === task.columnId
        );
        columnTasks.forEach((t, index) => {
          const taskIndex = state.tasks.findIndex(task => task.id === t.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
        saveToLocalStorage(state);
      }
    },

    moveTask: (state, action: PayloadAction<MoveTaskPayload>) => {
      const {
        taskId,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      } = action.payload;

      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;

      // Если задача перемещается в ту же колонку
      if (sourceColumnId === destinationColumnId) {
        const columnTasks = state.tasks
          .filter(t => t.columnId === sourceColumnId)
          .sort((a, b) => a.order - b.order);

        const reorderedTasks = reorderArray(
          columnTasks,
          sourceIndex,
          destinationIndex
        );

        // Обновляем порядок в state
        reorderedTasks.forEach((t, index) => {
          const taskIndex = state.tasks.findIndex(task => task.id === t.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
      } else {
        // Если задача перемещается в другую колонку
        const sourceColumnTasks = state.tasks
          .filter(t => t.columnId === sourceColumnId)
          .sort((a, b) => a.order - b.order);

        const destinationColumnTasks = state.tasks
          .filter(t => t.columnId === destinationColumnId)
          .sort((a, b) => a.order - b.order);

        // Удаляем задачу из исходной колонки
        const [movedTask] = sourceColumnTasks.splice(sourceIndex, 1);

        // Вставляем задачу в целевую колонку
        destinationColumnTasks.splice(destinationIndex, 0, movedTask);

        // Обновляем columnId для перемещенной задачи
        const taskIndex = state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].columnId = destinationColumnId;
        }

        // Обновляем порядок в обеих колонках
        sourceColumnTasks.forEach((t, index) => {
          const taskIndex = state.tasks.findIndex(task => task.id === t.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });

        destinationColumnTasks.forEach((t, index) => {
          const taskIndex = state.tasks.findIndex(task => task.id === t.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
      }

      saveToLocalStorage(state);
    },

    // Действия для управления состоянием
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: state => {
      state.error = null;
    },

    // Сброс состояния
    resetBoard: state => {
      state.columns = [];
      state.tasks = [];
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

// Экспорт действий
export const {
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setLoading,
  setError,
  clearError,
  resetBoard,
} = boardSlice.actions;

// Селекторы
export const selectColumns = (state: { board: BoardState }) =>
  [...state.board.columns].sort((a, b) => a.order - b.order);

export const selectTasks = (state: { board: BoardState }) =>
  [...state.board.tasks].sort((a, b) => a.order - b.order);

export const selectTasksByColumn = (
  state: { board: BoardState },
  columnId: string
) =>
  [...state.board.tasks]
    .filter(task => task.columnId === columnId)
    .sort((a, b) => a.order - b.order);

export const selectColumnById = (
  state: { board: BoardState },
  columnId: string
) => state.board.columns.find(col => col.id === columnId);

export const selectTaskById = (state: { board: BoardState }, taskId: string) =>
  state.board.tasks.find(task => task.id === taskId);

export const selectIsLoading = (state: { board: BoardState }) =>
  state.board.isLoading;
export const selectError = (state: { board: BoardState }) => state.board.error;

// Экспорт reducer
export default boardSlice.reducer;
