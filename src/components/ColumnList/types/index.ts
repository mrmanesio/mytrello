import { Column } from '../../../types';

export interface ColumnListProps {
  columns: Column[];
  onColumnAdd?: () => void;
  onColumnUpdate?: (column: Column) => void;
  onColumnDelete?: (columnId: string) => void;
}
