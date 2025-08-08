<template>
  <UContainer>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Transcription &amp; segmentation (JP)</h2>

      <!-- Validation Error Alert -->
      <FileValidationAlert 
        :error="validationError" 
        @close="clearValidationError" 
      />
      
      <!-- Cache Indicator -->
      <CacheIndicator 
        :status="cacheStatus"
        :file-name="file?.name || ''"
        :cache-stats="transcriptionStore.getCacheStats()"
        :processing-time="processingTime"
      />

      <div class="flex justify-between mb-4">
        <UInput 
          type="file" 
          placeholder="Sélectionner un fichier audio (MP3, WAV, M4A, AAC...)" 
          size="xl" 
          accept="audio/*" 
          :loading="isValidating || transcriptionLoading"
          @change="handleFileChange($event.target.files[0])" 
        />

        <UButton 
          label="Transcription" 
          color="neutral" 
          variant="outline" 
          size="xl" 
          @click="startTranscription"
          :disabled="!file || transcriptionLoading || textCompletionLoading || isValidating"
          :loading="transcriptionLoading || textCompletionLoading"
        />
      </div>

      <!-- File Info Display -->
      <AudioFileInfo 
        :file-info="fileInfo" 
        :get-file-size-formatted="getFileSizeFormatted"
        :get-duration-formatted="getDurationFormatted"
      />

      <div v-if="textTranscription" class="mt-6">
        <h3 class="text-2xl font-bold">Transcription</h3>
        <p>{{ textTranscription }}</p>
      </div>

      <LoadingSkeleton v-else-if="transcriptionLoading" />

      <!-- Afficher JapaneseTextDisplay si on a les données (cache ou API) -->
      <JapaneseTextDisplay 
        v-if="textCompletion && (textCompletion.kanji || textCompletion.hiragana)" 
        :text-completion="textCompletion" 
      />
      
      
      <CompletionLoadingSkeleton v-else-if="textCompletionLoading" />
    </div>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useJapaneseTranscription } from '@/composables/useJapaneseTranscription'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import JapaneseTextDisplay from '@/components/JapaneseTextDisplay.vue'
import CompletionLoadingSkeleton from '@/components/CompletionLoadingSkeleton.vue'
import FileValidationAlert from '@/components/FileValidationAlert.vue'
import AudioFileInfo from '@/components/AudioFileInfo.vue'
import CacheIndicator from '@/components/CacheIndicator.vue'
import { useTranscriptionStore } from '@/stores/transcription'

const transcriptionStore = useTranscriptionStore()

const {
  file,
  textTranscription,
  transcriptionLoading,
  textCompletion,
  textCompletionLoading,
  fileInfo,
  validationError,
  isValidating,
  processTranscription,
  handleFileChange,
  clearValidationError,
  getFileSizeFormatted,
  getDurationFormatted
} = useJapaneseTranscription()

// État pour l'indicateur de cache
const cacheStatus = ref('none')
const processingTime = ref(0)


const startTranscription = async () => {
  try {
    // Indiquer le début du traitement
    cacheStatus.value = 'processing'
    processingTime.value = 0
    
    const startTime = Date.now()
    
    // Pré-vérifier le cache pour l'indicateur UX
    const cacheResult = await transcriptionStore.findCachedTranscription(file.value)
    
    if (cacheResult.found) {
      // Trouvé en cache - indiquer à l'utilisateur
      cacheStatus.value = 'found'
    }
    
    // TOUJOURS appeler processTranscription - il gère le cache en interne
    await processTranscription()
    
    const endTime = Date.now()
    processingTime.value = endTime - startTime
    
    if (cacheResult.found) {
      // C'était du cache - masquer après 3 secondes
      setTimeout(() => {
        cacheStatus.value = 'none'
      }, 3000)
    } else {
      // C'était un nouveau traitement - indiquer la sauvegarde
      cacheStatus.value = 'saving'
      setTimeout(() => {
        cacheStatus.value = 'none'
      }, 4000)
    }
  } catch (error) {
    console.error('Erreur lors de la transcription:', error)
    cacheStatus.value = 'none'
    // L'erreur sera gérée par le composable
  }
}
</script>
