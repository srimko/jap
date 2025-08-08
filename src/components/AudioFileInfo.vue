<template>
  <UCard v-if="fileInfo" class="mb-4">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-musical-note" class="text-green-500" />
        <span class="font-semibold">Fichier audio validé</span>
      </div>
    </template>
    
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium text-gray-600">Nom:</span>
        <p class="truncate">{{ fileInfo.name }}</p>
      </div>
      
      <div>
        <span class="font-medium text-gray-600">Type:</span>
        <p>{{ fileInfo.type.split('/')[1].toUpperCase() }}</p>
      </div>
      
      <div>
        <span class="font-medium text-gray-600">Taille:</span>
        <p>{{ getFileSizeFormatted(fileInfo.size) }}</p>
      </div>
      
      <div>
        <span class="font-medium text-gray-600">Durée:</span>
        <p>{{ getDurationFormatted(fileInfo.duration) }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  fileInfo: {
    type: Object,
    default: null
  },
  getFileSizeFormatted: {
    type: Function,
    required: true
  },
  getDurationFormatted: {
    type: Function,
    required: true
  }
})
</script>