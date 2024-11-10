// Diary DiaryReminder, DiaryModal, SearchBar, DateDropdown, DiaryList 타입

import { Dispatch, SetStateAction } from "react";

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  contents: string;
  created_at: string;
  date: string;
  emotion: string;
  draw: string;
}

export interface DiaryReminderProps {
  userId: string;
  selectedYear: number;
}

export interface DiaryModalProps {
  onClose: () => void;
  userId: string;
  selectedYear: number;
  setSelectedDiary: Dispatch<SetStateAction<Diary>>;
}

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface DateDropdownProps {
  year: number;
  month: number;
  day: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDay: (day: number) => void;
}

export interface DiaryListProps {
  diaries: Diary[];
  loading: boolean;
  userId: string;
  sort: "newest" | "oldest";
  onSelectDiary: (diary: Diary) => void;
}

export interface DiaryContentProps {
  userId: string;
  year: number;
  month: number;
}

export interface MyArtworkProps {
  userId: string;
}

export interface MonthlyArtworkProps {
  userId: string;
}

export interface MemoryCollectionProps {
  userId: string;
}
