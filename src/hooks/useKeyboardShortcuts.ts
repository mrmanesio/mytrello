import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { selectAllTasks, deselectAllTasks } from '../store/slices/boardSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A или Cmd+A - выбрать все задачи
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        dispatch(selectAllTasks());
      }

      // Escape - отменить выбор всех задач
      if (event.key === 'Escape') {
        dispatch(deselectAllTasks());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
};
