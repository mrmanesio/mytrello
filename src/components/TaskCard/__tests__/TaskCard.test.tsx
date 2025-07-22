import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskCard from '../index';
import { Task } from '../../../types';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task Title',
  description: 'Test description',
  columnId: 'column-1',
  order: 0,
  completed: false,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

const mockProps = {
  task: mockTask,
  onTaskUpdate: jest.fn(),
  onTaskDelete: jest.fn(),
  onTaskToggleCompleted: jest.fn(),
  isSelected: false,
  onTaskSelect: jest.fn(),
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title correctly', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
  });

  it('renders task description when provided', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskCard {...mockProps} task={taskWithoutDescription} />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('shows completed state when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskCard {...mockProps} task={completedTask} />);
    
    const title = screen.getByText('Test Task Title');
    expect(title.closest('.taskCard')).toHaveClass('taskCard_completed');
  });

  it('shows selected state when task is selected', () => {
    render(<TaskCard {...mockProps} isSelected={true} />);
    
    const title = screen.getByText('Test Task Title');
    expect(title.closest('.taskCard')).toHaveClass('taskCard_selected');
  });

  it('highlights matching text when search query is provided', () => {
    render(<TaskCard {...mockProps} searchQuery="Task" />);
    
    // Проверяем, что текст подсвечен
    const highlightedText = screen.getByText('Task');
    expect(highlightedText.tagName).toBe('MARK');
    expect(highlightedText).toHaveClass('taskCard__highlight');
  });

  it('highlights matching text case insensitive', () => {
    render(<TaskCard {...mockProps} searchQuery="task" />);
    
    // Проверяем, что текст подсвечен несмотря на регистр
    const highlightedText = screen.getByText('Task');
    expect(highlightedText.tagName).toBe('MARK');
    expect(highlightedText).toHaveClass('taskCard__highlight');
  });

  it('does not highlight text when search query does not match', () => {
    render(<TaskCard {...mockProps} searchQuery="nonexistent" />);
    
    // Проверяем, что текст не подсвечен
    const title = screen.getByText('Test Task Title');
    expect(title.querySelector('mark')).not.toBeInTheDocument();
  });

  it('does not highlight text when search query is empty', () => {
    render(<TaskCard {...mockProps} searchQuery="" />);
    
    // Проверяем, что текст не подсвечен
    const title = screen.getByText('Test Task Title');
    expect(title.querySelector('mark')).not.toBeInTheDocument();
  });

  it('highlights partial matches', () => {
    render(<TaskCard {...mockProps} searchQuery="Test Task" />);
    
    // Проверяем, что подсвечен весь совпадающий текст
    const highlightedText = screen.getByText('Test Task');
    expect(highlightedText.tagName).toBe('MARK');
    expect(highlightedText).toHaveClass('taskCard__highlight');
  });

  it('renders checkbox when onTaskSelect is provided', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('does not render checkbox when onTaskSelect is not provided', () => {
    const { onTaskSelect, ...propsWithoutSelect } = mockProps;
    render(<TaskCard {...propsWithoutSelect} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('✏️')).toBeInTheDocument();
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });
}); 