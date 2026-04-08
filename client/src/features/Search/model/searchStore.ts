import { defineStore } from 'pinia';

interface SearchState {
  query: string;
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    query: '',
  }),
  actions: {
    setQuery(nextQuery: string) {
      this.query = nextQuery;
    },
    clearQuery() {
      this.query = '';
    },
  },
});
