import { storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DEFAULT_CITY, useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';
import type { RouteName } from '@/shared/config/routeNames';

export type AuthMode = 'login' | 'register';

interface UseAuthFormOptions {
  initialMode: AuthMode;
  redirectName: RouteName;
  redirectParams: Record<string, string>;
}

export const useAuthForm = ({
  initialMode,
  redirectName,
  redirectParams,
}: UseAuthFormOptions) => {
  const router = useRouter();
  const cityStore = useCityStore();
  const sessionStore = useSessionStore();
  const { isSubmitting } = storeToRefs(sessionStore);

  const mode = ref<AuthMode>(initialMode);
  const errorText = ref('');

  const formState = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const submitLabel = computed(() => {
    if (isSubmitting.value) {
      return mode.value === 'login' ? 'Входим...' : 'Регистрируем...';
    }

    return mode.value === 'login' ? 'Войти' : 'Зарегистрироваться';
  });

  const clearError = () => {
    errorText.value = '';
  };

  const switchMode = (nextMode: AuthMode) => {
    if (mode.value === nextMode) {
      return;
    }

    mode.value = nextMode;
    clearError();
    formState.password = '';
    formState.confirmPassword = '';
  };

  const submit = async () => {
    clearError();

    if (mode.value !== 'login' && formState.password !== formState.confirmPassword) {
      errorText.value = 'Пароли не совпадают';
      return;
    }

    let requestError: string | null = null;

    if (mode.value === 'login') {
      requestError = await sessionStore.login({
        username: formState.username,
        password: formState.password,
      });
    } else {
      requestError = await sessionStore.register({
        username: formState.username,
        email: formState.email,
        password: formState.password,
        city: cityStore.name || DEFAULT_CITY,
      });
    }

    if (requestError) {
      errorText.value = requestError;
      return;
    }

    await router.push({
      name: redirectName,
      params: redirectParams,
    });
  };

  return {
    formState,
    mode,
    submitLabel,
    errorText,
    isSubmitting,
    switchMode,
    submit,
  };
};
