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

export type CalendarCellsProps = {
  currentDate: Date;
  onDateClick: (arg0: Date) => void;
  filterDiaries: SortedDiaries[];
};

export type CalendarModalProps = {
  clickModal: () => void;
  handleSearchDiaries: (startDate: string, endDate: string) => void;
  calenderInput: (startDate: string, endDate: string) => void;
  currentDate: Date;
};