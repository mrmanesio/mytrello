import React from 'react';
import styles from './styles/ColumnList.module.scss';
import { ColumnListProps } from './types';

const ColumnList: React.FC<ColumnListProps> = ({
  columns,
  onColumnAdd,
  onColumnUpdate,
  onColumnDelete,
}) => {
  return (
    <div className={styles.columnList}>
      {columns.map(column => (
        <div key={column.id} className={styles.columnList__column}>
          <div className={styles.columnList__header}>
            <h3 className={styles.columnList__title}>{column.title}</h3>
          </div>
          <div className={styles.columnList__content}>
            {/* Здесь будут задачи */}
            <p>Задачи будут добавлены позже</p>
          </div>
        </div>
      ))}
      <div className={styles.columnList__addButton} onClick={onColumnAdd}>
        + Добавить колонку
      </div>
    </div>
  );
};

export default ColumnList;
