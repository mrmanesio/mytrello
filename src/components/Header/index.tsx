import React from 'react';
import styles from './styles/Header.module.scss';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuClick,
  onAddClick,
  currentFilter = 'all',
  onFilterChange,
}) => {
  const filterOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'completed', label: 'Выполненные' },
    { value: 'incomplete', label: 'Невыполненные' },
  ];

  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>{title}</h1>
      <div className={styles.header__actions}>
        {onFilterChange && (
          <div className={styles.header__filters}>
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`${styles.header__filterButton} ${
                  currentFilter === option.value
                    ? styles.header__filterButton_active
                    : ''
                }`}
                onClick={() => onFilterChange(option.value as any)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <button
          className={`${styles.header__button} ${
            styles['header__button--secondary']
          }`}
          onClick={onMenuClick}
        >
          Меню
        </button>
        <button className={styles.header__button} onClick={onAddClick}>
          Добавить
        </button>
      </div>
    </header>
  );
};

export default Header;
