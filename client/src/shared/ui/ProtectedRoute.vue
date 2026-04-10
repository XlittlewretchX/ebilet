<template>
  <section
    v-if="guardLoading"
    class="protected-route"
    aria-live="polite"
    aria-busy="true"
  >
    <p class="protected-route__status">Проверяем доступ...</p>
  </section>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useProtectedRouteGuard } from './model/useProtectedRouteGuard';

const guardLoading = useProtectedRouteGuard();
</script>

<style scoped lang="scss">
.protected-route {
  min-height: calc(100vh - 72px);
  display: grid;
  place-items: center;
  padding: 1rem;

  &__status {
    margin: 0;
    color: #1d4ed8;
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
