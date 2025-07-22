import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../index';
import { TaskFilterType } from '../../../types';

describe('Header', () => {
  const mockOnMenuClick = jest.fn();
  const mockOnAddClick = jest.fn();
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnMenuClick.mockClear();
    mockOnAddClick.mockClear();
    mockOnFilterChange.mockClear();
  });

  it('renders title correctly', () => {
    render(<Header title="Test Board" />);
    expect(screen.getByText('Test Board')).toBeInTheDocument();
  });

  it('renders menu and add buttons when callbacks are provided', () => {
    render(
      <Header
        title="Test Board"
        onMenuClick={mockOnMenuClick}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByText('Меню')).toBeInTheDocument();
    expect(screen.getByText('Добавить')).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', () => {
    render(
      <Header title="Test Board" onMenuClick={mockOnMenuClick} />
    );

    fireEvent.click(screen.getByText('Меню'));
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('calls onAddClick when add button is clicked', () => {
    render(
      <Header title="Test Board" onAddClick={mockOnAddClick} />
    );

    fireEvent.click(screen.getByText('Добавить'));
    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders filter buttons when onFilterChange is provided', () => {
    render(
      <Header
        title="Test Board"
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Выполненные')).toBeInTheDocument();
    expect(screen.getByText('Невыполненные')).toBeInTheDocument();
  });

  it('does not render filter buttons when onFilterChange is not provided', () => {
    render(<Header title="Test Board" currentFilter="all" />);

    expect(screen.queryByText('Все')).not.toBeInTheDocument();
    expect(screen.queryByText('Выполненные')).not.toBeInTheDocument();
    expect(screen.queryByText('Невыполненные')).not.toBeInTheDocument();
  });

  it('highlights the active filter button', () => {
    render(
      <Header
        title="Test Board"
        currentFilter="completed"
        onFilterChange={mockOnFilterChange}
      />
    );

    const completedButton = screen.getByText('Выполненные');
    expect(completedButton).toHaveClass('header__filterButton_active');
  });

  it('calls onFilterChange with correct filter type when filter button is clicked', () => {
    render(
      <Header
        title="Test Board"
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText('Выполненные'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');

    fireEvent.click(screen.getByText('Невыполненные'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('incomplete');

    fireEvent.click(screen.getByText('Все'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });

  it('uses default filter value when currentFilter is not provided', () => {
    render(
      <Header
        title="Test Board"
        onFilterChange={mockOnFilterChange}
      />
    );

    const allButton = screen.getByText('Все');
    expect(allButton).toHaveClass('header__filterButton_active');
  });
}); 