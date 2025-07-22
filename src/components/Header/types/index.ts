import { TaskFilterType } from '../../../types';

export interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onAddClick?: () => void;
  currentFilter?: TaskFilterType;
  onFilterChange?: (filter: TaskFilterType) => void;
}
