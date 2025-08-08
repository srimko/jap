<template>
  <UContainer>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Transcription &amp; segmentation (JP)</h2>

      <!-- Validation Error Alert -->
      <FileValidationAlert 
        :error="validationError" 
        @close="clearValidationError" 
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

      <JapaneseTextDisplay v-if="textCompletion" :text-completion="textCompletion" />
      
      <CompletionLoadingSkeleton v-else-if="textCompletionLoading" />
    </div>
  </UContainer>
</template>

<script setup>
import { useJapaneseTranscription } from '@/composables/useJapaneseTranscription'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import JapaneseTextDisplay from '@/components/JapaneseTextDisplay.vue'
import CompletionLoadingSkeleton from '@/components/CompletionLoadingSkeleton.vue'
import FileValidationAlert from '@/components/FileValidationAlert.vue'
import AudioFileInfo from '@/components/AudioFileInfo.vue'

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

const startTranscription = async () => {
  try {
    await processTranscription()
  } catch (error) {
    console.error('Erreur lors de la transcription:', error)
    // L'erreur sera gérée par le composable
  }
}
</script>
