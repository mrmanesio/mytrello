# Redux Store Documentation

## Обзор

Redux Toolkit store для управления состоянием приложения MyTrello. Хранит данные о колонках и задачах с автоматической синхронизацией в localStorage.

## Структура Store

### Состояние (State)

```typescript
interface BoardState {
  columns: Column[];        // Массив колонок
  tasks: Task[];           // Массив задач
  isLoading: boolean;      // Статус загрузки
  error: string | null;    // Ошибки
}
```

### Actions

#### Колонки

- `addColumn(payload: { title: string; boardId: string })` - Добавить колонку
- `updateColumn(payload: { id: string; updates: Partial<Column> })` - Обновить колонку
- `deleteColumn(payload: string)` - Удалить колонку
- `reorderColumns(payload: { startIndex: number; endIndex: number })` - Изменить порядок колонок

#### Задачи

- `addTask(payload: { title: string; description?: string; columnId: string })` - Добавить задачу
- `updateTask(payload: { id: string; updates: Partial<Task> })` - Обновить задачу
- `deleteTask(payload: string)` - Удалить задачу
- `moveTask(payload: { taskId: string; sourceColumnId: string; destinationColumnId: string; sourceIndex: number; destinationIndex: number })` - Переместить задачу

#### Управление состоянием

- `setLoading(payload: boolean)` - Установить статус загрузки
- `setError(payload: string | null)` - Установить ошибку
- `clearError()` - Очистить ошибку
- `resetBoard()` - Сбросить состояние

### Селекторы

- `selectColumns(state)` - Получить отсортированные колонки
- `selectTasks(state)` - Получить отсортированные задачи
- `selectTasksByColumn(state, columnId)` - Получить задачи конкретной колонки
- `selectColumnById(state, columnId)` - Получить колонку по ID
- `selectTaskById(state, taskId)` - Получить задачу по ID
- `selectIsLoading(state)` - Получить статус загрузки
- `selectError(state)` - Получить ошибку

## Использование в компонентах

### Подключение к store

```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  selectColumns, 
  selectTasks, 
  addColumn, 
  addTask 
} from '../store/slices/boardSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const tasks = useAppSelector(selectTasks);

  const handleAddColumn = () => {
    dispatch(addColumn({
      title: 'Новая колонка',
      boardId: 'board_1'
    }));
  };

  const handleAddTask = () => {
    dispatch(addTask({
      title: 'Новая задача',
      description: 'Описание задачи',
      columnId: 'column_1'
    }));
  };

  return (
    // JSX компонента
  );
};
```

### Контейнерный компонент

```typescript
// BoardContainer.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectColumns, addColumn } from '../../store/slices/boardSlice';
import Board from './index';

const BoardContainer = ({ board }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);

  const handleAddColumn = (title: string) => {
    dispatch(addColumn({
      title,
      boardId: board.id,
    }));
  };

  return (
    <Board
      board={board}
      columns={columns}
      onAddColumn={handleAddColumn}
      // другие пропсы
    />
  );
};
```

## localStorage Синхронизация

Store автоматически синхронизируется с localStorage:

- **Сохранение**: При каждом изменении состояния данные сохраняются в localStorage
- **Загрузка**: При инициализации store данные загружаются из localStorage
- **Ключ**: `mytrello_board_state`

### Структура данных в localStorage

```json
{
  "columns": [
    {
      "id": "column_1",
      "title": "To Do",
      "order": 0,
      "boardId": "board_1"
    }
  ],
  "tasks": [
    {
      "id": "task_1",
      "title": "Задача 1",
      "description": "Описание",
      "columnId": "column_1",
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Drag & Drop

Для реализации drag & drop используйте action `moveTask`:

```typescript
const handleDragEnd = (result) => {
  if (!result.destination) return;

  dispatch(moveTask({
    taskId: result.draggableId,
    sourceColumnId: result.source.droppableId,
    destinationColumnId: result.destination.droppableId,
    sourceIndex: result.source.index,
    destinationIndex: result.destination.index,
  }));
};
```

## Обработка ошибок

```typescript
const error = useAppSelector(selectError);
const isLoading = useAppSelector(selectIsLoading);

if (isLoading) {
  return <div>Загрузка...</div>;
}

if (error) {
  return <div>Ошибка: {error}</div>;
}
```

## Типы TypeScript

```typescript
import type { RootState, AppDispatch } from '../store';

// В компонентах используйте типизированные хуки
const dispatch: AppDispatch = useAppDispatch();
const state: RootState = useAppSelector(state => state);
```

## Middleware

Store настроен с middleware для игнорирования проверки сериализации Date объектов:

```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['board/addTask', 'board/updateTask', 'board/updateColumn'],
      ignoredPaths: ['board.tasks', 'board.columns'],
    },
  }),
``` 