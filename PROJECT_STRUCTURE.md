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
│   │   └── index.ts          # Экспорт всех компонентов
│   ├── hooks/                # Пользовательские хуки
│   │   └── index.ts          # usePrevious, useClickOutside
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
└── README.md                 # Документация
```

## Компоненты

### Board
- **Назначение**: Основной компонент доски
- **Пропсы**: `board`, `onBoardUpdate`
- **Стили**: Модульные SCSS с BEM методологией
- **Особенности**: Отображает заголовок и контент доски

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
- **Пропсы**: `task`, `onTaskUpdate`, `onTaskDelete`
- **Стили**: Hover эффекты, адаптивный дизайн

### TaskForm
- **Назначение**: Форма создания/редактирования задач
- **Пропсы**: `task`, `onSubmit`, `onCancel`, `isEditing`
- **Стили**: Модальный дизайн, валидация форм

## Типы данных

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
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

### Селекторы
- `selectColumns` - Получить отсортированные колонки
- `selectTasks` - Получить отсортированные задачи
- `selectTasksByColumn` - Получить задачи конкретной колонки
- `selectColumnById` - Получить колонку по ID
- `selectTaskById` - Получить задачу по ID

### Использование в компонентах

```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectColumns, addColumn } from '../store/slices/boardSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);

  const handleAddColumn = () => {
    dispatch(addColumn({
      title: 'Новая колонка',
      boardId: 'board_1'
    }));
  };

  return (
    // JSX компонента
  );
};
```

## Следующие шаги

1. **Drag & Drop** - react-beautiful-dnd или @dnd-kit/core
2. **Аутентификация** - Firebase Auth или JWT
3. **API интеграция** - REST API или GraphQL
4. **Тестирование** - Jest + React Testing Library
5. **PWA функциональность** - Service Workers
6. **Оптимизация** - React.memo, useMemo, useCallback 