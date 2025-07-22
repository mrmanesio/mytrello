import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../index';

describe('Header', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnSearchChange.mockClear();
  });

  it('renders title correctly', () => {
    render(<Header title="Test Board" />);
    expect(screen.getByText('Test Board')).toBeInTheDocument();
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
    expect(completedButton.className).toContain('header__filterButton_active');
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
    render(<Header title="Test Board" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByText('Все');
    expect(allButton.className).toContain('header__filterButton_active');
  });

  it('renders search input when onSearchChange is provided', () => {
    render(
      <Header
        title="Test Board"
        searchQuery="test query"
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('test query');
  });

  it('does not render search input when onSearchChange is not provided', () => {
    render(<Header title="Test Board" />);

    expect(
      screen.queryByPlaceholderText('Search tasks...')
    ).not.toBeInTheDocument();
  });

  it('calls onSearchChange when search input value changes', () => {
    render(
      <Header
        title="Test Board"
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'new search' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('new search');
  });

  it('uses empty string as default search query when not provided', () => {
    render(<Header title="Test Board" onSearchChange={mockOnSearchChange} />);

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toHaveValue('');
  });
});
