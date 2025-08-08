import { ref, computed } from 'vue'

export function useSM2(initialCards = []) {
  const cards = ref(initialCards)
  const currentIndex = ref(0)
  const showBack = ref(false)

  const today = () => new Date()
  
  const dueCards = computed(() => 
    cards.value.filter((c) => c.dueDate <= today())
  )
  
  const currentCard = computed(() => 
    dueCards.value[currentIndex.value]
  )

  const updateCard = (card, quality) => {
    if (quality < 3) {
      card.repetitions = 0
      card.interval = 1
    } else {
      card.repetitions++
      if (card.repetitions === 1) card.interval = 1
      else if (card.repetitions === 2) card.interval = 6
      else card.interval = Math.round(card.interval * card.easiness)
    }
    
    card.easiness += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    card.easiness = Math.max(1.3, card.easiness)
    card.dueDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000)
  }

  const rate = (quality) => {
    updateCard(currentCard.value, quality)
    showBack.value = false
    
    if (currentIndex.value + 1 < dueCards.value.length) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
  }

  const toggleShowBack = () => {
    showBack.value = !showBack.value
  }

  return {
    cards,
    currentIndex,
    showBack,
    dueCards,
    currentCard,
    rate,
    toggleShowBack
  }
}