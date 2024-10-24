// Diary DiaryReminder, DiaryModal 타입

export interface Diary {
  diary_id: string;
  user_id: string;
  title: string;
  contents: string;
  created_at: string;
}

export interface DiaryReminderProps {
  userId: string;
}

export interface DiaryModalProps {
  onClose: () => void;
  userId: string;
}
