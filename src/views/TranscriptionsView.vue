<template>
  <UContainer>
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Historique des transcriptions</h2>
        
        <div class="flex gap-2">
          <UButton 
            @click="clearCache"
            color="orange"
            variant="outline"
            size="sm"
            label="Vider le cache"
            :disabled="cacheStats.totalCached === 0"
          />
          
          <UButton 
            @click="clearAllTranscriptions"
            color="red"
            variant="outline"
            size="sm"
            label="Vider l'historique"
            :disabled="transcriptions.length === 0"
          />
          
          <UButton 
            @click="exportData"
            color="green"
            variant="outline" 
            size="sm"
            label="Exporter"
            :disabled="transcriptions.length === 0"
          />
        </div>
      </div>

      <!-- Statistiques globales -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <UCard>
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">{{ statistics.total }}</p>
            <p class="text-sm text-gray-600">Total</p>
          </div>
        </UCard>
        
        <UCard>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ statistics.today }}</p>
            <p class="text-sm text-gray-600">Aujourd'hui</p>
          </div>
        </UCard>
        
        <UCard>
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">{{ Math.round(statistics.averageProcessingTime / 1000) }}s</p>
            <p class="text-sm text-gray-600">Temps moyen</p>
          </div>
        </UCard>
        
        <UCard>
          <div class="text-center">
            <p class="text-2xl font-bold text-orange-600">{{ statistics.successRate }}%</p>
            <p class="text-sm text-gray-600">Taux de succès</p>
          </div>
        </UCard>
        
        <!-- Nouvelle carte pour le cache -->
        <UCard>
          <div class="text-center">
            <p class="text-2xl font-bold text-cyan-600">{{ cacheStats.totalCached }}</p>
            <p class="text-sm text-gray-600">En cache</p>
            <p class="text-xs text-gray-400">{{ cacheStats.cacheHits }} hits</p>
          </div>
        </UCard>
      </div>

      <!-- Barre de recherche -->
      <div class="mb-6">
        <UInput
          v-model="searchQuery"
          placeholder="Rechercher dans les transcriptions..."
          size="lg"
          icon="i-heroicons-magnifying-glass"
          @input="handleSearch"
        />
      </div>

      <!-- Filtres -->
      <div class="flex gap-4 mb-6">
        <UButton
          v-for="status in ['all', 'completed', 'error', 'processing']"
          :key="status"
          @click="filterStatus = status"
          :color="filterStatus === status ? 'primary' : 'gray'"
          :variant="filterStatus === status ? 'solid' : 'outline'"
          size="sm"
          :label="getStatusLabel(status)"
        />
      </div>

      <!-- Liste des transcriptions -->
      <div v-if="filteredTranscriptions.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="text-6xl text-gray-300 mb-4" />
        <p class="text-lg text-gray-500 mb-2">Aucune transcription trouvée</p>
        <p class="text-sm text-gray-400">Commencez par uploader un fichier audio</p>
      </div>

      <div v-else class="space-y-4">
        <UCard 
          v-for="transcription in paginatedTranscriptions" 
          :key="transcription.id"
          class="hover:shadow-md transition-shadow"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold truncate">{{ transcription.audioFile.name }}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{{ formatDate(transcription.createdAt) }}</span>
                  <span>{{ formatFileSize(transcription.audioFile.size) }}</span>
                  <span>{{ formatDuration(transcription.audioFile.duration) }}</span>
                  <UBadge 
                    :color="getStatusColor(transcription.status)"
                    :label="getStatusLabel(transcription.status)"
                    size="xs"
                  />
                  <UBadge 
                    v-if="transcription.fromCache"
                    color="cyan"
                    label="Cache"
                    size="xs"
                  />
                </div>
              </div>
              
              <div class="flex gap-2">
                <UButton
                  v-if="transcription.status === 'completed'"
                  @click="viewTranscription(transcription)"
                  size="xs"
                  color="blue"
                  label="Voir"
                />
                
                <UButton
                  @click="deleteTranscription(transcription.id)"
                  size="xs"
                  color="red"
                  variant="outline"
                  icon="i-heroicons-trash"
                />
              </div>
            </div>
          </template>

          <div v-if="transcription.status === 'completed'" class="space-y-3">
            <!-- Transcription brute -->
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Transcription :</p>
              <p class="text-sm bg-gray-50 p-2 rounded line-clamp-2">{{ transcription.rawText }}</p>
            </div>

            <!-- Analyse japonaise -->
            <div v-if="transcription.japaneseAnalysis">
              <p class="text-sm font-medium text-gray-600 mb-2">Analyse japonaise :</p>
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 space-y-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div class="bg-white p-2 rounded shadow-sm">
                    <span class="text-xs font-semibold text-red-700 uppercase tracking-wide">Kanji</span>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ transcription.japaneseAnalysis.kanji }}</p>
                  </div>
                  <div class="bg-white p-2 rounded shadow-sm">
                    <span class="text-xs font-semibold text-pink-700 uppercase tracking-wide">Hiragana</span>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ transcription.japaneseAnalysis.hiragana }}</p>
                  </div>
                </div>
                
                <div class="bg-white p-2 rounded shadow-sm">
                  <span class="text-xs font-semibold text-blue-700 uppercase tracking-wide">Romaji</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">{{ transcription.japaneseAnalysis.romaji }}</p>
                </div>
                
                <div class="bg-white p-2 rounded shadow-sm border-l-4 border-green-500">
                  <span class="text-xs font-semibold text-green-700 uppercase tracking-wide">Traduction française</span>
                  <p class="text-sm font-medium text-gray-900 mt-1">{{ transcription.japaneseAnalysis.translation }}</p>
                </div>
                
                <div class="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span class="text-xs text-blue-600 font-medium">
                    📝 {{ transcription.japaneseAnalysis.split?.length || 0 }} mots analysés
                  </span>
                  <UBadge color="blue" size="xs" label="Analyse complète" />
                </div>
              </div>
            </div>

            <!-- Métadonnées -->
            <div class="flex justify-between text-xs text-gray-400">
              <span>Temps de traitement: {{ Math.round(transcription.processingTime / 1000) }}s</span>
              <span>Modèle: {{ transcription.metadata.modelUsed }}</span>
            </div>
          </div>

          <div v-else-if="transcription.status === 'error'" class="text-red-600 text-sm">
            ❌ Erreur: {{ transcription.error }}
          </div>

          <div v-else-if="transcription.status === 'processing'" class="text-blue-600 text-sm">
            ⏳ Traitement en cours...
          </div>
        </UCard>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <UPagination 
          v-model="currentPage"
          :total="filteredTranscriptions.length"
          :page-count="pageSize"
        />
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTranscriptionStore } from '@/stores/transcription'
import { useRouter } from 'vue-router'

