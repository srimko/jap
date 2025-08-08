<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <template #header>
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <UBadge 
              :label="`#${episode.episodeNumber}`" 
              color="blue" 
              size="sm"
            />
            <span class="text-sm text-gray-500">{{ episode.formatted.date }}</span>
          </div>
          <h3 class="font-semibold text-lg leading-tight">{{ episode.title }}</h3>
        </div>
        
        <div class="flex gap-2 ml-4">
          <UButton
            @click="downloadEpisode"
            size="sm"
            color="green"
            variant="outline"
            icon="i-heroicons-arrow-down-tray"
            :loading="isDownloading"
            label="MP3"
          />
          
          <UButton
            @click="openWebLink"
            size="sm"
            color="blue"
            variant="ghost"
            icon="i-heroicons-arrow-top-right-on-square"
          />
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <!-- Description -->
      <p 
        class="text-sm text-gray-600 leading-relaxed"
        :class="{ 'line-clamp-3': !showFullDescription }"
      >
        {{ episode.description }}
      </p>
      
      <!-- Bouton pour afficher plus/moins -->
      <button
        v-if="episode.description.length > 200"
        @click="showFullDescription = !showFullDescription"
        class="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        {{ showFullDescription ? 'Voir moins' : 'Voir plus...' }}
      </button>

      <!-- Informations techniques -->
      <div class="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span v-if="episode.duration">
          <UIcon name="i-heroicons-clock" class="inline-block w-3 h-3 mr-1" />
          {{ episode.duration }}
        </span>
        
        <span>
          <UIcon name="i-heroicons-document" class="inline-block w-3 h-3 mr-1" />
          {{ episode.formatted.fileSize }}
        </span>
        
        <span v-if="episode.mp3Url">
          <UIcon name="i-heroicons-link" class="inline-block w-3 h-3 mr-1" />
          MP3 disponible
        </span>
      </div>

      <!-- Actions de transcription -->
      <div class="pt-3 border-t border-gray-100">
        <div class="flex gap-2">
          <UButton
            @click="startTranscriptionFromUrl"
            size="sm"
            color="purple"
            variant="solid"
            :loading="isLoadingForTranscription"
            :disabled="!episode.mp3Url"
          >
            <UIcon name="i-heroicons-microphone" class="mr-1" />
            Transcrire cet épisode
          </UButton>
          
          <UButton
            @click="addToQueue"
            size="sm"
            color="gray"
            variant="outline"
            :disabled="isInQueue"
          >
            <UIcon name="i-heroicons-queue-list" class="mr-1" />
            {{ isInQueue ? 'En file' : 'File d\'attente' }}
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  episode: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['download', 'transcribe', 'add-to-queue'])

const router = useRouter()

// État local
const showFullDescription = ref(false)
const isDownloading = ref(false)
const isLoadingForTranscription = ref(false)
const isInQueue = ref(false)

// Actions
const downloadEpisode = async () => {
  isDownloading.value = true
  try {
    emit('download', props.episode)
  } catch (error) {
    console.error('Erreur téléchargement:', error)
  } finally {
    isDownloading.value = false
  }
}

const openWebLink = () => {
  if (props.episode.webLink) {
    window.open(props.episode.webLink, '_blank')
  }
}

const startTranscriptionFromUrl = async () => {
  isLoadingForTranscription.value = true
  try {
    // Télécharger le MP3 et le convertir en File pour la transcription
    const response = await fetch(props.episode.mp3Url)
    const blob = await response.blob()
    
    // Créer un objet File à partir du blob
    const file = new File([blob], `${props.episode.title}.mp3`, {
      type: 'audio/mpeg'
    })
    
    // Émettre l'événement pour démarrer la transcription
    emit('transcribe', {
      episode: props.episode,
      audioFile: file
    })
    
    // Rediriger vers la page principale pour voir la transcription
    router.push('/')
    
  } catch (error) {
    console.error('Erreur lors du chargement du fichier audio:', error)
  } finally {
    isLoadingForTranscription.value = false
  }
}

const addToQueue = () => {
  isInQueue.value = true
  emit('add-to-queue', props.episode)
}
</script>

<style scoped>
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>