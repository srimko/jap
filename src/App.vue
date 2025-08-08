<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
const items = ref([
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Transcriptions',
    to: '/transcriptions',
  },
  {
    label: 'SM2',
    to: '/sm2',
  },
  {
    label: 'About',
    to: '/about',
  },
])
</script>

<template>
  <UApp>
    <UNavigationMenu :items="items" class="w-full justify-center" />
    <RouterView />
  </UApp>
</template>

<style scoped></style>
