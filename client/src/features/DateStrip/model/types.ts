export interface SelectedDateRange {
  start: string;
  end: string;
}

export type DateRange = [Date | null, Date | null]; 
export type DatePickerValue = Date | [Date, Date] | [Date, null];


