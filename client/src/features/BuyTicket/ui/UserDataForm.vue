<template>
  <section class="buy-ticket-user-data" aria-labelledby="buy-ticket-user-data-title">
    <header class="buy-ticket-user-data__header">
      <h2 id="buy-ticket-user-data-title" class="buy-ticket-user-data__title">
        Ввод данных
      </h2>
      <p class="buy-ticket-user-data__subtitle">
        Заполните контактные данные для оформления билета.
      </p>
    </header>

    <form class="buy-ticket-user-data__form" autocomplete="off" @submit.prevent="handleSubmit">
      <fieldset class="buy-ticket-user-data__fieldset">
        <legend class="buy-ticket-user-data__legend">Контактная информация</legend>

        <label class="buy-ticket-user-data__field" for="buy-ticket-user-name">
          <span class="buy-ticket-user-data__label">ФИО</span>
          <input
            id="buy-ticket-user-name"
            v-model="name"
            type="text"
            class="buy-ticket-user-data__input"
            placeholder="Иванов Иван Иванович"
            autocomplete="name"
            required
            minlength="3"
            pattern=".*\S.*"
          />
        </label>

        <label class="buy-ticket-user-data__field" for="buy-ticket-user-phone">
          <span class="buy-ticket-user-data__label">Телефон</span>
          <input
            id="buy-ticket-user-phone"
            v-model="phone"
            type="tel"
            class="buy-ticket-user-data__input"
            placeholder="+79991234567"
            autocomplete="tel"
            required
            pattern="\+?\d{10,15}"
          />
        </label>

        <label class="buy-ticket-user-data__field" for="buy-ticket-user-email">
          <span class="buy-ticket-user-data__label">Email</span>
          <input
            id="buy-ticket-user-email"
            v-model="email"
            type="email"
            class="buy-ticket-user-data__input"
            placeholder="email@example.com"
            autocomplete="email"
            required
          />
        </label>
      </fieldset>

      <footer class="buy-ticket-user-data__actions">
        <button
          type="button"
          class="buy-ticket-user-data__button buy-ticket-user-data__button--back"
          @click="emit('back')"
        >
          Назад
        </button>
        <button
          type="submit"
          class="buy-ticket-user-data__button buy-ticket-user-data__button--next"
        >
          К оплате
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface TicketUserData {
  name: string;
  phone: string;
  email: string;
}

const props = defineProps<{
  initialEmail: string;
  initialData: TicketUserData | null;
}>();

const emit = defineEmits<{
  (event: 'submit', data: TicketUserData): void;
  (event: 'back'): void;
}>();

const name = ref('');
const phone = ref('');
const email = ref(props.initialEmail);

watch(
  () => props.initialData,
  (nextData) => {
    if (nextData) {
      name.value = nextData.name;
      phone.value = nextData.phone;
      email.value = nextData.email;
      return;
    }

    name.value = '';
    phone.value = '';
    email.value = props.initialEmail;
  },
  { immediate: true },
);

watch(() => props.initialEmail, (nextEmail) => {
  if (!props.initialData) {
    email.value = nextEmail;
  }
});

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    phone: phone.value,
    email: email.value,
  });
};
</script>

<style scoped lang="scss">
.buy-ticket-user-data {
  border-radius: 16px;
  background: #f8fbff;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
  padding: 1.25rem;

  &__header {
    margin-bottom: 1rem;
    text-align: center;
  }

  &__title {
    margin: 0;
    color: #0f172a;
    font-size: 1.4rem;
    font-weight: 700;
  }

  &__subtitle {
    margin: 0.45rem 0 0;
    color: #475569;
    font-size: 0.93rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__fieldset {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  &__legend {
    width: 100%;
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 600;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__label {
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 600;
  }

  &__input {
    border: 1px solid #93c5fd;
    border-radius: 10px;
    padding: 0.68rem 0.75rem;
    color: #0f172a;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
    }

    &--error {
      border-color: #ef4444;
    }
  }

  &__error {
    color: #b91c1c;
    font-size: 0.8rem;
  }

  &__actions {
    display: flex;
    gap: 0.6rem;
  }

  &__button {
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;

    &--back {
      background: #d7dee9;
      color: #0f172a;
    }

    &--next {
      margin-left: auto;
      background: #2563eb;
      color: #ffffff;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 560px) {
  .buy-ticket-user-data {
    &__actions {
      flex-direction: column;
    }
  }
}
</style>
