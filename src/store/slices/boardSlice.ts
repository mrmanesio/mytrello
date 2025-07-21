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
  BulkTaskActionPayload,
  BulkMoveTasksPayload,
  BulkToggleTasksCompletedPayload,
} from '../types';

// Используем импортированный тип

// Начальное состояние
const initialState: BoardState = {
  columns: [],
  tasks: [],
  selectedTaskIds: [], // Добавляем массив выбранных задач
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

    // Преобразуем строки дат обратно в объекты Date
    const tasks = (parsedState.tasks || []).map((task: any) => {
      const createdAt = new Date(task.createdAt);
      const updatedAt = new Date(task.updatedAt);

      return {
        ...task,
        completed: task.completed || false, // Добавляем поле completed если его нет
        createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
      };
    });

    return {
      columns: parsedState.columns || [],
      tasks,
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
        completed: false,
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

    toggleTaskCompleted: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        state.tasks[taskIndex].updatedAt = new Date();
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
      state.selectedTaskIds = [];
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },

    // Действия для множественного выбора задач
    selectTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (!state.selectedTaskIds.includes(taskId)) {
        state.selectedTaskIds.push(taskId);
      }
    },

    deselectTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== taskId);
    },

    selectAllTasks: state => {
      state.selectedTaskIds = state.tasks.map(task => task.id);
    },

    deselectAllTasks: state => {
      state.selectedTaskIds = [];
    },

    // Множественные действия с задачами
    bulkDeleteTasks: (state, action: PayloadAction<BulkTaskActionPayload>) => {
      const { taskIds } = action.payload;

      // Удаляем задачи
      state.tasks = state.tasks.filter(task => !taskIds.includes(task.id));

      // Очищаем выбранные задачи
      state.selectedTaskIds = state.selectedTaskIds.filter(
        id => !taskIds.includes(id)
      );

      // Пересчитываем порядок задач в каждой колонке
      const columnIds = Array.from(
        new Set(state.tasks.map(task => task.columnId))
      );
      columnIds.forEach(columnId => {
        const columnTasks = state.tasks
          .filter(task => task.columnId === columnId)
          .sort((a, b) => a.order - b.order);

        columnTasks.forEach((task, index) => {
          const taskIndex = state.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
      });

      saveToLocalStorage(state);
    },

    bulkMoveTasks: (state, action: PayloadAction<BulkMoveTasksPayload>) => {
      const { taskIds, destinationColumnId } = action.payload;

      // Получаем задачи для перемещения
      const tasksToMove = state.tasks.filter(task => taskIds.includes(task.id));

      // Получаем максимальный порядок в целевой колонке
      const destinationTasks = state.tasks.filter(
        task => task.columnId === destinationColumnId
      );
      const maxOrder =
        destinationTasks.length > 0
          ? Math.max(...destinationTasks.map(task => task.order))
          : -1;

      // Перемещаем задачи
      tasksToMove.forEach((task, index) => {
        const taskIndex = state.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].columnId = destinationColumnId;
          state.tasks[taskIndex].order = maxOrder + 1 + index;
          state.tasks[taskIndex].updatedAt = new Date();
        }
      });

      // Пересчитываем порядок в исходных колонках
      const sourceColumnIds = Array.from(
        new Set(tasksToMove.map(task => task.columnId))
      );
      sourceColumnIds.forEach(columnId => {
        const columnTasks = state.tasks
          .filter(task => task.columnId === columnId)
          .sort((a, b) => a.order - b.order);

        columnTasks.forEach((task, index) => {
          const taskIndex = state.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
      });

      // Очищаем выбранные задачи
      state.selectedTaskIds = state.selectedTaskIds.filter(
        id => !taskIds.includes(id)
      );

      saveToLocalStorage(state);
    },

    bulkToggleTasksCompleted: (
      state,
      action: PayloadAction<BulkToggleTasksCompletedPayload>
    ) => {
      const { taskIds, completed } = action.payload;

      taskIds.forEach(taskId => {
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].completed = completed;
          state.tasks[taskIndex].updatedAt = new Date();
        }
      });

      saveToLocalStorage(state);
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
  toggleTaskCompleted,
  moveTask,
  setLoading,
  setError,
  clearError,
  resetBoard,
  selectTask,
  deselectTask,
  selectAllTasks,
  deselectAllTasks,
  bulkDeleteTasks,
  bulkMoveTasks,
  bulkToggleTasksCompleted,
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

// Селекторы для множественного выбора
export const selectSelectedTaskIds = (state: { board: BoardState }) =>
  state.board.selectedTaskIds;

export const selectSelectedTasks = (state: { board: BoardState }) =>
  state.board.tasks.filter(task =>
    state.board.selectedTaskIds.includes(task.id)
  );

export const selectHasSelectedTasks = (state: { board: BoardState }) =>
  state.board.selectedTaskIds.length > 0;

export const selectSelectedTasksCount = (state: { board: BoardState }) =>
  state.board.selectedTaskIds.length;

// Экспорт reducer
export default boardSlice.reducer;
