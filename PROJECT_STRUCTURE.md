# Структура проекта MyTrello

## Обзор

Проект создан с использованием React + TypeScript + Redux Toolkit без UI библиотек. Настроена базовая структура для масштабируемого приложения с полным управлением состоянием.

## Структура папок

```
mytrello/
├── public/                    # Статические файлы
├── src/                       # Исходный код
│   ├── components/            # React компоненты
│   │   ├── Board/            # Компонент доски
│   │   │   ├── styles/       # SCSS модули компонента
│   │   │   ├── types/        # TypeScript типы
│   │   │   ├── __tests__/    # Тесты (пока пустая)
│   │   │   ├── components/   # Вложенные компоненты (пока пустая)
│   │   │   └── index.tsx     # Основной файл компонента
│   │   ├── ColumnList/       # Список колонок
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── index.tsx
│   │   ├── TaskCard/         # Карточка задачи
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── index.tsx
│   │   ├── TaskForm/         # Форма задачи
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── index.tsx
│   │   ├── Header/           # Заголовок приложения
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── index.tsx
│   │   ├── BulkActionPanel/  # Панель управления множественным выбором
│   │   │   ├── styles/
│   │   │   └── index.tsx
│   │   └── index.ts          # Экспорт всех компонентов
│   ├── hooks/                # Пользовательские хуки
│   │   ├── index.ts          # Экспорт хуков
│   │   ├── usePrevious.ts    # Получение предыдущего значения
│   │   ├── useClickOutside.ts # Обработка кликов вне элемента
│   │   ├── useDragAndDrop.ts # Drag & Drop функциональность
│   │   └── useKeyboardShortcuts.ts # Клавиатурные сокращения
│   ├── types/                # Глобальные TypeScript типы
│   │   └── index.ts          # Task, Column, Board, User
│   ├── utils/                # Утилиты
│   │   └── index.ts          # generateId, formatDate, debounce
│   ├── store/                # Redux Toolkit store
│   │   ├── slices/           # Redux slices
│   │   │   └── boardSlice.ts # Slice для управления доской
│   │   ├── hooks.ts          # Типизированные хуки
│   │   ├── types.ts          # Типы для store
│   │   ├── examples.ts       # Примеры использования
│   │   ├── README.md         # Документация store
│   │   └── index.ts          # Конфигурация store
│   ├── App.tsx               # Главный компонент
│   ├── App.scss              # Глобальные стили
│   ├── index.tsx             # Точка входа
│   └── index.css             # Базовые стили
├── .eslintrc.js              # Конфигурация ESLint
├── .prettierrc               # Конфигурация Prettier
├── package.json              # Зависимости и скрипты
├── README.md                 # Документация
├── PROJECT_STRUCTURE.md      # Структура проекта
├── BULK_ACTIONS.md           # Документация множественного выбора
└── DRAG_AND_DROP.md          # Документация Drag & Drop
```

## Компоненты

### Board
- **Назначение**: Основной компонент доски
- **Пропсы**: `board`, `onBoardUpdate`
- **Стили**: Модульные SCSS с BEM методологией
- **Особенности**: Отображает заголовок и контент доски, интегрирует панель управления множественным выбором

### Header
- **Назначение**: Заголовок приложения с навигацией
- **Пропсы**: `title`, `onMenuClick`, `onAddClick`
- **Стили**: Современный дизайн с кнопками действий

### ColumnList
- **Назначение**: Список колонок с возможностью добавления
- **Пропсы**: `columns`, `onColumnAdd`, `onColumnUpdate`, `onColumnDelete`
- **Стили**: Горизонтальная прокрутка, карточный дизайн

### TaskCard
- **Назначение**: Карточка отдельной задачи
- **Пропсы**: `task`, `onTaskUpdate`, `onTaskDelete`, `isSelected`, `onTaskSelect`
- **Стили**: Hover эффекты, адаптивный дизайн, визуальные индикаторы выбора
- **Особенности**: Поддержка множественного выбора с чекбоксом

### TaskForm
- **Назначение**: Форма создания/редактирования задач
- **Пропсы**: `task`, `onSubmit`, `onCancel`, `isEditing`
- **Стили**: Модальный дизайн, валидация форм

### BulkActionPanel
- **Назначение**: Панель управления множественным выбором задач
- **Особенности**: Отображается при выборе задач, поддерживает массовые операции
- **Функции**: Удаление, изменение статуса, перемещение задач
- **Стили**: Фиксированное позиционирование, адаптивный дизайн

## Типы данных

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
}

interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

## Утилиты

- `generateId()` - Генерация уникальных ID
- `formatDate()` - Форматирование дат
- `debounce()` - Дебаунсинг функций

## Хуки

