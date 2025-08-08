<template>
  <UContainer>
    <div class="max-w-7xl mx-auto">
      <!-- En-tête avec statistiques -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Nihongo con Teppei</h1>
            <p class="text-gray-600 mt-1">Podcast japonais pour débutants</p>
          </div>
          
          <div class="flex gap-3">
            <UButton
              @click="refreshFeed"
              :loading="loading"
              color="blue"
              variant="outline"
              icon="i-heroicons-arrow-path"
              label="Actualiser"
            />
            
            <UButton
              @click="exportEpisodesList"
              :disabled="episodes.length === 0"
              color="green"
              variant="outline"
              icon="i-heroicons-document-arrow-down"
              label="Exporter"
            />
          </div>
        </div>

        <!-- Statistiques globales -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ statistics.total }}</p>
              <p class="text-sm text-gray-600">Épisodes</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ Math.round(statistics.totalDuration / 60) }}h</p>
              <p class="text-sm text-gray-600">Total</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ statistics.totalSize }}</p>
              <p class="text-sm text-gray-600">Taille totale</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-orange-600">#{{ statistics.latestEpisode }}</p>
              <p class="text-sm text-gray-600">Dernier</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-cyan-600">{{ statistics.averageSize }}</p>
              <p class="text-sm text-gray-600">Taille moy.</p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Erreur de chargement -->
      <UAlert
        v-if="error"
        color="red"
        variant="soft"
        title="Erreur de chargement"
        :description="error"
        class="mb-6"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray' }"
        @close="error = null"
      />

      <!-- Barre de recherche et filtres -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Rechercher dans les titres et descriptions..."
            size="lg"
            icon="i-heroicons-magnifying-glass"
            @input="handleSearch"
            :loading="loading"
          />
        </div>
        
        <div class="flex gap-2">
          <USelectMenu
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Trier par..."
            size="lg"
          />
          
          <UButton
            @click="toggleSortOrder"
            :icon="sortOrder === 'desc' ? 'i-heroicons-bars-arrow-down' : 'i-heroicons-bars-arrow-up'"
            size="lg"
            color="gray"
            variant="outline"
          />
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading && episodes.length === 0" class="flex justify-center py-12">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="text-4xl text-blue-500 animate-spin mb-4" />
          <p class="text-lg text-gray-600">Chargement du flux RSS...</p>
          <p class="text-sm text-gray-500">Récupération des épisodes depuis nihongoconteppei.com</p>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="filteredAndSortedEpisodes.length === 0 && !loading" class="text-center py-12">
        <UIcon name="i-heroicons-magnifying-glass" class="text-6xl text-gray-300 mb-4" />
        <p class="text-lg text-gray-500 mb-2">Aucun épisode trouvé</p>
        <p class="text-sm text-gray-400">
          {{ searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Cliquez sur "Actualiser" pour charger les épisodes' }}
        </p>
      </div>

      <!-- Liste des épisodes -->
      <div v-else class="space-y-4">
        <!-- Informations sur les résultats -->
        <div v-if="searchQuery" class="text-sm text-gray-600 mb-4">
          {{ filteredAndSortedEpisodes.length }} épisode(s) trouvé(s) pour "{{ searchQuery }}"
          <button @click="clearSearch" class="ml-2 text-blue-600 hover:text-blue-800">
            Effacer la recherche
          </button>
        </div>

        <!-- Cards des épisodes -->
        <PodcastCard
          v-for="episode in paginatedEpisodes"
          :key="episode.id"
          :episode="episode"
          @download="handleDownload"
          @transcribe="handleTranscribe"
          @add-to-queue="handleAddToQueue"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <UPagination
            v-model="currentPage"
            :total="filteredAndSortedEpisodes.length"
            :page-count="pageSize"
          />
        </div>
      </div>

      <!-- Queue de transcription -->
      <div v-if="transcriptionQueue.length > 0" class="fixed bottom-4 right-4 z-50">
        <UCard class="w-80">
          <template #header>
            <div class="flex justify-between items-center">
              <h4 class="font-semibold">File de transcription</h4>
              <UButton
                @click="clearQueue"
                size="xs"
                color="red"
                variant="ghost"
                icon="i-heroicons-x-mark"
              />
            </div>
          </template>
          
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(item, index) in transcriptionQueue"
              :key="item.id"
              class="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
            >
              <span class="truncate">{{ item.title }}</span>
              <UButton
                @click="removeFromQueue(index)"
                size="xs"
                color="red"
                variant="ghost"
                icon="i-heroicons-minus"
              />
            </div>
          </div>
          
          <template #footer>
            <UButton
              @click="processQueue"
              :disabled="transcriptionQueue.length === 0"
              color="purple"
              block
              size="sm"
            >
              Traiter la file ({{ transcriptionQueue.length }})
            </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePodcastFeed } from '@/composables/usePodcastFeed'
import { useJapaneseTranscription } from '@/composables/useJapaneseTranscription'
import PodcastCard from '@/components/PodcastCard.vue'

// Composables
const {
  episodes,
  loading,
  error,
  statistics,
  fetchPodcastFeed,
  searchEpisodes,
  downloadEpisode
} = usePodcastFeed()

const { handleFileChange, processTranscription } = useJapaneseTranscription()

// État local
const searchQuery = ref('')
const sortBy = ref('episode')
const sortOrder = ref('desc')
const currentPage = ref(1)
const pageSize = ref(12)
const transcriptionQueue = ref([])

// Options de tri
const sortOptions = [
  { label: 'Numéro d\'épisode', value: 'episode' },
  { label: 'Date de publication', value: 'date' },
  { label: 'Titre', value: 'title' },
  { label: 'Taille de fichier', value: 'size' }
]

// Computed
const filteredEpisodes = computed(() => {
  if (!searchQuery.value.trim()) {
    return episodes.value
  }
  return searchEpisodes(searchQuery.value.trim())
})

const filteredAndSortedEpisodes = computed(() => {
  let result = [...filteredEpisodes.value]
  
  // Tri
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'episode':
        comparison = a.episodeNumber - b.episodeNumber
        break
      case 'date':
        comparison = new Date(a.publishDate) - new Date(b.publishDate)
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'size':
        comparison = a.fileSize - b.fileSize
        break
    }
    
    return sortOrder.value === 'desc' ? -comparison : comparison
  })
  
  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredAndSortedEpisodes.value.length / pageSize.value)
)

const paginatedEpisodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedEpisodes.value.slice(start, end)
})

// Actions
const refreshFeed = async () => {
  await fetchPodcastFeed()
}

const handleSearch = () => {
  currentPage.value = 1
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const handleDownload = async (episode) => {
  try {
    await downloadEpisode(episode)
  } catch (error) {
    console.error('Erreur téléchargement:', error)
  }
}

const handleTranscribe = async ({ audioFile }) => {
  try {
    // Simuler la sélection du fichier pour le composable de transcription
    await handleFileChange(audioFile)
    // Démarrer la transcription
    await processTranscription()
  } catch (error) {
    console.error('Erreur transcription:', error)
  }
}

const handleAddToQueue = (episode) => {
  if (!transcriptionQueue.value.find(item => item.id === episode.id)) {
    transcriptionQueue.value.push(episode)
  }
}

const removeFromQueue = (index) => {
  transcriptionQueue.value.splice(index, 1)
}

const clearQueue = () => {
  transcriptionQueue.value = []
}

const processQueue = async () => {
  // TODO: Implémenter le traitement en lot de la file de transcription
  console.log('Traitement de la file de transcription:', transcriptionQueue.value)
}

const exportEpisodesList = () => {
  const data = {
    podcast: 'Nihongo con Teppei',
    exportDate: new Date().toISOString(),
    statistics: statistics.value,
    episodes: episodes.value.map(ep => ({
      number: ep.episodeNumber,
      title: ep.title,
      description: ep.description,
      mp3Url: ep.mp3Url,
      webLink: ep.webLink,
      publishDate: ep.publishDate,
      fileSize: ep.fileSize,
      duration: ep.duration
    }))
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `nihongo_con_teppei_episodes_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(async () => {
  await fetchPodcastFeed()
})
</script>