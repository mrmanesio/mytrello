import React from 'react';
import styles from './styles/Header.module.scss';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, onAddClick }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>{title}</h1>
      <div className={styles.header__actions}>
        <button
          className={`${styles.header__button} ${styles['header__button--secondary']}`}
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
