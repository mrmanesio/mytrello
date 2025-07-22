import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';

// Store configuration
export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization check for Date objects
        ignoredActions: [
          'board/addTask',
          'board/updateTask',
          'board/updateColumn',
        ],
        ignoredPaths: ['board.tasks', 'board.columns'],
      },
    }),
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
