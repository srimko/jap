<template>
  <div v-if="showIndicator" class="cache-indicator">
    <UAlert
      :icon="alertConfig.icon"
      :color="alertConfig.color"
      :variant="alertConfig.variant"
      :title="alertConfig.title"
      :description="alertConfig.description"
      :closable="false"
      class="mb-4"
    >
      <template v-if="cacheStats" #default>
        <div class="mt-2 text-sm">
          <div class="flex items-center gap-4">
            <span>📁 {{ cacheStats.totalCached }} fichiers en cache</span>
            <span>⚡ {{ cacheStats.cacheHits }} utilisations du cache</span>
            <span>💾 {{ formatCacheSize(cacheStats.cacheSize) }}</span>
          </div>
        </div>
      </template>
    </UAlert>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: value => ['found', 'processing', 'saving', 'none'].includes(value)
  },
  fileName: {
    type: String,
    default: ''
  },
  cacheStats: {
    type: Object,
    default: null
  },
  processingTime: {
    type: Number,
    default: 0
  }
})

const showIndicator = computed(() => props.status !== 'none')

const alertConfig = computed(() => {
  switch (props.status) {
    case 'found':
      return {
        icon: 'i-heroicons-bolt',
        color: 'green',
        variant: 'subtle',
        title: '⚡ Transcription trouvée en cache',
        description: `Le fichier "${props.fileName}" a déjà été traité. Chargement instantané !`
      }
    case 'processing':
      return {
        icon: 'i-heroicons-cpu-chip',
        color: 'blue',
        variant: 'subtle',
        title: '🔄 Nouveau fichier en traitement',
        description: `Transcription en cours via OpenAI API...`
      }
    case 'saving':
      return {
        icon: 'i-heroicons-archive-box',
        color: 'purple',
        variant: 'subtle',
        title: '💾 Sauvegarde en cache',
        description: `Transcription terminée en ${Math.round(props.processingTime / 1000)}s et sauvegardée pour utilisation future`
      }
    default:
      return {
        icon: 'i-heroicons-information-circle',
        color: 'gray',
        variant: 'subtle',
        title: 'Information',
        description: ''
      }
  }
})

const formatCacheSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>

<style scoped>
.cache-indicator {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>