import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Column from '../index';

const mockColumn = {
  id: 'column-1',
  title: 'Test Column',
  order: 0,
  boardId: 'board-1',
};

const mockTasks = [
  {
    id: 'task-1',
    title: 'Task 1',
    description: 'Description 1',
    columnId: 'column-1',
    order: 0,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'Task 2',
    description: 'Description 2',
    columnId: 'column-1',
    order: 1,
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProps = {
  column: mockColumn,
  tasks: mockTasks,
  onTaskUpdate: jest.fn(),
  onTaskDelete: jest.fn(),
  onTaskToggleCompleted: jest.fn(),
  onTaskMove: jest.fn(),
  onAddTask: jest.fn(),
  selectedTaskIds: [],
  onTaskSelect: jest.fn(),
  onSelectAllTasksInColumn: jest.fn(),
  allTasksInColumnSelected: false,
  selectedTasksInColumnCount: 0,
};

describe('Column', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders column title and task count', () => {
    render(<Column {...mockProps} />);

    expect(screen.getByText('Test Column')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // task count
  });

  it('renders select all button when tasks exist', () => {
    render(<Column {...mockProps} />);

    expect(screen.getByText('☐ Выбрать все')).toBeInTheDocument();
  });

  it('does not render select all button when no tasks', () => {
    render(<Column {...mockProps} tasks={[]} />);

    expect(screen.queryByText('☐ Выбрать все')).not.toBeInTheDocument();
  });

  it('calls onSelectAllTasksInColumn when select all button is clicked', () => {
    render(<Column {...mockProps} />);

    const selectAllButton = screen.getByText('☐ Выбрать все');
    fireEvent.click(selectAllButton);

    expect(mockProps.onSelectAllTasksInColumn).toHaveBeenCalledWith('column-1');
  });

  it('shows selected state when all tasks are selected', () => {
    render(<Column {...mockProps} allTasksInColumnSelected={true} />);

    expect(screen.getByText('✓ Выбрать все')).toBeInTheDocument();
  });

  it('shows selected count when some tasks are selected', () => {
    render(<Column {...mockProps} selectedTasksInColumnCount={1} />);

    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('renders add task button when onAddTask is provided', () => {
    render(<Column {...mockProps} />);

    expect(screen.getByText('+ Добавить задачу')).toBeInTheDocument();
  });

  it('does not render add task button when onAddTask is not provided', () => {
    const propsWithoutAddTask = { ...mockProps };
    delete propsWithoutAddTask.onAddTask;

    render(<Column {...propsWithoutAddTask} />);

    expect(screen.queryByText('+ Добавить задачу')).not.toBeInTheDocument();
  });
});
