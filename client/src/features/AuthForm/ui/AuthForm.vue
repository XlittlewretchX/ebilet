<template>
  <section class="auth-form" aria-labelledby="auth-form-title">
    <header class="auth-form__header">
      <h1 id="auth-form-title" class="auth-form__title">
        {{ titleText }}
      </h1>
      <p class="auth-form__description">
        {{ descriptionText }}
      </p>
    </header>

    <nav class="auth-form__mode-switch" aria-label="Переключение режима формы">
      <button
        v-for="modeOption in authModeOptions"
        :key="modeOption.value"
        type="button"
        :class="[
          'auth-form__mode-button',
          { 'auth-form__mode-button--active': mode === modeOption.value },
        ]"
        :aria-pressed="mode === modeOption.value"
        @click="toggleMode(modeOption.value)"
      >
        {{ modeOption.label }}
      </button>
    </nav>

    <form class="auth-form__form" novalidate @submit.prevent="submit">
      <fieldset class="auth-form__fieldset" :disabled="isSubmitting">
        <legend class="auth-form__legend">Данные пользователя</legend>

        <label class="auth-form__label" for="auth-form-username">Имя пользователя</label>
        <input
          id="auth-form-username"
          v-model.trim="formState.username"
          class="auth-form__input"
          type="text"
          name="username"
          autocomplete="username"
          minlength="3"
          required
        />

        <template v-if="mode !== 'login'">
          <label class="auth-form__label" for="auth-form-email">Email</label>
          <input
            id="auth-form-email"
            v-model.trim="formState.email"
            class="auth-form__input"
            type="email"
            name="email"
            autocomplete="email"
            required
          />
        </template>

        <label class="auth-form__label" for="auth-form-password">Пароль</label>
        <input
          id="auth-form-password"
          v-model.trim="formState.password"
          class="auth-form__input"
          type="password"
          name="password"
          autocomplete="current-password"
          minlength="6"
          required
        />

        <template v-if="mode !== 'login'">
          <label class="auth-form__label" for="auth-form-confirm-password">
            Подтвердите пароль
          </label>
          <input
            id="auth-form-confirm-password"
            v-model.trim="formState.confirmPassword"
            class="auth-form__input"
            type="password"
            name="confirm-password"
            autocomplete="new-password"
            minlength="6"
            required
          />
        </template>
      </fieldset>

      <p v-if="errorText" class="auth-form__feedback auth-form__feedback--error" role="alert">
        {{ errorText }}
      </p>

      <footer class="auth-form__footer">
        <button type="submit" class="auth-form__submit">
          {{ submitLabel }}
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DEFAULT_CITY, useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';

type AuthMode = 'login' | 'register';

const authModeOptions: { value: AuthMode; label: string }[] = [
  { value: 'login', label: 'Вход' },
  { value: 'register', label: 'Регистрация' },
];

const props = withDefaults(
  defineProps<{
    redirectName?: RouteName;
    redirectParams?: Record<string, string>;
    initialMode?: AuthMode;
  }>(),
  {
    redirectName: RouteName.MyTickets,
    redirectParams: () => ({}),
    initialMode: 'login',
  },
);

const router = useRouter();
const cityStore = useCityStore();
const sessionStore = useSessionStore();
const { isSubmitting } = storeToRefs(sessionStore);

const mode = ref<AuthMode>(props.initialMode);
const errorText = ref('');
const formState = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const loginMode = computed(() => mode.value === 'login');

const titleText = computed(() =>
  loginMode.value ? 'Вход в аккаунт' : 'Регистрация аккаунта',
);

const descriptionText = computed(() =>
  loginMode.value
    ? 'Войдите, чтобы управлять билетами и избранным.'
    : 'Создайте аккаунт, чтобы покупать билеты и сохранять события.',
);

const submitLabel = computed(() => {
  if (isSubmitting.value) {
    return loginMode.value ? 'Входим...' : 'Регистрируем...';
  }

  return loginMode.value ? 'Войти' : 'Зарегистрироваться';
});

const toggleMode = (nextMode: AuthMode) => {
  if (mode.value === nextMode) {
    return;
  }

  mode.value = nextMode;
  errorText.value = '';
  formState.value.password = '';
  formState.value.confirmPassword = '';
};

const submit = async () => {
  errorText.value = '';

  if (!loginMode.value && formState.value.password !== formState.value.confirmPassword) {
    errorText.value = 'Пароли не совпадают';
    return;
  }

  const result = loginMode.value
    ? await sessionStore.login({
        username: formState.value.username,
        password: formState.value.password,
      })
    : await sessionStore.register({
        username: formState.value.username,
        email: formState.value.email,
        password: formState.value.password,
        city: cityStore.name || DEFAULT_CITY,
      });

  if (!result.success) {
    errorText.value = result.errorMessage || 'Произошла ошибка';
    return;
  }

  await router.push({
    name: props.redirectName,
    params: props.redirectParams,
  });
};
</script>

<style scoped lang="scss">
.auth-form {
  width: min(100%, 460px);
  border: 1px solid #dbe7ff;
  border-radius: 18px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.12);
  padding: 1.5rem;

  &__header {
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0 0 0.5rem;
    color: #111827;
    font-size: 1.6rem;
    line-height: 1.2;
  }

  &__description {
    margin: 0;
    color: #4b5563;
    font-size: 0.95rem;
  }

  &__mode-switch {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  &__mode-button {
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    background-color: #eff6ff;
    color: #1d4ed8;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.55rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #dbeafe;
    }

    &--active {
      border-color: #1d4ed8;
      background-color: #1d4ed8;
      color: #ffffff;
    }
  }

  &__form {
    display: block;
  }

  &__fieldset {
    display: grid;
    gap: 0.65rem;
    border: none;
    margin: 0;
    padding: 0;
  }

  &__legend {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__label {
    color: #374151;
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.95rem;
    padding: 0.65rem 0.75rem;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #2563eb;
      outline: none;
    }
  }

  &__feedback {
    margin: 0.9rem 0 0;
    border-radius: 10px;
    font-size: 0.9rem;
    padding: 0.6rem 0.75rem;

    &--error {
      background-color: #fff1f1;
      color: #b91c1c;
    }
  }

  &__footer {
    margin-top: 1rem;
  }

  &__submit {
    width: 100%;
    border: none;
    border-radius: 12px;
    background-color: #2563eb;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #1d4ed8;
    }
  }
}

@media (max-width: 560px) {
  .auth-form {
    border-radius: 14px;
    padding: 1rem;

    &__title {
      font-size: 1.35rem;
    }

    &__description {
      font-size: 0.9rem;
    }
  }
}
</style>
