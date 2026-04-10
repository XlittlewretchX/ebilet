<template>
  <section
    ref="menuRootRef"
    class="user-menu"
    aria-label="Меню пользователя"
  >
    <button
      type="button"
      :class="[
        'user-menu__trigger',
        { 'user-menu__trigger--active': isMenuOpen },
      ]"
      aria-haspopup="true"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
    >
      <img
        :src="resolvedAvatarUrl"
        alt="Аватар пользователя"
        class="user-menu__avatar"
      />
      <span class="user-menu__name">{{ userName }}</span>
    </button>

    <section
      v-if="isMenuOpen"
      class="user-menu__dropdown"
      aria-label="Действия пользователя"
    >
      <nav class="user-menu__nav" aria-label="Навигация пользователя">
        <ul class="user-menu__list">
          <li class="user-menu__item">
            <button
              type="button"
              class="user-menu__menu-button"
              @click="handleProfileAction"
            >
              Мой профиль
            </button>
          </li>

          <li
            class="user-menu__item user-menu__item--divider"
            role="separator"
            aria-hidden="true"
          />

          <li class="user-menu__item">
            <button
              v-if="!isLogoutConfirmOpen"
              type="button"
              class="user-menu__menu-button"
              @click="requestLogoutConfirmation"
            >
              Выйти
            </button>

            <section v-else class="user-menu__logout-confirm" aria-live="polite">
              <p class="user-menu__logout-title">Выйти из аккаунта?</p>
              <div class="user-menu__logout-actions">
                <button
                  type="button"
                  class="user-menu__confirm-button"
                  @click="handleConfirmLogout"
                >
                  Да
                </button>
                <button
                  type="button"
                  class="user-menu__cancel-button"
                  @click="cancelLogout"
                >
                  Нет
                </button>
              </div>
            </section>
          </li>
        </ul>
      </nav>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';

const DEFAULT_AVATAR_URL = process.env.REACT_APP_DEFAULT_AVATAR_URL || '/img/default-avatar.svg';
const apiOrigin = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || '';

const router = useRouter();
const sessionStore = useSessionStore();
const { user } = storeToRefs(sessionStore);

const menuRootRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const isLogoutConfirmOpen = ref(false);

const userName = computed(() => user.value?.username?.trim() || 'Пользователь');
const resolvedAvatarUrl = computed(() => {
  const source = user.value?.avatarUrl?.trim();

  if (!source) {
    return DEFAULT_AVATAR_URL;
  }

  if (source.startsWith('/uploads')) {
    return apiOrigin ? `${apiOrigin}${source}` : source;
  }

  return source;
});

const closeMenu = () => {
  isMenuOpen.value = false;
  isLogoutConfirmOpen.value = false;
};

const toggleMenu = () => {
  if (isMenuOpen.value) {
    closeMenu();
    return;
  }

  isMenuOpen.value = true;
  isLogoutConfirmOpen.value = false;
};

const requestLogoutConfirmation = () => {
  isLogoutConfirmOpen.value = true;
};

const cancelLogout = () => {
  isLogoutConfirmOpen.value = false;
};

const handleProfileAction = async () => {
  closeMenu();
  await router.push({ name: RouteName.Profile });
};

const handleConfirmLogout = () => {
  sessionStore.logout();
  closeMenu();
  void router.push({ name: RouteName.Home });
};

const handleDocumentMouseDown = (event: MouseEvent) => {
  if (!isMenuOpen.value) {
    return;
  }

  if (!(event.target instanceof Node)) {
    return;
  }

  const clickedOutside = !(menuRootRef.value?.contains(event.target) ?? false);
  if (clickedOutside) {
    closeMenu();
  }
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !isMenuOpen.value) {
    return;
  }

  closeMenu();
};

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown);
  document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown);
  document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>

<style scoped lang="scss">
.user-menu {
  position: relative;
  display: flex;
  align-items: center;

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  &__trigger:hover,
  &__trigger--active {
    background-color: #f1f1f1;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border: 1px solid #dddddd;
    border-radius: 50%;
    background-color: #eeeeee;
    object-fit: cover;
  }

  &__name {
    max-width: 10rem;
    overflow: hidden;
    color: #333333;
    font-size: 1rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    z-index: 20;
    min-width: 180px;
    border: 1px solid #dddddd;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    padding: 0.5rem 0;
  }

  &__nav {
    display: block;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: block;
  }

  &__item--divider {
    height: 1px;
    margin: 0.25rem 0;
    background-color: #eeeeee;
  }

  &__menu-button {
    width: 100%;
    border: none;
    background-color: transparent;
    color: #333333;
    font-size: 1rem;
    text-align: left;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  &__menu-button:hover {
    background-color: #f1f1f1;
  }

  &__logout-confirm {
    padding: 0.75rem 1.25rem;
    text-align: center;
  }

  &__logout-title {
    margin: 0;
    color: #333333;
    font-size: 0.95rem;
  }

  &__logout-actions {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__confirm-button,
  &__cancel-button {
    flex: 1;
    border: none;
    border-radius: 4px;
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  &__confirm-button {
    background-color: #dc3545;
    color: #ffffff;
  }

  &__confirm-button:hover {
    background-color: #b52a37;
  }

  &__cancel-button {
    background-color: #f1f1f1;
    color: #333333;
  }

  &__cancel-button:hover {
    background-color: #e2e2e2;
  }
}

@media (max-width: 768px) {
  .user-menu {
    &__name {
      max-width: 7rem;
      font-size: 0.95rem;
    }

    &__dropdown {
      right: -0.25rem;
      min-width: 170px;
    }
  }
}
</style>
