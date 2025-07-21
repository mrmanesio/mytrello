import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';

// Конфигурация store
export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверку сериализации для Date объектов
        ignoredActions: [
          'board/addTask',
          'board/updateTask',
          'board/updateColumn',
        ],
        ignoredPaths: ['board.tasks', 'board.columns'],
      },
    }),
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
