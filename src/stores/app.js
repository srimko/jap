import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // État global de l'application
  const isLoading = ref(false)
  const error = ref('')
  const theme = ref('light')
  const language = ref('fr')
  
  // Préférences utilisateur
  const preferences = ref({
    autoSave: true,
    showRomaji: true,
    showKanji: true,
    showHiragana: true,
    playbackSpeed: 1.0,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxDuration: 600, // 10 minutes
  })

  // Actions globales
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
    if (errorMessage) {
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        if (error.value === errorMessage) {
          error.value = ''
        }
      }, 5000)
    }
  }

  const clearError = () => {
    error.value = ''
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-theme', newTheme)
    }
  }

  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences }
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-preferences', JSON.stringify(preferences.value))
    }
  }

  const loadPreferences = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('jap-theme')
      if (savedTheme) {
        theme.value = savedTheme
      }

      const savedPreferences = localStorage.getItem('jap-preferences')
      if (savedPreferences) {
        try {
          preferences.value = { ...preferences.value, ...JSON.parse(savedPreferences) }
        } catch (err) {
          console.warn('Failed to load preferences:', err)
        }
      }
    }
  }

  // Initialiser les préférences au démarrage
  loadPreferences()

  return {
    // État
    isLoading,
    error,
    theme,
    language,
    preferences,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setTheme,
    updatePreferences,
    loadPreferences
  }
})