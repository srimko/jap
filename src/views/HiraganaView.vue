<template>
  <UContainer>
    <div class="max-w-6xl mx-auto">
      <!-- Header with title and statistics -->
      <div class="mb-8">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            ひらがな - Hiragana
          </h1>
          <p class="text-gray-600">
            Apprenez les caractères hiragana avec la prononciation audio
          </p>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ statistics.basicCount }}</p>
              <p class="text-sm text-gray-600">Hiragana avec audio</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ statistics.combinationsCount }}</p>
              <p class="text-sm text-gray-600">Combinaisons</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ statistics.totalCount }}</p>
              <p class="text-sm text-gray-600">Total</p>
            </div>
          </UCard>
          
          <UCard>
            <div class="text-center">
              <p class="text-2xl font-bold text-orange-600" :class="{ 'animate-pulse': currentPlaying }">
                {{ currentPlaying ? '🔊' : '🔇' }}
              </p>
              <p class="text-sm text-gray-600">Audio</p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Controls -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <!-- View tabs -->
          <div class="flex gap-2">
            <UButton
              @click="currentView = 'basic'"
              :color="currentView === 'basic' ? 'blue' : 'gray'"
              :variant="currentView === 'basic' ? 'solid' : 'outline'"
              size="sm"
            >
              <UIcon name="i-heroicons-squares-2x2" class="mr-1" />
              Hiragana de base ({{ statistics.basicCount }})
            </UButton>
            
            <UButton
              @click="currentView = 'combinations'"
              :color="currentView === 'combinations' ? 'blue' : 'gray'"
              :variant="currentView === 'combinations' ? 'solid' : 'outline'"
              size="sm"
            >
              <UIcon name="i-heroicons-puzzle-piece" class="mr-1" />
              Combinaisons ({{ statistics.combinationsCount }})
            </UButton>
          </div>

          <!-- Display options -->
          <div class="flex items-center gap-4">
            <UToggle
              v-model="showRomaji"
              :ui="{ active: 'bg-blue-500' }"
            />
            <span class="text-sm text-gray-700">Afficher romaji</span>
            
            <UToggle
              v-model="playOnHover"
              :ui="{ active: 'bg-green-500' }"
            />
            <span class="text-sm text-gray-700">Jouer au survol</span>
          </div>

          <!-- Audio actions -->
          <div class="flex gap-2">
            <UButton
              @click="playAll"
              color="green"
              variant="outline"
              size="sm"
              :loading="isPlayingAll"
              :disabled="currentPlaying !== null"
            >
              <UIcon name="i-heroicons-play" class="mr-1" />
              Jouer tout
            </UButton>
            
            <UButton
              @click="stopAllAudio"
              color="red"
              variant="outline"
              size="sm"
              :disabled="currentPlaying === null"
            >
              <UIcon name="i-heroicons-stop" class="mr-1" />
              Arrêter
            </UButton>
          </div>
        </div>
      </div>

      <!-- Help message -->
      <div v-if="!browserSupportsAudio" class="mb-6">
        <UAlert
          color="orange"
          variant="soft"
          title="Synthèse vocale non disponible"
          description="Votre navigateur ne supporte pas la synthèse vocale. Essayez Chrome, Firefox ou Safari pour entendre la prononciation."
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray' }"
        />
      </div>

      <!-- Hiragana grid -->
      <div class="hiragana-grid-container">
        <div 
          class="hiragana-grid"
          :class="{
            'basic-grid': currentView === 'basic',
            'combinations-grid': currentView === 'combinations'
          }"
        >
          <!-- Grid generation -->
          <template v-for="(row, rowIndex) in currentGrid" :key="`row-${rowIndex}`">
            <!-- Row play button -->
            <div v-if="currentView === 'basic'" class="row-controls">
              <UButton
                @click="playRow(rowIndex)"
                size="xs"
                color="blue"
                variant="ghost"
                :disabled="currentPlaying !== null"
                class="row-play-btn"
              >
                <UIcon name="i-heroicons-play" class="w-3 h-3" />
              </UButton>
            </div>

            <!-- Hiragana cells in the row -->
            <HiraganaCard
              v-for="(hiragana, colIndex) in row"
              :key="`${rowIndex}-${colIndex}-${hiragana?.char || 'empty'}`"
              :hiragana="hiragana"
              :show-romaji="showRomaji"
              :enable-hover="playOnHover"
              :current-playing="currentPlaying"
              @play="speakHiragana"
              @hover-enter="handleHover"
              class="hiragana-cell"
            />
          </template>
        </div>
      </div>

      <!-- Additional information -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Usage guide -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold flex items-center">
              <UIcon name="i-heroicons-information-circle" class="mr-2" />
              Comment utiliser
            </h3>
          </template>
          
          <div class="space-y-3 text-sm">
            <p><strong>🖱️ Cliquer</strong> sur un hiragana pour entendre sa prononciation</p>
            <p><strong>🔊 Jouer tout</strong> pour entendre tous les hiragana de la vue actuelle</p>
            <p><strong>📝 Romaji</strong> : désactivez l'affichage pour vous tester</p>
            <p><strong>🎯 Survol</strong> : activez pour jouer automatiquement au passage de la souris</p>
            <p><strong>🔄 Onglets</strong> : naviguez entre hiragana de base et combinaisons</p>
          </div>
        </UCard>

        <!-- Information about hiragana -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold flex items-center">
              <UIcon name="i-heroicons-academic-cap" class="mr-2" />
              À propos des Hiragana
            </h3>
          </template>
          
          <div class="space-y-3 text-sm">
            <p>Les <strong>hiragana</strong> (ひらがな) sont l'un des trois systèmes d'écriture japonais.</p>
            <p><strong>Utilisation</strong> : mots japonais natifs, particules grammaticales, conjugaisons</p>
            <p><strong>{{ statistics.basicCount }} caractères avec audio</strong> disponibles pour l'apprentissage</p>
            <p><strong>{{ statistics.combinationsCount }} combinaisons</strong> avec や, ゆ, よ pour des sons complexes</p>
            <p><strong>Source audio</strong> : fichiers de prononciation authentique de <a href="https://www.thoughtco.com/how-to-pronounce-hiragana-japanese-hiragana-with-audio-files-4077351" target="_blank" class="text-blue-600 hover:underline">ThoughtCo.com</a></p>
          </div>
        </UCard>
      </div>

      <!-- Quick actions at the bottom -->
      <div class="mt-8 text-center">
        <div class="flex flex-wrap justify-center gap-4">
          <UButton
            @click="testRandomHiragana"
            color="purple"
            variant="outline"
          >
            <UIcon name="i-heroicons-puzzle-piece" class="mr-1" />
            Test aléatoire
          </UButton>
          
          <UButton
            @click="practiceMode"
            color="indigo"
            variant="outline"
          >
            <UIcon name="i-heroicons-academic-cap" class="mr-1" />
            Mode entraînement
          </UButton>
          
          <UButton
            @click="exportProgress"
            color="gray"
            variant="outline"
          >
            <UIcon name="i-heroicons-document-arrow-down" class="mr-1" />
            Exporter progrès
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHiragana } from '@/composables/useHiragana'
import HiraganaCard from '@/components/HiraganaCard.vue'

