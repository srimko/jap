<template>
  <UCard class="mb-4">
    <template #header>
      <p>{{ item.hiragana }}</p>
      <p>{{ item.translation }}</p>
    </template>
    <ul class="flex gap-2">
      <li 
        v-for="(part, index) in item.parts" 
        :key="index"
        @mouseenter="$emit('showRomaji', part)" 
        @mouseleave="$emit('hideRomaji')"
        class="mb-4"
      >
        <span class="border rounded-2xl px-1 py-2 m-0.5">{{ part.kanji }}</span>
      </li>
    </ul>
  </UCard>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['showRomaji', 'hideRomaji'])
</script>