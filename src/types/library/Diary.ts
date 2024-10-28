// Diary DiaryReminder, DiaryModal, SearchBar, DateDropdown, DiaryList 타입

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  contents: string;
  created_at: string;
  date: string;
}

export interface DiaryReminderProps {
  userId: string;
  selectedYear: number;
}

export interface DiaryModalProps {
  onClose: () => void;
  userId: string;
  selectedYear: number;
}

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface DateDropdownProps {
  month: number;
  day: number;
  setMonth: (month: number) => void;
  setDay: (day: number) => void;
}

export interface DiaryListProps {
  diaries: Diary[];
  loading: boolean;
  userId: string;
}
