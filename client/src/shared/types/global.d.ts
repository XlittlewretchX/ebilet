declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@/features/FilterPanel/filterPanelSlice' {
  export interface FilterState {
    category: string;
    subcategory: string;
    dateRange: { start: string; end: string };
    priceRange: { min: number; max: number };
    onlyMyCity: boolean;
  }

  export const setFilters: (payload: FilterState) => { type: string; payload: FilterState };
  export const resetFilters: () => { type: string };
  const reducer: (state: FilterState | undefined, action: unknown) => FilterState;
  export default reducer;
}

declare module '@/widgets/EventList/ui/EventList' {
  import type { ComponentType } from 'react';
  const EventList: ComponentType<Record<string, unknown>>;
  export default EventList;
}
