<template>
  <main class="auth-page" aria-labelledby="auth-page-title">
    <section class="auth-page__layout">
      <header class="auth-page__intro">
        <p class="auth-page__caption">eBilet</p>
        <h1 id="auth-page-title" class="auth-page__title">
          Личный кабинет зрителя
        </h1>
        <p class="auth-page__text">
          Вход и регистрация дают доступ к покупке билетов, избранному и вашим событиям.
        </p>
      </header>

      <section class="auth-page__form-wrap" aria-label="Форма входа и регистрации">
        <auth-form
          :key="formKey"
          :redirect-name="redirectName"
          :redirect-params="redirectParams"
          :initial-mode="initialMode"
        />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthForm } from '@/features/AuthForm';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const { isChecking } = storeToRefs(sessionStore);

const initialMode = computed(() =>
  route.query.mode === 'register' ? 'register' : 'login',
);

const redirectName = computed<RouteName>(() => {
  const queryName = route.query['redirect-name'];
  return queryName === RouteName.BuyTicket || queryName === RouteName.Profile
    ? queryName
    : RouteName.MyTickets;
});

const redirectParams = computed<Record<string, string>>(() => {
  const params: Record<string, string> = {};

  if (redirectName.value !== RouteName.BuyTicket) {
    return params;
  }

  const eventId = route.query['redirect-event-id'];

  if (typeof eventId === 'string' && eventId) {
    params.eventId = eventId;
  }

  return params;
});

const formKey = computed(
  () => `${initialMode.value}:${redirectName.value}:${redirectParams.value.eventId ?? ''}`,
);

watch(
  [() => sessionStore.isAuthenticated, isChecking],
  async ([authenticated, checking]) => {
    if (checking || !authenticated) {
      return;
    }

    await router.replace({
      name: redirectName.value,
      params: redirectParams.value,
    });
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.auth-page {
  min-height: calc(100vh - 72px);
  padding: 1.5rem 1rem 2rem;
  background: radial-gradient(circle at top left, #dbeafe 0%, #eff6ff 38%, #f8fbff 100%);

  &__layout {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 1.5rem;
  }

  &__intro {
    max-width: 480px;
  }

  &__caption {
    margin: 0 0 0.75rem;
    color: #1d4ed8;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0 0 0.75rem;
    color: #111827;
    font-size: 2.05rem;
    line-height: 1.15;
  }

  &__text {
    margin: 0;
    color: #4b5563;
    font-size: 1.05rem;
  }

  &__form-wrap {
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 980px) {
  .auth-page {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__intro {
      max-width: 100%;
    }

    &__form-wrap {
      justify-content: flex-start;
    }
  }
}

@media (max-width: 560px) {
  .auth-page {
    padding: 1rem 0.75rem 1.5rem;

    &__title {
      font-size: 1.55rem;
    }

    &__text {
      font-size: 0.95rem;
    }
  }
}
</style>
