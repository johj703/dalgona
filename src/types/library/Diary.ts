// Diary DiaryReminder, DiaryModal 타입

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