const router = useRouter()
const transcriptionStore = useTranscriptionStore()

// État local
const searchQuery = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Computed depuis le store
const {
  transcriptions,
  statistics,
  searchTranscriptions,
  deleteTranscription: storeDeleteTranscription,
  clearAllTranscriptions: storeClearAll,
  exportTranscriptions,
  setCurrentTranscription,
  getCacheStats,
  clearCache: storeClearCache
} = transcriptionStore

// Statistiques du cache
const cacheStats = computed(() => getCacheStats())

// Transcriptions filtrées
const filteredTranscriptions = computed(() => {
  let result = transcriptions

  // Filtrage par recherche
  if (searchQuery.value.trim()) {
    result = searchTranscriptions(searchQuery.value.trim())
  }

  // Filtrage par statut  
  if (filterStatus.value !== 'all') {
    result = result.filter(t => t.status === filterStatus.value)
  }

  // Tri par date (plus récent en premier)
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Pagination
const totalPages = computed(() => 
  Math.ceil(filteredTranscriptions.value.length / pageSize.value)
)

const paginatedTranscriptions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTranscriptions.value.slice(start, end)
})

// Actions
const handleSearch = () => {
  currentPage.value = 1 // Reset pagination lors de la recherche
}

const viewTranscription = (transcription) => {
  setCurrentTranscription(transcription.id)
  router.push('/')
}

const deleteTranscription = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette transcription ?')) {
    storeDeleteTranscription(id)
  }
}

const clearAllTranscriptions = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer toutes les transcriptions ?')) {
    storeClearAll()
  }
}

const clearCache = () => {
  if (confirm('Êtes-vous sûr de vouloir vider le cache des fichiers ? Cela forcera le retraitement de tous les fichiers déjà vus.')) {
    storeClearCache()
  }
}

const exportData = () => {
  const data = exportTranscriptions()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `transcriptions_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Helpers
const getStatusLabel = (status) => {
  const labels = {
    all: 'Toutes',
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminées', 
    error: 'Erreurs'
  }
  return labels[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'gray',
    processing: 'blue',
    completed: 'green',
    error: 'red'
  }
  return colors[status] || 'gray'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  // S'assurer que les données sont chargées
  transcriptionStore.loadTranscriptions()
})
</script>