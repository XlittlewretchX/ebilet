<template>
  <header class="header-widget">
    <div class="header-widget__container">
      <router-link
        :to="{ name: RouteName.Home, params: {} }"
        class="header-widget__logo"
        aria-label="Перейти на главную"
      >
        eBilet
      </router-link>

      <nav class="header-widget__nav" aria-label="Основная навигация">
        <ul class="header-widget__menu">
          <li class="header-widget__menu-item">
            <city-picker />
          </li>

          <template v-if="isAuthenticated">
            <li class="header-widget__menu-item">
              <router-link :to="{ name: RouteName.MyTickets, params: {} }" class="header-widget__link">
                Мои события
              </router-link>
            </li>
            <li class="header-widget__menu-item">
              <user-menu />
            </li>
          </template>

          <li v-else class="header-widget__menu-item">
            <button
              type="button"
              class="header-widget__login-button"
              :disabled="isAuthChecking"
              @click="handleLoginClick"
            >
              {{ isAuthChecking ? 'Проверка...' : 'Войти' }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import { CityPicker } from '@/features/CityPicker';
import { UserMenu } from '@/features/UserMenu';
import { RouteName } from '@/shared/config/routeNames';

const sessionStore = useSessionStore();
const { isChecking: isAuthChecking, isAuthenticated } = storeToRefs(sessionStore);

const router = useRouter();

const handleLoginClick = () => {
  void router.push({
    name: RouteName.Auth,
    params: {},
  });
};
</script>

<style scoped lang="scss">
.header-widget {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &__container {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0.875rem 1rem;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    color: #333333;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  &__logo:hover {
    color: #007bff;
  }

  &__nav {
    min-width: 0;
  }

  &__menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__menu-item {
    display: flex;
    align-items: center;
  }

  &__link {
    color: #666666;
    font-size: 1rem;
    text-decoration: none;
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  &__link:hover {
    color: #007bff;
  }

  &__login-button {
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: #ffffff;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  &__login-button:hover {
    background-color: #0056b3;
  }

  &__login-button:disabled {
    cursor: default;
    opacity: 0.7;
  }
}

@media (max-width: 960px) {
  .header-widget {
    &__nav {
      justify-self: end;
    }
  }
}

@media (max-width: 640px) {
  .header-widget {
    &__container {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    &__logo {
      justify-self: center;
    }

    &__nav {
      width: 100%;
    }

    &__menu {
      width: 100%;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    &__login-button {
      width: 100%;
    }
  }
}
</style>
