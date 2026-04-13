import { ref, watch, type Ref } from 'vue';
import type { Event } from '@/entities/Event';
import { authAPI, eventAPI } from '@/shared/api/api';

export const useBuyTicketPage = (eventId: Ref<number>) => {
  const event = ref<(Event & { seatingType: 'none' | 'grid' | 'circle' }) | null>(
    null,
  );
  const isEventLoading = ref(true);
  const eventError = ref('');
  const isSubmitting = ref(false);

  const purchaseForm = ref({
    count: 1,
    seat: null as string[] | null,
    userData: null as { name: string; phone: string; email: string } | null,
  });

  const loadEvent = async () => {
    purchaseForm.value.count = 1;
    purchaseForm.value.seat = null;
    purchaseForm.value.userData = null;
    isSubmitting.value = false;
    isEventLoading.value = true;
    eventError.value = '';
    event.value = null;

    if (!Number.isFinite(eventId.value) || eventId.value <= 0) {
      eventError.value = 'Некорректный идентификатор события.';
      isEventLoading.value = false;
      return;
    }

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
      let seatPayload: string | string[] | null = purchaseForm.value.seat;

      if (event.value.seatingType === 'none') {
        seatPayload = Array.from(
          { length: purchaseForm.value.count },
          () => null,
        ) as unknown as string[];
      }

      const normalizedSeatPayload =
        Array.isArray(seatPayload) && seatPayload.length === 1
          ? seatPayload[0]
          : seatPayload;

      await authAPI.buyTicket({
        eventId: eventId.value,
        seat: normalizedSeatPayload,
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
