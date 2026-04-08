import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';

export const useSessionBootstrap = () => {
  const cityStore = useCityStore();
  const sessionStore = useSessionStore();
  const { user } = storeToRefs(sessionStore);

  const syncCityFromSession = () => {
    const normalizedCity = user.value?.city?.trim();

    if (normalizedCity) {
      cityStore.setCity(normalizedCity);
    }
  };

  onMounted(async () => {
    await sessionStore.checkSession();
    syncCityFromSession();
  });

  watch(user, () => {
    syncCityFromSession();
  });
};
