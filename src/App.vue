<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
const items = ref([
  {
    label: 'Home',
    to: '/',
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
