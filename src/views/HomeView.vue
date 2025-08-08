<template>
  <UContainer>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Transcription &amp; segmentation (JP)</h2>

      <div class="flex justify-between mb-4">
        <UInput 
          type="file" 
          placeholder="Sélectionner un fichier audio" 
          size="xl" 
          accept="audio/*" 
          :loading="transcriptionLoading"
          @change="file = $event.target.files[0]" 
        />

        <UButton 
          label="Transcription" 
          color="neutral" 
          variant="outline" 
          size="xl" 
          @click="processTranscription"
          :disabled="!file || transcriptionLoading || textCompletionLoading"
        />
      </div>

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

const {
  file,
  textTranscription,
  transcriptionLoading,
  textCompletion,
  textCompletionLoading,
  processTranscription
} = useJapaneseTranscription()
</script>
