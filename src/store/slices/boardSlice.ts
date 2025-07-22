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

// Using imported type

// Initial state
const initialState: BoardState = {
  columns: [],
  tasks: [],
  selectedTaskIds: [], // Array of selected tasks
  isLoading: false,
  error: null,
};

// Utilities for working with localStorage
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

    // Convert date strings back to Date objects
    const tasks = (parsedState.tasks || []).map((task: any) => {
      const createdAt = new Date(task.createdAt);
      const updatedAt = new Date(task.updatedAt);

      return {
        ...task,
        completed: task.completed || false, // Add completed field if it doesn't exist
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

// Utilities for working with order
const reorderArray = <T extends { order: number }>(
  array: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update order
  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
};

const getNextOrder = (array: { order: number }[]): number => {
  if (array.length === 0) return 0;
  return Math.max(...array.map(item => item.order)) + 1;
};

// Creating slice
const boardSlice = createSlice({
  name: 'board',
  initialState: {
    ...initialState,
    ...loadFromLocalStorage(),
  },
  reducers: {
    // Actions for columns
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
      // Delete column
      state.columns = state.columns.filter(col => col.id !== columnId);
      // Delete all tasks in this column
      state.tasks = state.tasks.filter(task => task.columnId !== columnId);
      // Recalculate column order
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

    // Actions for tasks
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
        // Delete task
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        // Recalculate task order in column
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

      // If task is moved within the same column
      if (sourceColumnId === destinationColumnId) {
        const columnTasks = state.tasks
          .filter(t => t.columnId === sourceColumnId)
          .sort((a, b) => a.order - b.order);

        const reorderedTasks = reorderArray(
          columnTasks,
          sourceIndex,
          destinationIndex
        );

        // Update order in state
        reorderedTasks.forEach((t, index) => {
          const taskIndex = state.tasks.findIndex(task => task.id === t.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex].order = index;
          }
        });
      } else {
        // If task is moved to a different column
        const sourceColumnTasks = state.tasks
          .filter(t => t.columnId === sourceColumnId)
          .sort((a, b) => a.order - b.order);

        const destinationColumnTasks = state.tasks
          .filter(t => t.columnId === destinationColumnId)
          .sort((a, b) => a.order - b.order);

        // Remove task from source column
        const [movedTask] = sourceColumnTasks.splice(sourceIndex, 1);

        // Insert task into destination column
        destinationColumnTasks.splice(destinationIndex, 0, movedTask);

        // Update columnId for moved task
        const taskIndex = state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].columnId = destinationColumnId;
        }

        // Update order in both columns
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

    // Actions for state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: state => {
      state.error = null;
    },

    // Reset state
    resetBoard: state => {
      state.columns = [];
      state.tasks = [];
      state.selectedTaskIds = [];
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },

    // Actions for multiple task selection
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

    selectAllTasksInColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      const columnTaskIds = state.tasks
        .filter(task => task.columnId === columnId)
        .map(task => task.id);

      // Add only those tasks that are not already selected
      columnTaskIds.forEach(taskId => {
        if (!state.selectedTaskIds.includes(taskId)) {
          state.selectedTaskIds.push(taskId);
        }
      });
    },

    deselectAllTasks: state => {
      state.selectedTaskIds = [];
    },

    deselectAllTasksInColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      const columnTaskIds = state.tasks
        .filter(task => task.columnId === columnId)
        .map(task => task.id);
      state.selectedTaskIds = state.selectedTaskIds.filter(
        id => !columnTaskIds.includes(id)
      );
    },

    // Multiple actions with tasks
    bulkDeleteTasks: (state, action: PayloadAction<BulkTaskActionPayload>) => {
      const { taskIds } = action.payload;

      // Delete tasks
      state.tasks = state.tasks.filter(task => !taskIds.includes(task.id));

      // Clear selected tasks
      state.selectedTaskIds = state.selectedTaskIds.filter(
        id => !taskIds.includes(id)
      );

      // Recalculate task order in each column
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

      // Get tasks to move
      const tasksToMove = state.tasks.filter(task => taskIds.includes(task.id));

      // Get max order in destination column
      const destinationTasks = state.tasks.filter(
        task => task.columnId === destinationColumnId
      );
      const maxOrder =
        destinationTasks.length > 0
          ? Math.max(...destinationTasks.map(task => task.order))
          : -1;

      // Move tasks
      tasksToMove.forEach((task, index) => {
        const taskIndex = state.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].columnId = destinationColumnId;
          state.tasks[taskIndex].order = maxOrder + 1 + index;
          state.tasks[taskIndex].updatedAt = new Date();
        }
      });

      // Recalculate order in original columns
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

      // Clear selected tasks
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

// Export actions
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
  selectAllTasksInColumn,
  deselectAllTasksInColumn,
  deselectAllTasks,
  bulkDeleteTasks,
  bulkMoveTasks,
  bulkToggleTasksCompleted,
} = boardSlice.actions;

// Selectors
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

// Selectors for multiple selection
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

export const selectAllTasksInColumnSelected = (
  state: { board: BoardState },
  columnId: string
) => {
  const columnTasks = state.board.tasks.filter(
    task => task.columnId === columnId
  );
  const selectedColumnTasks = columnTasks.filter(task =>
    state.board.selectedTaskIds.includes(task.id)
  );
  return (
    columnTasks.length > 0 && columnTasks.length === selectedColumnTasks.length
  );
};

export const selectSelectedTasksInColumnCount = (
  state: { board: BoardState },
  columnId: string
) => {
  const columnTasks = state.board.tasks.filter(
    task => task.columnId === columnId
  );
  return columnTasks.filter(task =>
    state.board.selectedTaskIds.includes(task.id)
  ).length;
};

// Export reducer
export default boardSlice.reducer;
