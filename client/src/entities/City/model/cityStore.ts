import { defineStore } from 'pinia';
import { DEFAULT_CITY } from '../config/constants';

interface CityState {
  name: string;
}

export const useCityStore = defineStore('city', {
  state: (): CityState => ({
    name: DEFAULT_CITY,
  }),
  actions: {
    setCity(nextCity: string) {
      this.name = nextCity;
    },
  },
});