- `usePrevious()` - Получение предыдущего значения
- `useClickOutside()` - Обработка кликов вне элемента
- `useDragAndDrop()` - Drag & Drop функциональность
- `useKeyboardShortcuts()` - Клавиатурные сокращения для множественного выбора

## Стилизация

- **SCSS модули** для изоляции стилей
- **BEM методология** для именования классов
- **Адаптивный дизайн** с мобильной поддержкой
- **Современная цветовая схема** в стиле Trello

## Инструменты разработки

### ESLint
- Настроен для TypeScript и React
- Интеграция с Prettier
- Правила для качественного кода

### Prettier
- Автоматическое форматирование
- Поддержка TypeScript, SCSS, CSS
- Единообразный стиль кода

### Скрипты
```bash
npm start          # Запуск в режиме разработки
npm run build      # Сборка для продакшена
npm run test       # Запуск тестов
npm run lint       # Проверка ESLint
npm run lint:fix   # Исправление ESLint ошибок
npm run format     # Форматирование Prettier
npm run format:check # Проверка форматирования
```

## Redux Toolkit Store

### Основные возможности

- **Управление колонками**: добавление, удаление, переименование, изменение порядка
- **Управление задачами**: добавление, удаление, редактирование, перемещение между колонками
- **Drag & Drop**: поддержка перемещения задач и сортировки колонок
- **Множественный выбор**: выбор задач, массовые операции
- **localStorage синхронизация**: автоматическое сохранение и загрузка данных
- **TypeScript поддержка**: полная типизация всех действий и состояния

### Actions

#### Колонки
- `addColumn` - Добавить колонку
- `updateColumn` - Обновить колонку
- `deleteColumn` - Удалить колонку
- `reorderColumns` - Изменить порядок колонок

#### Задачи
- `addTask` - Добавить задачу
- `updateTask` - Обновить задачу
- `deleteTask` - Удалить задачу
- `moveTask` - Переместить задачу
- `toggleTaskCompleted` - Переключить статус выполнения

#### Множественный выбор
- `selectTask` - Выбрать задачу
- `deselectTask` - Отменить выбор задачи
- `selectAllTasks` - Выбрать все задачи
- `deselectAllTasks` - Отменить выбор всех задач

#### Массовые операции
- `bulkDeleteTasks` - Удалить выбранные задачи
- `bulkMoveTasks` - Переместить выбранные задачи
- `bulkToggleTasksCompleted` - Изменить статус выбранных задач

### Селекторы
- `selectColumns` - Получить отсортированные колонки
- `selectTasks` - Получить отсортированные задачи
- `selectTasksByColumn` - Получить задачи конкретной колонки
- `selectColumnById` - Получить колонку по ID
- `selectTaskById` - Получить задачу по ID
- `selectSelectedTaskIds` - Получить ID выбранных задач
- `selectSelectedTasks` - Получить объекты выбранных задач
- `selectHasSelectedTasks` - Проверить наличие выбранных задач
- `selectSelectedTasksCount` - Получить количество выбранных задач

### Использование в компонентах

```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectColumns, addColumn, selectTask } from '../store/slices/boardSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const selectedTasks = useAppSelector(selectSelectedTasks);

  const handleAddColumn = () => {
    dispatch(addColumn({
      title: 'Новая колонка',
      boardId: 'board_1'
    }));
  };

  const handleSelectTask = (taskId: string) => {
    dispatch(selectTask(taskId));
  };

  return (
    // JSX компонента
  );
};
```

## Множественный выбор задач

### Возможности
- **Выбор задач**: одиночный, множественный, выбор всех
- **Массовые операции**: удаление, изменение статуса, перемещение
- **Клавиатурные сокращения**: Ctrl+A, Escape, Ctrl+клик
- **Визуальные индикаторы**: выделение выбранных задач

### Использование
1. **Выбор задач**: клик по чекбоксу или Ctrl+клик
2. **Выбор всех**: Ctrl+A (или Cmd+A на Mac)
3. **Массовые операции**: использование панели управления
4. **Отмена выбора**: Escape или кнопка "✕"

Подробная документация: [BULK_ACTIONS.md](./BULK_ACTIONS.md)

## Следующие шаги

1. **Drag & Drop** - react-beautiful-dnd или @dnd-kit/core
2. **Аутентификация** - Firebase Auth или JWT
3. **API интеграция** - REST API или GraphQL
4. **Тестирование** - Jest + React Testing Library
5. **PWA функциональность** - Service Workers
6. **Оптимизация** - React.memo, useMemo, useCallback
7. **Расширенная фильтрация** - фильтры по статусу, дате, тегам
8. **Экспорт данных** - экспорт в CSV, JSON, PDF 