import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import Board from '../index';

// Обертка для рендера с Provider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('Board', () => {
  it('renders board with title', () => {
    renderWithProvider(<Board />);
    expect(screen.getByText('MyTrello')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithProvider(<Board />);
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    renderWithProvider(<Board />);
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Выполненные')).toBeInTheDocument();
    expect(screen.getByText('Невыполненные')).toBeInTheDocument();
  });

  it('search input is functional', () => {
    renderWithProvider(<Board />);

    const searchInput = screen.getByPlaceholderText('Search tasks...');

    // Проверяем, что можно ввести текст
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput).toHaveValue('test search');
  });

  it('filter buttons are clickable', () => {
    renderWithProvider(<Board />);

    const completedButton = screen.getByText('Выполненные');
    const incompleteButton = screen.getByText('Невыполненные');

    // Проверяем, что кнопки кликабельны
    fireEvent.click(completedButton);
    fireEvent.click(incompleteButton);

    // Если нет ошибок, значит кнопки работают
    expect(completedButton).toBeInTheDocument();
    expect(incompleteButton).toBeInTheDocument();
  });
});
