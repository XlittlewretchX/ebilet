<template>
  <div class="app">
    <Header />
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from '@/widgets/Header/Header.vue';
</script>

<style>

</style>
