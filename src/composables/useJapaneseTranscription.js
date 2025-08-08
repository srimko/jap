import { ref, watch } from 'vue'
import { functionSchema } from '@/llm/functionSchema'
import { messages } from '@/llm/messages'
import { useAudioValidation } from './useAudioValidation'
import { useTranscriptionStore } from '@/stores/transcription'

export function useJapaneseTranscription() {
  const { VITE_OPENAI_API_KEY } = import.meta.env
  
  const transcriptionStore = useTranscriptionStore()

  const file = ref(null)
  const fileInfo = ref(null)
  
  const {
    validationError,
    isValidating,
    validateAudioFile,
    clearValidationError,
    getFileSizeFormatted,
    getDurationFormatted
  } = useAudioValidation()
  
  // État réactif synchronisé avec le store
  const textTranscription = ref('')
  const textCompletion = ref(null)
  const transcriptionLoading = ref(false)
  const textCompletionLoading = ref(false)
  
  // Synchronisation automatique avec le store currentTranscription
  watch(
    () => transcriptionStore.currentTranscription,
    (newTranscription, oldTranscription) => {
      console.log('🔄 Watcher déclenché - currentTranscription changée:', {
        newId: newTranscription?.id,
        oldId: oldTranscription?.id,
        hasNew: !!newTranscription,
        hasRawText: !!newTranscription?.rawText,
        hasJapaneseAnalysis: !!newTranscription?.japaneseAnalysis,
        fromCache: newTranscription?.fromCache
      })
      
      if (newTranscription) {
        // Forcer la mise à jour des refs
        textTranscription.value = newTranscription.rawText || ''
        textCompletion.value = newTranscription.japaneseAnalysis || null
        
        console.log('🔄 Refs mis à jour:', {
          textTranscription: textTranscription.value.length > 0,
          textCompletion: !!textCompletion.value,
          textCompletionKeys: textCompletion.value ? Object.keys(textCompletion.value) : []
        })
      } else {
        // Vider si pas de transcription courante
        textTranscription.value = ''
        textCompletion.value = null
      }
    },
    { immediate: true, deep: true }
  )

  const getTranscription = async (transcriptionId) => {
    const formData = new FormData()
    formData.append('file', file.value, file.value.name)
    formData.append('model', 'whisper-1')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${VITE_OPENAI_API_KEY}` },
      body: formData,
    })
    
    if (!response.ok) throw new Error(await response.text())
    const result = await response.json()

    transcriptionLoading.value = false
    textTranscription.value = result.text
    
    // Mettre à jour le store
    transcriptionStore.finishTranscription(transcriptionId, result.text)
    
    return result.text
  }

  const getCompletion = async (transcriptionId, transcriptionText) => {
    const completionMessages = [...messages, {
      role: 'user',
      content: transcriptionText,
    }]

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.2,
        functions: [functionSchema],
        function_call: { name: 'segmentJapanese' },
        messages: completionMessages,
      }),
    })

    const json = await completion.json()
    const japaneseAnalysis = JSON.parse(json.choices[0].message.function_call.arguments)
    
    textCompletion.value = japaneseAnalysis
    textCompletionLoading.value = false
    
    // Mettre à jour le store
    transcriptionStore.finishProcessingCompletion(transcriptionId, japaneseAnalysis)
    
    return japaneseAnalysis
  }

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) {
      file.value = null
      fileInfo.value = null
      clearValidationError()
      return
    }

    const validation = await validateAudioFile(selectedFile)
    if (validation.isValid) {
      file.value = selectedFile
      fileInfo.value = validation
    } else {
      file.value = null
      fileInfo.value = null
    }
  }

  const processTranscription = async () => {
    if (!file.value) {
      throw new Error('Aucun fichier audio sélectionné')
    }

    let transcriptionId = null
    
    try {
      // Vérifier d'abord le cache
      const cacheResult = await transcriptionStore.findCachedTranscription(file.value)
      
      if (cacheResult.found) {
        // Fichier déjà traité ! Utiliser le cache
        console.log('🚀 Transcription trouvée en cache, pas d’appel API nécessaire')
        
        const cachedTranscription = transcriptionStore.createTranscriptionFromCache(
          file.value, 
          fileInfo.value, 
          cacheResult.data, 
          cacheResult.fileMetadata
        )
        
        // Simuler un court délai pour l'UX (optionnel)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Le watcher se chargera de mettre à jour textTranscription et textCompletion
        // automatiquement quand currentTranscription change
        console.log('✅ Transcription depuis cache créée, le watcher va synchroniser l\'interface')
        
        return // Terminé !
      }
      
      // Pas en cache, traitement normal
      console.log('🔄 Nouveau fichier, traitement avec API...')
      
      // Créer une nouvelle transcription dans le store
      const transcription = await transcriptionStore.createTranscription(file.value, fileInfo.value)
      transcriptionId = transcription.id
      
      // Phase 1: Transcription
      transcriptionLoading.value = true
      transcriptionStore.startTranscription()
      
      const transcriptionText = await getTranscription(transcriptionId)
      
      // Phase 2: Analyse japonaise
      textCompletionLoading.value = true
      transcriptionStore.startProcessingCompletion()
      
      await getCompletion(transcriptionId, transcriptionText)
      
    } catch (err) {
      console.error(err)
      transcriptionLoading.value = false
      textCompletionLoading.value = false
      
      if (transcriptionId) {
        transcriptionStore.handleError(transcriptionId, err.message)
      }
      
      throw err
    }
  }

  return {
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
  }
}