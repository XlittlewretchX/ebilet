<template>
  <main class="profile-page" aria-labelledby="profile-page-title">
    <section class="profile-page__container">
      <p v-if="!user" class="profile-page__state profile-page__state--error" role="alert">
        Пожалуйста, войдите в систему.
      </p>

      <p
        v-else-if="isTicketsLoading"
        class="profile-page__state profile-page__state--loading"
        aria-live="polite"
      >
        Загружаем данные профиля...
      </p>

      <p
        v-else-if="ticketsErrorMessage"
        class="profile-page__state profile-page__state--error"
        role="alert"
      >
        {{ ticketsErrorMessage }}
      </p>

      <article v-else class="profile-page__card">
        <header class="profile-page__header">
          <section class="profile-page__avatar-section" aria-label="Управление аватаром">
            <figure class="profile-page__avatar-wrap">
              <img
                :src="resolvedAvatarUrl"
                :alt="`Аватар пользователя ${user?.username || ''}`"
                class="profile-page__avatar"
              />
            </figure>

            <div class="profile-page__avatar-actions">
              <label class="profile-page__button profile-page__button--secondary">
                Загрузить
                <input
                  class="profile-page__avatar-input"
                  type="file"
                  accept="image/*"
                  :disabled="isAvatarUpdating"
                  @change="handleAvatarChange"
                />
              </label>

              <button
                v-if="user?.avatarUrl"
                type="button"
                class="profile-page__button profile-page__button--danger"
                :disabled="isAvatarUpdating"
                @click="handleAvatarReset"
              >
                Сбросить
              </button>
            </div>

            <p
              v-if="avatarErrorMessage"
              class="profile-page__feedback profile-page__feedback--error"
              role="alert"
            >
              {{ avatarErrorMessage }}
            </p>
          </section>

          <section class="profile-page__intro" aria-label="Профиль пользователя">
            <h1 id="profile-page-title" class="profile-page__title">Личный кабинет</h1>

            <p v-if="!isEditingUsername" class="profile-page__greeting">
              Привет, {{ user?.username }}!
            </p>

            <form
              v-else
              class="profile-page__username-form"
              @submit.prevent="saveUsername"
            >
              <label class="profile-page__visually-hidden" for="profile-username-input">
                Имя пользователя
              </label>
              <input
                id="profile-username-input"
                v-model="usernameDraft"
                class="profile-page__username-input"
                type="text"
                autocomplete="name"
                placeholder="Введите имя"
              />

              <div class="profile-page__username-actions">
                <button
                  type="submit"
                  class="profile-page__button profile-page__button--primary"
                  :disabled="isUsernameUpdating"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  class="profile-page__button profile-page__button--secondary"
                  :disabled="isUsernameUpdating"
                  @click="setUsernameEditing(false)"
                >
                  Отмена
                </button>
              </div>
            </form>

            <button
              v-if="!isEditingUsername"
              type="button"
              class="profile-page__button profile-page__button--secondary profile-page__edit-button"
              @click="setUsernameEditing(true)"
            >
              Изменить имя
            </button>

            <p
              v-if="usernameErrorMessage"
              class="profile-page__feedback profile-page__feedback--error"
              role="alert"
            >
              {{ usernameErrorMessage }}
            </p>
          </section>
        </header>

        <section class="profile-page__details" aria-label="Контактная информация">
          <h2 class="profile-page__subtitle">Контакты</h2>
          <dl class="profile-page__info-list">
            <div class="profile-page__info-item">
              <dt class="profile-page__info-label">Email</dt>
              <dd class="profile-page__info-value">{{ user?.email }}</dd>
            </div>
            <div class="profile-page__info-item">
              <dt class="profile-page__info-label">Город</dt>
              <dd class="profile-page__info-value">{{ user?.city }}</dd>
            </div>
          </dl>
        </section>

        <section class="profile-page__stats" aria-label="Статистика аккаунта">
          <h2 class="profile-page__subtitle">Статистика</h2>
          <ul class="profile-page__stats-list">
            <li class="profile-page__stats-item">
              <p class="profile-page__stats-value">{{ tickets.length }}</p>
              <p class="profile-page__stats-label">Куплено билетов</p>
            </li>
            <li class="profile-page__stats-item">
              <p class="profile-page__stats-value">{{ user?.favorites?.length || 0 }}</p>
              <p class="profile-page__stats-label">Избранное</p>
            </li>
          </ul>
        </section>

        <footer class="profile-page__footer">
          <nav class="profile-page__actions" aria-label="Быстрые действия">
            <ul class="profile-page__actions-list">
              <li class="profile-page__actions-item">
                <button
                  type="button"
                  class="profile-page__button profile-page__button--secondary"
                  @click="router.push({ name: RouteName.MyTickets, params: {} })"
                >
                  Мои билеты
                </button>
              </li>
              <li class="profile-page__actions-item">
                <button
                  type="button"
                  class="profile-page__button profile-page__button--secondary"
                  @click="router.push({ name: RouteName.MyTickets, params: {}, query: { tab: 'favorites' } })"
                >
                  Избранное
                </button>
              </li>
              <li class="profile-page__actions-item profile-page__actions-item--logout">
                <button
                  type="button"
                  class="profile-page__button profile-page__button--danger"
                  @click="isLogoutConfirmOpen = true"
                >
                  Выйти
                </button>

                <section
                  v-if="isLogoutConfirmOpen"
                  class="profile-page__logout-confirm"
                  aria-live="polite"
                >
                  <p class="profile-page__logout-text">Выйти из аккаунта?</p>
                  <div class="profile-page__logout-actions">
                    <button
                      type="button"
                      class="profile-page__button profile-page__button--danger"
                      @click="confirmLogout"
                    >
                      Выйти
                    </button>
                    <button
                      type="button"
                      class="profile-page__button profile-page__button--secondary"
                      @click="isLogoutConfirmOpen = false"
                    >
                      Отмена
                    </button>
                  </div>
                </section>
              </li>
            </ul>
          </nav>
        </footer>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import { useProfilePage } from '@/pages/ProfilePage/model/useProfilePage';
