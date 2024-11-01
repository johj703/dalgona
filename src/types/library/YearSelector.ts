// YearSelector 타입

export interface YearSelectorProps {
  currentYear: number;
  selectedYear: number;
  onYearChange: (year: number) => void;
}
