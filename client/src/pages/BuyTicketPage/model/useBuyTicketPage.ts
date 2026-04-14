import { ref, watch, type Ref } from 'vue';
import type { Event } from '@/entities/Event';
import { authAPI, eventAPI } from '@/shared/api/api';
import type { PurchaseFormState, SeatingType } from './types';

export const useBuyTicketPage = (
  eventId: Ref<number>,
) => {
  const event = ref<(Event & { seatingType?: SeatingType }) | null>(null);
  const isEventLoading = ref(true);
  const eventError = ref('');
  const isSubmitting = ref(false);

  const purchaseForm = ref<PurchaseFormState>({
    count: 1,
    seat: null,
    userData: null,
  });

  const loadEvent = async () => {
    purchaseForm.value.count = 1;
    purchaseForm.value.seat = null;
    purchaseForm.value.userData = null;
    isSubmitting.value = false;
    isEventLoading.value = true;
    eventError.value = '';
    event.value = null;

    try {
      event.value = await eventAPI.getById(eventId.value);
    } catch {
      eventError.value = 'Не удалось загрузить событие.';
    } finally {
      isEventLoading.value = false;
    }
  };

  watch(
    eventId,
    () => {
      void loadEvent();
    },
    { immediate: true },
  );

  const submitPayment = async (): Promise<
    { ok: true } | { ok: false; message: string }
  > => {
    if (!event.value || !purchaseForm.value.userData || isSubmitting.value) {
      return {
        ok: false,
        message: '',
      };
    }

    isSubmitting.value = true;

    try {
      const seatingType = event.value.seatingType || 'none';
      const seatPayload: string[] | null =
        seatingType === 'none' ? null : (purchaseForm.value.seat ?? null);

      await authAPI.buyTicket({
        eventId: eventId.value,
        seat: seatPayload,
        ...purchaseForm.value.userData,
      });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        message: 'Ошибка при покупке билета.',
      };
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    event,
    isEventLoading,
    eventError,
    isSubmitting,
    purchaseForm,
    submitPayment,
  };
};