import { RouteName } from '@/shared/config/routeNames';

const router = useRouter();
const sessionStore = useSessionStore();

const {
  user,
  isTicketsLoading,
  ticketsErrorMessage,
  tickets,
  resolvedAvatarUrl,
  isUsernameUpdating,
  isAvatarUpdating,
  loadTickets,
  updateUsername,
  uploadAvatar,
  resetAvatar,
} = useProfilePage();

const isEditingUsername = ref(false);
const usernameDraft = ref('');
const usernameErrorMessage = ref('');
const avatarErrorMessage = ref('');
const isLogoutConfirmOpen = ref(false);

const setUsernameEditing = (nextState: boolean) => {
  usernameDraft.value = user.value?.username ?? '';
  usernameErrorMessage.value = '';
  isEditingUsername.value = nextState;
};

watch(
  () => user.value?.id,
  () => {
    setUsernameEditing(false);
    isLogoutConfirmOpen.value = false;
    avatarErrorMessage.value = '';
  },
  { immediate: true },
);

onMounted(() => {
  void loadTickets();
});

const saveUsername = async () => {
  usernameErrorMessage.value = '';

  const result = await updateUsername(usernameDraft.value);

  if (result.ok) {
    setUsernameEditing(false);
    return;
  }

  usernameErrorMessage.value =
    result.message || 'Не удалось обновить имя пользователя.';
};

const handleAvatarChange = async ({ target }: Event) => {
  avatarErrorMessage.value = '';
  const input = target as HTMLInputElement | null;
  const file = input?.files?.[0];

  if (input) {
    input.value = '';
  }

  if (!file) {
    return;
  }

  const result = await uploadAvatar(file);

  if (!result.ok) {
    avatarErrorMessage.value = result.message || 'Не удалось загрузить аватар.';
  }
};

const handleAvatarReset = async () => {
  avatarErrorMessage.value = '';

  const result = await resetAvatar();

  if (!result.ok) {
    avatarErrorMessage.value = result.message || 'Не удалось сбросить аватар.';
  }
};

const confirmLogout = async () => {
  sessionStore.logout();
  isLogoutConfirmOpen.value = false;

  await router.push({
    name: RouteName.Home,
    params: {},
  });
};
</script>

