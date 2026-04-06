export interface DateRangeValue {
  start: string;
  end: string;
}

export const createInitialDateRange = (): DateRangeValue => ({
  start: '',
  end: '',
});