// Hiragana composable
const {
  showRomaji,
  playOnHover,
  currentView,
  currentPlaying,
  currentGrid,
  statistics,
  speakHiragana,
  playRow,
  playAll: playAllHiragana,
  stopAudio,
  handleHover
} = useHiragana()

// Local state
const isPlayingAll = ref(false)
const browserSupportsAudio = ref(true)

// Check audio support on mount
onMounted(() => {
  if (!('speechSynthesis' in window)) {
    browserSupportsAudio.value = false
  }
})

// Play all hiragana with indicator
const playAll = async () => {
  isPlayingAll.value = true
  try {
    await playAllHiragana()
  } finally {
    isPlayingAll.value = false
  }
}

// Stop audio (uses composable function)
const stopAllAudio = () => {
  stopAudio() // Fonction du composable
}

// Future features (placeholders)
const testRandomHiragana = () => {
  alert('🚧 Fonction de test aléatoire en développement')
}

const practiceMode = () => {
  alert('🚧 Mode entraînement en développement')
}

const exportProgress = () => {
  const data = {
    hiragana: 'progress_data',
    date: new Date().toISOString(),
    stats: statistics.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `hiragana_progress_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Main grid */
.hiragana-grid-container {
  @apply relative;
}

.hiragana-grid {
  @apply grid justify-center;
  gap: 0.5rem;
}

.hiragana-grid.basic-grid {
  grid-template-columns: auto repeat(5, 80px);
  gap: 0.75rem;
}

.hiragana-grid.combinations-grid {
  grid-template-columns: repeat(3, 80px);
  gap: 1rem;
}

/* Row controls */
.row-controls {
  @apply flex items-center justify-center;
}

.row-play-btn {
  @apply opacity-60 hover:opacity-100;
}

/* Responsive */
@media (max-width: 640px) {
  .hiragana-grid.basic-grid {
    grid-template-columns: auto repeat(5, 64px);
    gap: 0.5rem;
  }
  
  .hiragana-grid.combinations-grid {
    grid-template-columns: repeat(3, 64px);
    gap: 0.75rem;
  }
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hiragana-cell {
  animation: fade-in 0.3s ease-out forwards;
}

/* Animation delay for each cell */
.hiragana-cell:nth-child(1) { animation-delay: 0.05s; }
.hiragana-cell:nth-child(2) { animation-delay: 0.1s; }
.hiragana-cell:nth-child(3) { animation-delay: 0.15s; }
.hiragana-cell:nth-child(4) { animation-delay: 0.2s; }
.hiragana-cell:nth-child(5) { animation-delay: 0.25s; }
.hiragana-cell:nth-child(6) { animation-delay: 0.3s; }
</style>