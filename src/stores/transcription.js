import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppStore } from './app'

export const useTranscriptionStore = defineStore('transcription', () => {
  const appStore = useAppStore()

  // État des transcriptions
  const transcriptions = ref([])
  const currentTranscription = ref(null)
  const isTranscribing = ref(false)
  const isProcessingCompletion = ref(false)
  
  // Historique et cache
  const transcriptionHistory = ref([])
  const maxHistoryItems = ref(50)

  // Computed
  const hasCurrentTranscription = computed(() => 
    currentTranscription.value !== null
  )

  const transcriptionCount = computed(() => 
    transcriptions.value.length
  )

  const todaysTranscriptions = computed(() => {
    const today = new Date().toDateString()
    return transcriptions.value.filter(t => 
      new Date(t.createdAt).toDateString() === today
    )
  })

  const recentTranscriptions = computed(() => 
    transcriptions.value
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  )

  const statistics = computed(() => ({
    total: transcriptionCount.value,
    today: todaysTranscriptions.value.length,
    averageProcessingTime: getAverageProcessingTime(),
    successRate: getSuccessRate(),
    mostUsedFormats: getMostUsedFormats()
  }))

  // Actions principales
  const createTranscription = (audioFile, fileInfo) => {
    const transcription = {
      id: Date.now().toString(),
      audioFile: {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
        duration: fileInfo?.duration || 0
      },
      rawText: '',
      japaneseAnalysis: null,
      status: 'pending', // pending, processing, completed, error
      error: null,
      createdAt: new Date(),
      completedAt: null,
      processingTime: 0,
      metadata: {
        modelUsed: 'whisper-1',
        temperature: 0.2,
        language: 'ja'
      }
    }

    transcriptions.value.push(transcription)
    currentTranscription.value = transcription
    saveTranscriptions()
    
    return transcription
  }

  const updateTranscriptionStatus = (transcriptionId, status, data = {}) => {
    const transcription = transcriptions.value.find(t => t.id === transcriptionId)
    if (!transcription) return

    const now = new Date()
    transcription.status = status
    
    if (status === 'completed') {
      transcription.completedAt = now
      transcription.processingTime = now - new Date(transcription.createdAt)
      if (data.rawText) transcription.rawText = data.rawText
      if (data.japaneseAnalysis) transcription.japaneseAnalysis = data.japaneseAnalysis
    } else if (status === 'error') {
      transcription.error = data.error || 'Erreur inconnue'
      transcription.completedAt = now
    }

    // Mettre à jour la transcription courante si c'est la même
    if (currentTranscription.value?.id === transcriptionId) {
      currentTranscription.value = { ...transcription }
    }

    saveTranscriptions()
  }

  const deleteTranscription = (transcriptionId) => {
    const index = transcriptions.value.findIndex(t => t.id === transcriptionId)
    if (index !== -1) {
      transcriptions.value.splice(index, 1)
      
      // Si c'est la transcription courante, la vider
      if (currentTranscription.value?.id === transcriptionId) {
        currentTranscription.value = null
      }
      
      saveTranscriptions()
    }
  }

  const clearAllTranscriptions = () => {
    transcriptions.value = []
    currentTranscription.value = null
    transcriptionHistory.value = []
    saveTranscriptions()
    saveHistory()
  }

  const setCurrentTranscription = (transcriptionId) => {
    const transcription = transcriptions.value.find(t => t.id === transcriptionId)
    if (transcription) {
      currentTranscription.value = transcription
    }
  }

  // Actions de traitement
  const startTranscription = () => {
    isTranscribing.value = true
    appStore.setLoading(true)
  }

  const finishTranscription = (transcriptionId, rawText) => {
    isTranscribing.value = false
    updateTranscriptionStatus(transcriptionId, 'transcribed', { rawText })
  }

  const startProcessingCompletion = () => {
    isProcessingCompletion.value = true
  }

  const finishProcessingCompletion = (transcriptionId, japaneseAnalysis) => {
    isProcessingCompletion.value = false
    appStore.setLoading(false)
    updateTranscriptionStatus(transcriptionId, 'completed', { japaneseAnalysis })
    
    // Ajouter à l'historique
    addToHistory(currentTranscription.value)
  }

  const handleError = (transcriptionId, error) => {
    isTranscribing.value = false
    isProcessingCompletion.value = false
    appStore.setLoading(false)
    appStore.setError(error)
    updateTranscriptionStatus(transcriptionId, 'error', { error })
  }

  // Gestion de l'historique
  const addToHistory = (transcription) => {
    if (!transcription) return

    const historyItem = {
      id: transcription.id,
      rawText: transcription.rawText,
      japaneseAnalysis: transcription.japaneseAnalysis,
      createdAt: transcription.createdAt,
      audioFileName: transcription.audioFile.name,
      processingTime: transcription.processingTime
    }

    transcriptionHistory.value.unshift(historyItem)
    
    // Limiter la taille de l'historique
    if (transcriptionHistory.value.length > maxHistoryItems.value) {
      transcriptionHistory.value = transcriptionHistory.value.slice(0, maxHistoryItems.value)
    }
    
    saveHistory()
  }

  const getFromHistory = (historyId) => {
    return transcriptionHistory.value.find(item => item.id === historyId)
  }

  const clearHistory = () => {
    transcriptionHistory.value = []
    saveHistory()
  }

  // Recherche et filtres
  const searchTranscriptions = (query) => {
    const searchTerm = query.toLowerCase()
    return transcriptions.value.filter(t => 
      t.rawText.toLowerCase().includes(searchTerm) ||
      t.audioFile.name.toLowerCase().includes(searchTerm) ||
      (t.japaneseAnalysis?.translation?.toLowerCase().includes(searchTerm))
    )
  }

  const filterByStatus = (status) => {
    return transcriptions.value.filter(t => t.status === status)
  }

  const filterByDate = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return transcriptions.value.filter(t => {
      const transcriptionDate = new Date(t.createdAt)
      return transcriptionDate >= start && transcriptionDate <= end
    })
  }

  // Statistiques et analyses
  const getAverageProcessingTime = () => {
    const completedTranscriptions = transcriptions.value.filter(t => 
      t.status === 'completed' && t.processingTime > 0
    )
    
    if (completedTranscriptions.length === 0) return 0
    
    const totalTime = completedTranscriptions.reduce((sum, t) => sum + t.processingTime, 0)
    return Math.round(totalTime / completedTranscriptions.length)
  }

  const getSuccessRate = () => {
    if (transcriptions.value.length === 0) return 100
    
    const completedCount = transcriptions.value.filter(t => t.status === 'completed').length
    return Math.round((completedCount / transcriptions.value.length) * 100)
  }

  const getMostUsedFormats = () => {
    const formatCount = {}
    transcriptions.value.forEach(t => {
      const format = t.audioFile.type
      formatCount[format] = (formatCount[format] || 0) + 1
    })
    
    return Object.entries(formatCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([format, count]) => ({ format, count }))
  }

  // Import/Export
  const exportTranscriptions = () => {
    return JSON.stringify({
      transcriptions: transcriptions.value,
      history: transcriptionHistory.value,
      exportedAt: new Date()
    }, null, 2)
  }

  const importTranscriptions = (jsonData, replaceExisting = false) => {
    try {
      const data = JSON.parse(jsonData)
      
      if (replaceExisting) {
        transcriptions.value = data.transcriptions || []
        transcriptionHistory.value = data.history || []
      } else {
        // Éviter les doublons
        const existingIds = new Set(transcriptions.value.map(t => t.id))
        const newTranscriptions = (data.transcriptions || []).filter(t => !existingIds.has(t.id))
        transcriptions.value.push(...newTranscriptions)
        
        const existingHistoryIds = new Set(transcriptionHistory.value.map(h => h.id))
        const newHistory = (data.history || []).filter(h => !existingHistoryIds.has(h.id))
        transcriptionHistory.value.push(...newHistory)
      }
      
      saveTranscriptions()
      saveHistory()
      
      return { success: true, imported: data.transcriptions?.length || 0 }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Persistance
  const saveTranscriptions = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-transcriptions', JSON.stringify(transcriptions.value))
    }
  }

  const saveHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-transcription-history', JSON.stringify(transcriptionHistory.value))
    }
  }

  const loadTranscriptions = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jap-transcriptions')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          transcriptions.value = parsed.map(t => ({
            ...t,
            createdAt: new Date(t.createdAt),
            completedAt: t.completedAt ? new Date(t.completedAt) : null
          }))
        } catch (error) {
          console.warn('Failed to load transcriptions:', error)
        }
      }

      const savedHistory = localStorage.getItem('jap-transcription-history')
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory)
          transcriptionHistory.value = parsed.map(h => ({
            ...h,
            createdAt: new Date(h.createdAt)
          }))
        } catch (error) {
          console.warn('Failed to load transcription history:', error)
        }
      }
    }
  }

  // Initialiser les données au démarrage
  loadTranscriptions()

  return {
    // État
    transcriptions,
    currentTranscription,
    isTranscribing,
    isProcessingCompletion,
    transcriptionHistory,
    maxHistoryItems,
    
    // Computed
    hasCurrentTranscription,
    transcriptionCount,
    todaysTranscriptions,
    recentTranscriptions,
    statistics,
    
    // Actions principales
    createTranscription,
    updateTranscriptionStatus,
    deleteTranscription,
    clearAllTranscriptions,
    setCurrentTranscription,
    
    // Actions de traitement
    startTranscription,
    finishTranscription,
    startProcessingCompletion,
    finishProcessingCompletion,
    handleError,
    
    // Historique
    addToHistory,
    getFromHistory,
    clearHistory,
    
    // Recherche et filtres
    searchTranscriptions,
    filterByStatus,
    filterByDate,
    
    // Import/Export
    exportTranscriptions,
    importTranscriptions,
    
    // Persistance
    saveTranscriptions,
    saveHistory,
    loadTranscriptions
  }
})