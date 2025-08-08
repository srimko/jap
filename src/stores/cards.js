import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCardsStore = defineStore('cards', () => {
  // État des cartes
  const cards = ref([])
  const currentIndex = ref(0)
  const showBack = ref(false)
  const studySession = ref({
    startTime: null,
    cardsStudied: 0,
    correctAnswers: 0,
    isActive: false
  })

  // Computed
  const today = () => new Date()
  
  const dueCards = computed(() => 
    cards.value.filter((card) => card.dueDate <= today())
  )
  
  const currentCard = computed(() => 
    dueCards.value[currentIndex.value]
  )

  const totalCards = computed(() => cards.value.length)
  
  const studiedToday = computed(() => 
    cards.value.filter(card => {
      const today = new Date()
      const cardDate = new Date(card.lastStudied || 0)
      return cardDate.toDateString() === today.toDateString()
    }).length
  )

  const statistics = computed(() => ({
    total: totalCards.value,
    due: dueCards.value.length,
    studiedToday: studiedToday.value,
    averageEasiness: cards.value.length > 0 
      ? cards.value.reduce((sum, card) => sum + card.easiness, 0) / cards.value.length 
      : 0,
    sessionStats: studySession.value
  }))

  // Actions SM2
  const updateCard = (card, quality) => {
    const now = new Date()
    card.lastStudied = now

    if (quality < 3) {
      card.repetitions = 0
      card.interval = 1
    } else {
      card.repetitions++
      if (card.repetitions === 1) {
        card.interval = 1
      } else if (card.repetitions === 2) {
        card.interval = 6
      } else {
        card.interval = Math.round(card.interval * card.easiness)
      }
    }
    
    card.easiness += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    card.easiness = Math.max(1.3, card.easiness)
    card.dueDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000)

    // Mettre à jour les statistiques de session
    if (studySession.value.isActive) {
      studySession.value.cardsStudied++
      if (quality >= 3) {
        studySession.value.correctAnswers++
      }
    }

    saveCards()
  }

  const rate = (quality) => {
    if (!currentCard.value) return

    updateCard(currentCard.value, quality)
    showBack.value = false
    
    if (currentIndex.value + 1 < dueCards.value.length) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
      // Fin de session si plus de cartes
      if (dueCards.value.length === 0) {
        endStudySession()
      }
    }
  }

  const toggleShowBack = () => {
    showBack.value = !showBack.value
  }

  // Gestion des cartes
  const addCard = (cardData) => {
    const newCard = {
      id: Date.now().toString(),
      front: cardData.front,
      back: cardData.back,
      category: cardData.category || 'general',
      tags: cardData.tags || [],
      easiness: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: new Date(),
      createdAt: new Date(),
      lastStudied: null
    }
    
    cards.value.push(newCard)
    saveCards()
    return newCard
  }

  const updateCardData = (cardId, cardData) => {
    const cardIndex = cards.value.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      cards.value[cardIndex] = { ...cards.value[cardIndex], ...cardData }
      saveCards()
    }
  }

  const deleteCard = (cardId) => {
    const cardIndex = cards.value.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      cards.value.splice(cardIndex, 1)
      saveCards()
    }
  }

  const resetCard = (cardId) => {
    const card = cards.value.find(card => card.id === cardId)
    if (card) {
      card.easiness = 2.5
      card.interval = 0
      card.repetitions = 0
      card.dueDate = new Date()
      card.lastStudied = null
      saveCards()
    }
  }

  // Gestion des sessions d'étude
  const startStudySession = () => {
    studySession.value = {
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      isActive: true
    }
    currentIndex.value = 0
    showBack.value = false
  }

  const endStudySession = () => {
    if (studySession.value.isActive) {
      const session = { ...studySession.value }
      session.endTime = new Date()
      session.isActive = false
      
      // Sauvegarder l'historique des sessions
      const sessions = getSessions()
      sessions.push(session)
      if (typeof window !== 'undefined') {
        localStorage.setItem('jap-study-sessions', JSON.stringify(sessions))
      }
      
      studySession.value.isActive = false
    }
  }

  const getSessions = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jap-study-sessions')
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  // Import/Export
  const exportCards = () => {
    return JSON.stringify(cards.value, null, 2)
  }

  const importCards = (jsonData, replaceExisting = false) => {
    try {
      const importedCards = JSON.parse(jsonData)
      
      if (replaceExisting) {
        cards.value = importedCards
      } else {
        // Éviter les doublons par ID
        const existingIds = new Set(cards.value.map(card => card.id))
        const newCards = importedCards.filter(card => !existingIds.has(card.id))
        cards.value.push(...newCards)
      }
      
      saveCards()
      return { success: true, imported: importedCards.length }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Persistance
  const saveCards = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jap-cards', JSON.stringify(cards.value))
    }
  }

  const loadCards = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jap-cards')
      if (saved) {
        try {
          const parsedCards = JSON.parse(saved)
          // Convertir les dates string en objets Date
          cards.value = parsedCards.map(card => ({
            ...card,
            dueDate: new Date(card.dueDate),
            createdAt: new Date(card.createdAt),
            lastStudied: card.lastStudied ? new Date(card.lastStudied) : null
          }))
        } catch (error) {
          console.warn('Failed to load cards:', error)
          // Charger les cartes par défaut
          loadDefaultCards()
        }
      } else {
        loadDefaultCards()
      }
    }
  }

  const loadDefaultCards = () => {
    const defaultCards = [
      {
        id: '1',
        front: 'こんにちは',
        back: 'Bonjour',
        category: 'salutations',
        tags: ['basique'],
        easiness: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        lastStudied: null
      },
      {
        id: '2',
        front: 'ありがとう',
        back: 'Merci',
        category: 'salutations',
        tags: ['basique'],
        easiness: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        lastStudied: null
      },
      {
        id: '3',
        front: 'さようなら',
        back: 'Au revoir',
        category: 'salutations',
        tags: ['basique'],
        easiness: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        lastStudied: null
      }
    ]
    
    cards.value = defaultCards
    saveCards()
  }

  // Initialiser les cartes au démarrage
  loadCards()

  return {
    // État
    cards,
    currentIndex,
    showBack,
    studySession,
    
    // Computed
    dueCards,
    currentCard,
    totalCards,
    studiedToday,
    statistics,
    
    // Actions SM2
    rate,
    toggleShowBack,
    updateCard,
    
    // Gestion des cartes
    addCard,
    updateCardData,
    deleteCard,
    resetCard,
    
    // Sessions d'étude
    startStudySession,
    endStudySession,
    getSessions,
    
    // Import/Export
    exportCards,
    importCards,
    
    // Persistance
    saveCards,
    loadCards,
    loadDefaultCards
  }
})