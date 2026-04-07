import { computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

interface SearchState {
  value: string;
}

const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    value: '',
  }),
  actions: {
    setSearch(value: string) {
      this.value = value;
    },
    clearSearch() {
      this.value = '';
    },
  },
});

export const useSearchBarVue = () => {
  const searchStore = useSearchStore();
  const { value } = storeToRefs(searchStore);

  const search = computed({
    get: () => value.value,
    set: (nextValue: string) => {
      searchStore.setSearch(nextValue);
    },
  });

  const clearSearch = () => {
    searchStore.clearSearch();
  };

  return {
    search,
    clearSearch,
  };
};
