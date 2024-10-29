export type SortedDiaries = {
  id: string;
  created_at: string;
  title: string;
  contents: string;
  draw: string;
  date: string;
  emotion: string;
  user_id: string;
};

export type HeaderProps = {
  currentDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
};

export type Dates = {
  rangeList: SortedDiaries[] | undefined;
};

export type CellsProps = {
  currentDate: Date;
  selectedDate: Date;
  onDateClick: (arg0: Date) => void;
  filterDiaries: SortedDiaries[];
};
