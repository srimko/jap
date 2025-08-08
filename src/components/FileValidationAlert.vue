<template>
  <UAlert
    v-if="error"
    icon="i-heroicons-exclamation-triangle"
    color="red"
    variant="subtle"
    :title="error"
    :closable="true"
    @close="$emit('close')"
    class="mb-4"
  />
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>