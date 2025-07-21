import React from 'react';
import styles from './styles/TaskForm.module.scss';
import { TaskFormProps } from './types';

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const [title, setTitle] = React.useState(task?.title || '');
  const [description, setDescription] = React.useState(task?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
    });
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <h3 className={styles.taskForm__title}>
        {isEditing ? 'Редактировать задачу' : 'Создать задачу'}
      </h3>

      <div className={styles.taskForm__field}>
        <label className={styles.taskForm__label} htmlFor="title">
          Название
        </label>
        <input
          id="title"
          type="text"
          className={styles.taskForm__input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Введите название задачи"
          required
        />
      </div>

      <div className={styles.taskForm__field}>
        <label className={styles.taskForm__label} htmlFor="description">
          Описание
        </label>
        <textarea
          id="description"
          className={styles.taskForm__textarea}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Введите описание задачи (необязательно)"
        />
      </div>

      <div className={styles.taskForm__actions}>
        <button
          type="button"
          className={`${styles.taskForm__button} ${styles['taskForm__button--secondary']}`}
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.taskForm__button} ${styles['taskForm__button--primary']}`}
        >
          {isEditing ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
