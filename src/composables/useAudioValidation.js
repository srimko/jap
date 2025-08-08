import { ref } from 'vue'

export function useAudioValidation() {
  const validationError = ref('')
  const isValidating = ref(false)

  // Configuration des limites
  const VALIDATION_CONFIG = {
    allowedTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/mp4',
      'audio/m4a',
      'audio/x-m4a',
      'audio/ogg',
      'audio/webm',
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    maxDuration: 600, // 10 minutes en secondes
    minDuration: 1, // 1 seconde minimum
  }

  const validateFileType = (file) => {
    if (!file) return { isValid: false, error: 'Aucun fichier sélectionné' }

    console.log('Validating file type:', file.type)

    const isValidType = VALIDATION_CONFIG.allowedTypes.includes(file.type)
    if (!isValidType) {
      return {
        isValid: false,
        error: `Format non supporté. Formats acceptés: ${VALIDATION_CONFIG.allowedTypes.map((type) => type.split('/')[1]).join(', ')}`,
      }
    }

    return { isValid: true }
  }

  const validateFileSize = (file) => {
    if (file.size > VALIDATION_CONFIG.maxSize) {
      const maxSizeMB = Math.round(VALIDATION_CONFIG.maxSize / (1024 * 1024))
      const fileSizeMB = Math.round(file.size / (1024 * 1024))
      return {
        isValid: false,
        error: `Fichier trop volumineux (${fileSizeMB}MB). Taille maximum: ${maxSizeMB}MB`,
      }
    }

    return { isValid: true }
  }

  const validateAudioDuration = async (file) => {
    return new Promise((resolve) => {
      const audio = new Audio()
      const objectUrl = URL.createObjectURL(file)

      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration
        URL.revokeObjectURL(objectUrl)

        if (isNaN(duration)) {
          resolve({
            isValid: false,
            error: 'Impossible de lire la durée du fichier audio',
          })
          return
        }

        if (duration < VALIDATION_CONFIG.minDuration) {
          resolve({
            isValid: false,
            error: `Fichier audio trop court (${Math.round(duration)}s). Duration minimum: ${VALIDATION_CONFIG.minDuration}s`,
          })
          return
        }

        if (duration > VALIDATION_CONFIG.maxDuration) {
          const maxMinutes = Math.round(VALIDATION_CONFIG.maxDuration / 60)
          const fileMinutes = Math.round(duration / 60)
          resolve({
            isValid: false,
            error: `Fichier audio trop long (${fileMinutes}min). Durée maximum: ${maxMinutes}min`,
          })
          return
        }

        resolve({ isValid: true, duration })
      })

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl)
        resolve({
          isValid: false,
          error: 'Fichier audio corrompu ou non lisible',
        })
      })

      audio.src = objectUrl
    })
  }

  const validateAudioFile = async (file) => {
    validationError.value = ''
    isValidating.value = true

    try {
      // Validation du type
      const typeValidation = validateFileType(file)
      if (!typeValidation.isValid) {
        validationError.value = typeValidation.error
        return { isValid: false, error: typeValidation.error }
      }

      // Validation de la taille
      const sizeValidation = validateFileSize(file)
      if (!sizeValidation.isValid) {
        validationError.value = sizeValidation.error
        return { isValid: false, error: sizeValidation.error }
      }

      // Validation de la durée (asynchrone)
      const durationValidation = await validateAudioDuration(file)
      if (!durationValidation.isValid) {
        validationError.value = durationValidation.error
        return { isValid: false, error: durationValidation.error }
      }

      return {
        isValid: true,
        duration: durationValidation.duration,
        size: file.size,
        type: file.type,
        name: file.name,
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la validation du fichier'
      validationError.value = errorMessage
      console.error('Validation error:', err)
      return { isValid: false, error: errorMessage }
    } finally {
      isValidating.value = false
    }
  }

  const clearValidationError = () => {
    validationError.value = ''
  }

  const getFileSizeFormatted = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDurationFormatted = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return {
    validationError,
    isValidating,
    validateAudioFile,
    clearValidationError,
    getFileSizeFormatted,
    getDurationFormatted,
    VALIDATION_CONFIG,
  }
}
