import { useRef, useCallback } from 'react';

export interface DragItem {
  id: string;
  type: 'task' | 'column';
  columnId?: string;
}

export interface DropLocation {
  x: number;
  y: number;
  elementId?: string;
}

export const useDraggable = (
  id: string,
  type: 'task' | 'column',
  columnId?: string
) => {
  const ref = useRef<HTMLElement>(null);

  const dragRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        element.setAttribute('draggable', 'true');
        element.setAttribute('data-drag-id', id);
        element.setAttribute('data-drag-type', type);
        if (columnId) {
          element.setAttribute('data-drag-column-id', columnId);
        }
        ref.current = element;
      }
    },
    [id, type, columnId]
  );

  return dragRef;
};

export const useDropTarget = (
  onDrop: (item: DragItem, location: DropLocation) => void
) => {
  const ref = useRef<HTMLElement>(null);

  const dropRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        const handleDragOver = (e: DragEvent) => {
          e.preventDefault();
          e.dataTransfer!.dropEffect = 'move';
        };

        const handleDrop = (e: DragEvent) => {
          e.preventDefault();
          const dragType = e.dataTransfer!.getData('application/json');

          try {
            const dragData = JSON.parse(dragType);
            const dropLocation: DropLocation = {
              x: e.clientX,
              y: e.clientY,
              elementId: element.getAttribute('data-column-id') || undefined,
            };
            onDrop(dragData, dropLocation);
          } catch (error) {
            console.error('Error parsing drag data:', error);
          }
        };

        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);

        ref.current = element;

        return () => {
          element.removeEventListener('dragover', handleDragOver);
          element.removeEventListener('drop', handleDrop);
        };
      }
    },
    [onDrop]
  );

  return dropRef;
};

export const useDragMonitor = (
  onDragStart?: (item: DragItem) => void,
  onDragEnd?: (item: DragItem) => void
) => {
  const ref = useRef<HTMLElement>(null);

  const monitorRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        const handleDragStart = (e: DragEvent) => {
          const target = e.target as HTMLElement;
          const dragId = target.getAttribute('data-drag-id');
          const dragType = target.getAttribute('data-drag-type') as
            | 'task'
            | 'column';
          const columnId = target.getAttribute('data-drag-column-id');

          if (dragId && dragType) {
            const dragItem: DragItem = {
              id: dragId,
              type: dragType,
              columnId: columnId || undefined,
            };

            e.dataTransfer!.setData('text/plain', dragId);
            e.dataTransfer!.setData(
              'application/json',
              JSON.stringify(dragItem)
            );
            e.dataTransfer!.effectAllowed = 'move';

            onDragStart?.(dragItem);
          }
        };

        const handleDragEnd = (e: DragEvent) => {
          const target = e.target as HTMLElement;
          const dragId = target.getAttribute('data-drag-id');
          const dragType = target.getAttribute('data-drag-type') as
            | 'task'
            | 'column';
          const columnId = target.getAttribute('data-drag-column-id');

          if (dragId && dragType) {
            const dragItem: DragItem = {
              id: dragId,
              type: dragType,
              columnId: columnId || undefined,
            };

            onDragEnd?.(dragItem);
          }
        };

        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);

        ref.current = element;

        return () => {
          element.removeEventListener('dragstart', handleDragStart);
          element.removeEventListener('dragend', handleDragEnd);
        };
      }
    },
    [onDragStart, onDragEnd]
  );

  return monitorRef;
};
