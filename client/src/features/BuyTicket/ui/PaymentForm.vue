<template>
  <section class="buy-ticket-payment" aria-labelledby="buy-ticket-payment-title">
    <header class="buy-ticket-payment__header">
      <h2 id="buy-ticket-payment-title" class="buy-ticket-payment__title">
        Оплата
      </h2>
      <p class="buy-ticket-payment__subtitle">
        Проверьте сумму и введите данные карты.
      </p>
    </header>

    <form
      class="buy-ticket-payment__form"
      autocomplete="off"
      @submit.prevent="handleSubmit"
    >
      <section class="buy-ticket-payment__summary" aria-label="Сводка заказа">
        <h3 class="buy-ticket-payment__event-title">{{ props.eventTitle }}</h3>
        <p class="buy-ticket-payment__amount">К оплате: {{ props.amount }} ₽</p>
      </section>

      <fieldset class="buy-ticket-payment__fieldset">
        <legend class="buy-ticket-payment__legend">
          Данные банковской карты
        </legend>

        <label class="buy-ticket-payment__field" for="payment-card">
          <span class="buy-ticket-payment__label">Номер карты</span>
          <input
            id="payment-card"
            v-model="form.card"
            type="text"
            inputmode="numeric"
            autocomplete="cc-number"
            :class="[
              'buy-ticket-payment__input',
              { 'buy-ticket-payment__input--error': isFieldError('card') },
            ]"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
            @input="handleInput('card', $event)"
            @blur="touched.card = true"
          />
          <span v-if="isFieldError('card')" class="buy-ticket-payment__error">
            Введите 16 цифр номера карты.
          </span>
        </label>

        <div class="buy-ticket-payment__row">
          <label class="buy-ticket-payment__field" for="payment-expiry">
            <span class="buy-ticket-payment__label">Срок действия</span>
            <input
              id="payment-expiry"
              ref="dateInputRef"
              v-model="form.date"
              type="text"
              inputmode="numeric"
              autocomplete="cc-exp"
              :class="[
                'buy-ticket-payment__input',
                { 'buy-ticket-payment__input--error': isFieldError('date') },
              ]"
              placeholder="MM/YY"
              maxlength="5"
              @input="handleInput('date', $event)"
              @blur="touched.date = true"
            />
            <span v-if="isFieldError('date')" class="buy-ticket-payment__error">
              Укажите корректный месяц и год.
            </span>
          </label>

          <label class="buy-ticket-payment__field" for="payment-cvv">
            <span class="buy-ticket-payment__label">CVV</span>
            <input
              id="payment-cvv"
              ref="cvvInputRef"
              v-model="form.cvv"
              type="password"
              inputmode="numeric"
              autocomplete="cc-csc"
              :class="[
                'buy-ticket-payment__input',
                { 'buy-ticket-payment__input--error': isFieldError('cvv') },
              ]"
              placeholder="123"
              maxlength="3"
              @input="handleInput('cvv', $event)"
              @blur="touched.cvv = true"
            />
            <span v-if="isFieldError('cvv')" class="buy-ticket-payment__error">
              CVV должен содержать 3 цифры.
            </span>
          </label>
        </div>
      </fieldset>

      <p class="buy-ticket-payment__secure-note">
        Платёж проходит по защищённому каналу.
      </p>

      <footer class="buy-ticket-payment__actions">
        <button
          type="button"
          class="buy-ticket-payment__button buy-ticket-payment__button--back app-button app-button--secondary app-button--wide"
          @click="emit('back')"
        >
          Назад
        </button>
        <button
          type="submit"
          class="buy-ticket-payment__button buy-ticket-payment__button--submit app-button app-button--primary app-button--wide app-button--push-end"
          :disabled="!isValid || props.loading"
        >
          {{ props.loading ? 'Оплата...' : 'Оплатить' }}
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  eventTitle: string;
  amount: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: 'submit'): void;
  (event: 'back'): void;
}>();

const form = ref({
  card: '',
  date: '',
  cvv: '',
});

const dateInputRef = ref<HTMLInputElement | null>(null);
const cvvInputRef = ref<HTMLInputElement | null>(null);

const touched = ref({
  card: false,
  date: false,
  cvv: false,
});

const resolveIsDateValid = (rawDate: string) => {
  if (!/^\d{2}\/\d{2}$/.test(rawDate)) {
    return false;
  }

  const [month, shortYear] = rawDate.split('/').map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const fullYear = 2000 + shortYear;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    fullYear > currentYear ||
    (fullYear === currentYear && month >= currentMonth)
  );
};

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiryDate = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 4);

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

const validityByField = computed(() => ({
  card: form.value.card.replace(/\s/g, '').length === 16,
  date: resolveIsDateValid(form.value.date),
  cvv: /^\d{3}$/.test(form.value.cvv),
}));

const isValid = computed(() =>
  Object.values(validityByField.value).every(Boolean),
);

const isFieldError = (field: 'card' | 'date' | 'cvv') =>
  touched.value[field] && !validityByField.value[field];

const handleInput = (field: 'card' | 'date' | 'cvv', event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  let nextValue = rawValue;

  switch (field) {
    case 'card':
      nextValue = formatCardNumber(rawValue);
      break;
    case 'date':
      nextValue = formatExpiryDate(rawValue);
      break;
    case 'cvv':
      nextValue = rawValue.replace(/\D/g, '').slice(0, 3);
      break;
  }

  form.value[field] = nextValue;

  if (field === 'card' && nextValue.replace(/\s/g, '').length === 16) {
    dateInputRef.value?.focus();
  }

  if (field === 'date' && resolveIsDateValid(nextValue)) {
    cvvInputRef.value?.focus();
  }
};

const handleSubmit = () => {
  if (props.loading) return;
  emit('submit');
};
</script>

<style scoped lang="scss">
.buy-ticket-payment {
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
    gap: 0.85rem;
  }

  &__summary {
    border: 1px solid #dbeafe;
    border-radius: 12px;
    background: #ffffff;
    padding: 0.75rem;
    text-align: center;
  }

  &__event-title {
    margin: 0;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 700;
  }

  &__amount {
    margin: 0.35rem 0 0;
    color: #1d4ed8;
    font-size: 1rem;
    font-weight: 600;
  }

  &__fieldset {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__legend {
    width: 100%;
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 600;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
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

  &__secure-note {
    margin: 0;
    color: #475569;
    font-size: 0.85rem;
    text-align: center;
  }

  &__actions {
    display: flex;
    gap: 0.6rem;
  }

}

@media (max-width: 560px) {
  .buy-ticket-payment {
    &__row {
      grid-template-columns: 1fr;
      gap: 0.6rem;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
