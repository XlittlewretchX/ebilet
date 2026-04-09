<template>
  <article class="event-card">
    <figure v-if="resolvedImageUrl" class="event-card__image-wrap">
      <img
        :src="resolvedImageUrl"
        :alt="eventData.title"
        class="event-card__image"
        loading="lazy"
      />
    </figure>

    <section class="event-card__content">
      <header class="event-card__header">
        <h3 class="event-card__title">{{ eventData.title }}</h3>
      </header>

      <p class="event-card__description">{{ eventData.description }}</p>

      <ul class="event-card__details" aria-label="Детали события">
        <li class="event-card__detail event-card__detail--date">
          <time :datetime="eventData.date">{{ formattedDate }}</time>
        </li>
        <li class="event-card__detail event-card__detail--location">
          <address class="event-card__location">{{ eventData.location }}</address>
        </li>
        <li class="event-card__detail event-card__detail--price">
          <data :value="eventData.price">{{ eventData.price }} ₽</data>
        </li>
      </ul>

      <section v-if="$slots.meta" class="event-card__meta">
        <slot name="meta" />
      </section>

      <footer v-if="$slots.actions" class="event-card__actions">
        <slot name="actions" />
      </footer>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { Event } from '../model/types';
import {
  formatEventDate,
  parseEventDate,
  resolveEventImageUrl,
} from '@/entities/Event/config/utils';

const props = defineProps<{
  event: Event;
}>();

const eventData = toRef(props, 'event');

const parsedDate = computed(() => parseEventDate(eventData.value.date));
const resolvedImageUrl = computed(() =>
  resolveEventImageUrl(eventData.value.imageUrl),
);

const formattedDate = computed(() => {
  return formatEventDate(parsedDate.value, eventData.value.date);
});
</script>

<style scoped lang="scss">
.event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  &__image-wrap {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: #f8faff;
    margin: 0;

    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
      pointer-events: none;
      z-index: 1;
    }
  }

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover &__image {
    transform: scale(1.05);
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 1.5rem;
  }

  &__header {
    margin-bottom: 0.75rem;
  }

  &__title {
    margin: 0;
    color: #1a1a1a;
    font-size: 1.35rem;
    line-height: 1.4;
    font-weight: 700;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__description {
    margin: 0 0 1.25rem;
    color: #666666;
    font-size: 0.95rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__details {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'date price'
      'location price';
    gap: 0.75rem;
    align-items: start;
    margin: 0 0 1.25rem;
    padding: 0;
    list-style: none;
  }

  &__detail {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    background: #f8faff;
    color: #666666;
    font-size: 0.9rem;
    max-width: 100%;
    transition: background-color 0.2s ease;

    &:hover {
      background: #e3eaff;
    }

    &::before {
      content: '';
      width: 18px;
      height: 18px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0.8;
    }

    &--date::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z'/%3E%3C/svg%3E");
    }

    &--date {
      grid-area: date;
      justify-self: start;
    }

    &--location::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
    }

    &--location {
      grid-area: location;
      width: 100%;
      min-width: 0;
      justify-self: stretch;
    }

    &--price {
      grid-area: price;
      justify-self: end;
      align-self: end;
      margin-left: 0;
      min-width: 88px;
      padding: 0.28rem 0.62rem;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: #2563eb;
      background: #e3eaff;
      
      &::before {
        content: none;
        width: 0;
        height: 0;
        margin: 0;
      }

      &:hover {
        background: #d1e0ff;
      }
    }
  }

  &__location {
    margin: 0;
    font-style: normal;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    margin-bottom: 1rem;
  }

  &__actions {
    margin-top: auto;
  }
}

@media (max-width: 768px) {
  .event-card {
    border-radius: 12px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
    }

    &__image-wrap {
      height: 160px;
    }

    &__content {
      padding: 1rem;
    }

    &__title {
      font-size: 1.1rem;
      -webkit-line-clamp: 1;
    }
  }
}

@media (max-width: 480px) {
  .event-card {
    &__image-wrap {
      height: 140px;
    }

    &__content {
      padding: 0.75rem;
    }

    &__title {
      font-size: 1rem;
    }

    &__description {
      display: none;
    }

    &__details {
      gap: 0.35rem 0.5rem;
      margin-bottom: 0.75rem;
    }

    &__detail {
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;

      &::before {
        width: 14px;
        height: 14px;
      }

      &--price {
        min-width: 72px;
        padding: 0.2rem 0.45rem;
        font-size: 0.76rem;
      }
    }
  }
}
</style>
