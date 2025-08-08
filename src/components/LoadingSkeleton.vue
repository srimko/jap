<template>
  <div class="gap-4">
    <USkeleton class="h-3 w-[250px] mb-4" />
    <div class="grid gap-2">
      <USkeleton v-for="n in lines" :key="n" class="h-2 w-4xl" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  lines: {
    type: Number,
    default: 4
  }
})
</script>