<style scoped lang="scss">
.profile-page {
  min-height: calc(100vh - 72px);
  padding: 1.5rem 1rem 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);

  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__state {
    margin: 0;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;

    &--loading {
      background: #eff6ff;
      color: #1d4ed8;
    }

    &--error {
      background: #fff1f1;
      color: #b91c1c;
    }
  }

  &__card {
    width: 100%;
    max-width: 740px;
    margin: 0 auto;
    border-radius: 16px;
    border: 1px solid #dbeafe;
    background: #ffffff;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__header {
    display: grid;
    grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
    gap: 1.25rem;
    align-items: start;
  }

  &__avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  &__avatar-wrap {
    margin: 0;
    width: 132px;
    height: 132px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 25%, #eaf1ff 0%, #cbdcff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
  }

  &__avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ffffff;
    background: #f1f5f9;
  }

  &__avatar-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  &__avatar-input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  &__intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  &__title {
    margin: 0;
    color: #0f172a;
    font-size: 2rem;
    line-height: 1.1;
    font-weight: 700;
  }

  &__greeting {
    margin: 0;
    color: #1d4ed8;
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__username-form {
    width: 100%;
    display: grid;
    gap: 0.625rem;
  }

  &__username-input {
    width: 100%;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 0.625rem 0.75rem;
    color: #0f172a;
    font-size: 1rem;
    background: #f8fbff;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  &__username-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &__username-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__details,
  &__stats,
  &__footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
  }

  &__subtitle {
    margin: 0 0 0.75rem;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 700;
  }

  &__info-list {
    display: grid;
    gap: 0.6rem;
    margin: 0;
  }

  &__info-item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    background: #f8fbff;
    border: 1px solid #e2e8f0;
  }

  &__info-label {
    color: #64748b;
    font-weight: 500;
  }

  &__info-value {
    margin: 0;
    color: #1e293b;
    font-weight: 600;
    text-align: right;
    overflow-wrap: anywhere;
  }

  &__stats-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  &__stats-item {
    border-radius: 12px;
    background: #f8fbff;
    border: 1px solid #dbeafe;
    padding: 0.75rem;
    text-align: center;
  }

  &__stats-value {
    margin: 0;
    color: #1d4ed8;
    font-size: 1.55rem;
    line-height: 1;
    font-weight: 700;
  }

  &__stats-label {
    margin: 0.45rem 0 0;
    color: #475569;
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__actions-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  &__actions-item {
    position: relative;
  }

  &__actions-item--logout {
    margin-left: auto;
  }

  &__logout-confirm {
    position: absolute;
    right: 0;
    top: calc(100% + 0.45rem);
    min-width: 220px;
    z-index: 10;
    border: 1px solid #fecaca;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
    padding: 0.75rem;
    display: grid;
    gap: 0.625rem;
  }

  &__logout-text {
    margin: 0;
    color: #1e293b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  &__logout-actions {
    display: flex;
    gap: 0.5rem;
  }

  &__feedback {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 500;

    &--error {
      color: #b91c1c;
    }
  }

  &__button {
    border: none;
    border-radius: 10px;
    padding: 0.55rem 0.85rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;
  }

  &__button:hover {
    transform: translateY(-1px);
  }

  &__button:disabled {
    cursor: default;
    opacity: 0.65;
    transform: none;
  }

  &__button--primary {
    color: #ffffff;
    background: #2563eb;
  }

  &__button--primary:hover {
    background: #1d4ed8;
  }

  &__button--secondary {
    color: #1d4ed8;
    background: #e8efff;
  }

  &__button--secondary:hover {
    background: #dce6ff;
  }

  &__button--danger {
    color: #ffffff;
    background: #dc2626;
  }

  &__button--danger:hover {
    background: #b91c1c;
  }

  &__edit-button {
    align-self: flex-start;
  }

  &__visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

@media (max-width: 840px) {
  .profile-page {
    &__card {
      padding: 1.2rem;
    }

    &__header {
      grid-template-columns: 1fr;
    }

    &__avatar-section {
      align-items: flex-start;
    }

    &__avatar-actions {
      max-width: 220px;
    }

    &__title {
      font-size: 1.7rem;
    }
  }
}

@media (max-width: 600px) {
  .profile-page {
    padding: 1rem 0.75rem 1.5rem;

    &__card {
      border-radius: 12px;
      padding: 1rem;
      gap: 1rem;
    }

    &__title {
      font-size: 1.45rem;
    }

    &__greeting {
      font-size: 1.05rem;
    }

    &__info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }

    &__info-value {
      text-align: left;
    }

    &__stats-list {
      grid-template-columns: 1fr;
    }

    &__actions-list {
      flex-direction: column;
    }

    &__actions-item--logout {
      margin-left: 0;
    }

    &__logout-confirm {
      position: static;
      min-width: 0;
    }

    &__logout-actions {
      flex-direction: column;
    }
  }
}
</style>
