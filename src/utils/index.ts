export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date | string): string => {
  try {
    // Если передана строка, преобразуем в Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Проверяем, что дата валидна
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Неизвестная дата';
    }

    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Неизвестная дата';
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
