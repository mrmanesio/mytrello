import React from 'react';
import styles from './styles/Header.module.scss';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({
  title,
  currentFilter = 'all',
  onFilterChange,
}) => {
  const filterOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'incomplete', label: 'Incomplete' },
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
      </div>
    </header>
  );
};

export default Header;
