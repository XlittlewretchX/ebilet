<template>
  <main class="buy-ticket-page" aria-labelledby="buy-ticket-page-title">
    <section class="buy-ticket-page__container">
      <header class="buy-ticket-page__header">
        <h1 id="buy-ticket-page-title" class="buy-ticket-page__title">
          Покупка билетов
        </h1>
        <p v-if="event?.title" class="buy-ticket-page__subtitle">{{ event?.title }}</p>
      </header>

      <p v-if="isEventLoading" class="buy-ticket-page__state buy-ticket-page__state--loading">
        Загружаем данные события...
      </p>

      <p
        v-else-if="eventError || !event"
        class="buy-ticket-page__state buy-ticket-page__state--error"
        role="alert"
      >
        {{ eventError || 'Событие не найдено.' }}
      </p>

      <section v-else class="buy-ticket-page__content" :aria-busy="isSubmitting">
        <ol class="buy-ticket-page__progress" aria-label="Этапы покупки">
          <li
            v-for="(label, index) in progressLabels"
            :key="label"
            :class="[
              'buy-ticket-page__progress-item',
              {
                'buy-ticket-page__progress-item--active': index === currentStepIndex,
                'buy-ticket-page__progress-item--done': currentStepIndex > index,
              },
            ]"
          >
            {{ label }}
          </li>
        </ol>

        <p
          v-if="feedbackMessage"
          class="buy-ticket-page__feedback buy-ticket-page__feedback--error"
          role="alert"
        >
          {{ feedbackMessage }}
        </p>

        <seat-picker
          v-if="currentStep === 'picker'"
          :event-id="eventId"
          :seating-type="event?.seatingType || 'none'"
          :initial-count="purchaseForm.count"
          :initial-seats="purchaseForm.seat"
          @submit="submitSelection"
        />

        <user-data-form
          v-else-if="currentStep === 'user-data'"
          :initial-data="purchaseForm.userData"
          @submit="submitUserData"
          @back="goToStep('picker')"
        />

        <payment-form
          v-else-if="currentStep === 'payment'"
          :event-title="event?.title || ''"
          :amount="paymentAmount"
          :loading="isSubmitting"
          @submit="submitPayment"
          @back="goToStep('user-data')"
        />

        <success-step
          v-else
          :event-title="event?.title || ''"
          :places="selectedPlaces"
          :count="ticketCount"
          @go-to-tickets="router.push({ name: RouteName.MyTickets })"
          @go-home="router.push({ name: RouteName.Home })"
        />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import SeatPicker from '@/features/BuyTicket/ui/SeatPicker.vue';
import UserDataForm from '@/features/BuyTicket/ui/UserDataForm.vue';
import PaymentForm from '@/features/BuyTicket/ui/PaymentForm.vue';
import SuccessStep from '@/features/BuyTicket/ui/SuccessStep.vue';
import { useBuyTicketPage } from '@/pages/BuyTicketPage/model/useBuyTicketPage';
import type {
  BuyTicketStep,
  SeatSelection,
  TicketUserData,
} from '@/pages/BuyTicketPage/model/types';
import { RouteName } from '@/shared/config/routeNames';

const props = defineProps<{
  eventId: number;
}>();
const eventId = toRef(props, 'eventId');

const router = useRouter();
const sessionStore = useSessionStore();
const stepOrder: BuyTicketStep[] = ['picker', 'user-data', 'payment', 'success'];

const {
  event,
  isEventLoading,
  eventError,
  isSubmitting,
  purchaseForm,
  submitPayment: requestPayment,
} = useBuyTicketPage(eventId);

const currentStep = ref<BuyTicketStep>('picker');
const feedbackMessage = ref('');

const goToStep = (step: BuyTicketStep) => {
  feedbackMessage.value = '';
  currentStep.value = step;
};

watch(eventId, () => {
  goToStep('picker');
});

const submitSelection = (selection: SeatSelection) => {
  purchaseForm.value.count = selection.count;
  purchaseForm.value.seat = selection.seats ? [...selection.seats] : null;

  if (!purchaseForm.value.userData) {
    purchaseForm.value.userData = {
      name: '',
      phone: '',
      email: sessionStore.user?.email ?? '',
    };
  }

  goToStep('user-data');
};

const submitUserData = (userData: TicketUserData) => {
  purchaseForm.value.userData = userData;
  goToStep('payment');
};

const submitPayment = async () => {
  const result = await requestPayment();

  if (!result.ok) {
    feedbackMessage.value = result.message;
    return;
  }

  goToStep('success');
};

const ticketCount = computed(() => {
  const currentEvent = event.value;

  if (!currentEvent) {
    return 1;
  }

  if ((currentEvent.seatingType || 'none') === 'none') {
    return purchaseForm.value.count;
  }

  return purchaseForm.value.seat?.length || 1;
});
const paymentAmount = computed(() => (event.value?.price || 0) * ticketCount.value);
const selectedPlaces = computed(() => {
  const currentEvent = event.value;

  if (!currentEvent || (currentEvent.seatingType || 'none') === 'none') {
    return undefined;
  }

  return purchaseForm.value.seat;
});
const currentStepIndex = computed(() => stepOrder.indexOf(currentStep.value));
const progressLabels = computed(() => [
  (event.value?.seatingType || 'none') === 'none' ? 'Количество' : 'Места',
  'Данные',
  'Оплата',
  'Готово',
]);
</script>

<style scoped lang="scss">
.buy-ticket-page {
  min-height: calc(100vh - 72px);
  padding: 1.5rem 1rem 2rem;

  &__container {
    width: 100%;
    max-width: 61.25rem;
    margin: 0 auto;
  }

  &__header {
    margin-bottom: 1rem;
    text-align: center;
  }

  &__title {
    margin: 0;
    color: #0f172a;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.15;
  }

  &__subtitle {
    margin: 0.45rem 0 0;
    color: #475569;
    font-size: 1rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__progress {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
  }

  &__progress-item {
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    background: #ffffff;
    color: #475569;
    font-size: 0.86rem;
    font-weight: 600;
    text-align: center;
    padding: 0.55rem 0.5rem;

    &--active {
      border-color: #1d4ed8;
      color: #1d4ed8;
      box-shadow: inset 0 0 0 1px #1d4ed8;
    }

    &--done {
      border-color: #22c55e;
      color: #166534;
      background: #f0fdf4;
    }
  }

  &__state {
    margin: 0;
    padding: 0.85rem;
    border-radius: 12px;
    font-size: 0.95rem;

    &--loading {
      color: #1d4ed8;
      background: #eff6ff;
    }

    &--error {
      color: #b91c1c;
      background: #fff1f2;
    }
  }

  &__feedback {
    margin: 0;
    padding: 0.75rem;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 600;
    text-align: center;

    &--success {
      color: #166534;
      background: #f0fdf4;
    }

    &--error {
      color: #b91c1c;
      background: #fff1f2;
    }
  }
}

@media (max-width: 760px) {
  .buy-ticket-page {
    padding: 1rem 0.75rem 1.5rem;

    &__title {
      font-size: 1.65rem;
    }
  }
}

@media (max-width: 480px) {
  .buy-ticket-page {
    padding: 0.85rem 0.5rem 1.25rem;

    &__title {
      font-size: 1.45rem;
    }

    &__progress {
      grid-template-columns: 1fr;
    }
  }
}
</style>
