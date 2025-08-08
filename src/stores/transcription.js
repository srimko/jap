import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAppStore } from './app'
import { generateFileMetadata } from '@/utils/fileHash'

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
  
  // Cache par hash de fichier
  const fileHashCache = ref(new Map()) // hash -> transcription data
  const hashToTranscriptionId = ref(new Map()) // hash -> transcription id

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
  const createTranscription = async (audioFile, fileInfo) => {
    // Générer les métadonnées du fichier avec hash
    const fileMetadata = await generateFileMetadata(audioFile)
    
    const transcription = {
      id: Date.now().toString(),
      fileHash: fileMetadata.hash,
      audioFile: {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
        duration: fileInfo?.duration || 0,
        hash: fileMetadata.hash
      },
      rawText: '',
      japaneseAnalysis: null,
      status: 'pending', // pending, processing, completed, error
      error: null,
      createdAt: new Date(),
      completedAt: null,
      processingTime: 0,
      fromCache: false,
      metadata: {
        modelUsed: 'whisper-1',
        temperature: 0.2,
        language: 'ja',
        fileMetadata
      }
    }

    transcriptions.value.push(transcription)
    currentTranscription.value = transcription
    
    // Mapper hash -> transcription ID
    hashToTranscriptionId.value.set(fileMetadata.hash, transcription.id)
    
    saveTranscriptions()
    saveHashCache()
    
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
    
    // Mettre à jour le cache par hash
    const transcription = transcriptions.value.find(t => t.id === transcriptionId)
    if (transcription && transcription.fileHash) {
      fileHashCache.value.set(transcription.fileHash, {
        rawText: transcription.rawText,
        japaneseAnalysis: japaneseAnalysis,
        processingTime: transcription.processingTime,
        completedAt: transcription.completedAt,
        metadata: transcription.metadata
      })
      saveHashCache()
    }
    
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

  // Cache et déduplication
  const findCachedTranscription = async (audioFile) => {
    try {
      const fileMetadata = await generateFileMetadata(audioFile)
      const cachedData = fileHashCache.value.get(fileMetadata.hash)
      
      if (cachedData) {
        return {
          found: true,
          hash: fileMetadata.hash,
          data: cachedData,
          fileMetadata
        }
      }
      
      return {
        found: false,
        hash: fileMetadata.hash,
        fileMetadata
      }
    } catch (error) {
      console.error('Erreur lors de la recherche en cache:', error)
      return { found: false, error: error.message }
    }
  }
  
  const createTranscriptionFromCache = (audioFile, fileInfo, cachedData, fileMetadata) => {
    console.log('🔧 createTranscriptionFromCache - cachedData:', cachedData)
    
    const transcription = {
      id: Date.now().toString(),
      fileHash: fileMetadata.hash,
      audioFile: {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
        duration: fileInfo?.duration || 0,
        hash: fileMetadata.hash
      },
      rawText: cachedData.rawText || '',
      japaneseAnalysis: cachedData.japaneseAnalysis || null,
      status: 'completed',
      error: null,
      createdAt: new Date(),
      completedAt: cachedData.completedAt || new Date(),
      processingTime: cachedData.processingTime || 0,
      fromCache: true, // Indiquer que c'est du cache
      metadata: {
        ...cachedData.metadata,
        fileMetadata,
        cachedAt: new Date()
      }
    }

    console.log('🔧 Transcription créée depuis cache:', {
      id: transcription.id,
      hasRawText: !!transcription.rawText,
      hasJapaneseAnalysis: !!transcription.japaneseAnalysis,
      japaneseAnalysisKeys: transcription.japaneseAnalysis ? Object.keys(transcription.japaneseAnalysis) : []
    })

    transcriptions.value.push(transcription)
    
    // IMPORTANT: Assigner explicitement currentTranscription
    currentTranscription.value = transcription
    
    console.log('🔧 currentTranscription définie:', !!currentTranscription.value)
    
    // Mapper hash -> transcription ID
    hashToTranscriptionId.value.set(fileMetadata.hash, transcription.id)
    
    saveTranscriptions()
    
    // Ajouter à l'historique
    addToHistory(transcription)
    
    return transcription
  }
  
  const getCacheStats = () => {
    return {
      totalCached: fileHashCache.value.size,
      cacheHits: transcriptions.value.filter(t => t.fromCache).length,
      cacheSize: JSON.stringify(Object.fromEntries(fileHashCache.value)).length
    }
  }
  
  const clearCache = () => {
    fileHashCache.value.clear()
    hashToTranscriptionId.value.clear()
    saveHashCache()
  }

  // Import/Export
  const exportTranscriptions = () => {
    return JSON.stringify({
      transcriptions: transcriptions.value,
      history: transcriptionHistory.value,
      cache: Object.fromEntries(fileHashCache.value),
      cacheMapping: Object.fromEntries(hashToTranscriptionId.value),
      exportedAt: new Date()
    }, null, 2)
  }

  const importTranscriptions = (jsonData, replaceExisting = false) => {
    try {
      const data = JSON.parse(jsonData)
      
      if (replaceExisting) {
        transcriptions.value = data.transcriptions || []
        transcriptionHistory.value = data.history || []
        fileHashCache.value = new Map(Object.entries(data.cache || {}))
        hashToTranscriptionId.value = new Map(Object.entries(data.cacheMapping || {}))
      } else {
        // Éviter les doublons
        const existingIds = new Set(transcriptions.value.map(t => t.id))
        const newTranscriptions = (data.transcriptions || []).filter(t => !existingIds.has(t.id))
        transcriptions.value.push(...newTranscriptions)
        
        const existingHistoryIds = new Set(transcriptionHistory.value.map(h => h.id))
        const newHistory = (data.history || []).filter(h => !existingHistoryIds.has(h.id))
        transcriptionHistory.value.push(...newHistory)
        
        // Importer le cache
        if (data.cache) {
          Object.entries(data.cache).forEach(([hash, cacheData]) => {
            if (!fileHashCache.value.has(hash)) {
              fileHashCache.value.set(hash, cacheData)
            }
          })
        }
        
        if (data.cacheMapping) {
          Object.entries(data.cacheMapping).forEach(([hash, transcriptionId]) => {
            if (!hashToTranscriptionId.value.has(hash)) {
              hashToTranscriptionId.value.set(hash, transcriptionId)
            }
          })
        }
      }
      
      saveTranscriptions()
      saveHistory()
      saveHashCache()
      
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
  
  const saveHashCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-file-hash-cache', JSON.stringify(Object.fromEntries(fileHashCache.value)))
      localStorage.setItem('jap-hash-to-transcription', JSON.stringify(Object.fromEntries(hashToTranscriptionId.value)))
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
      
      // Charger le cache des hash
      const savedCache = localStorage.getItem('jap-file-hash-cache')
      if (savedCache) {
        try {
          const parsed = JSON.parse(savedCache)
          fileHashCache.value = new Map(Object.entries(parsed))
        } catch (error) {
          console.warn('Failed to load file hash cache:', error)
        }
      }
      
      const savedMapping = localStorage.getItem('jap-hash-to-transcription')
      if (savedMapping) {
        try {
          const parsed = JSON.parse(savedMapping)
          hashToTranscriptionId.value = new Map(Object.entries(parsed))
        } catch (error) {
          console.warn('Failed to load hash to transcription mapping:', error)
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
    fileHashCache,
    
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
    
    // Cache et déduplication
    findCachedTranscription,
    createTranscriptionFromCache,
    getCacheStats,
    clearCache,
    
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
    saveHashCache,
    loadTranscriptions
  }
})