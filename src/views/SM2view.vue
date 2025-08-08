<template>
  <div class="p-4">
    <div v-if="dueCards.length">
      <div class="mb-4">
        <h2 class="text-xl font-bold">{{ currentCard.front }}</h2>
        <button @click="showBack = !showBack" class="mt-2 underline">
          {{ showBack ? 'Cacher' : 'Voir la réponse' }}
        </button>
        <p v-if="showBack" class="mt-2">{{ currentCard.back }}</p>
      </div>
      <div>
        <span class="block mb-1">Évaluez votre réponse :</span>
        <div class="space-x-2">
          <button v-for="n in 6" :key="n - 1" @click="rate(n - 1)" class="px-2 py-1 border rounded">
            {{ n - 1 }}
          </button>
        </div>
      </div>
    </div>
    <p v-else>Toutes les cartes sont à jour pour aujourd'hui.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Exemple de jeu de cartes
const cards = ref([
  {
    id: '1',
    front: 'Bonjour',
    back: 'Hello',
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
  },
  // Ajoutez vos cartes ici
])

const today = () => new Date()
const dueCards = computed(() => cards.value.filter((c) => c.dueDate <= today()))
const currentIndex = ref(0)
const currentCard = computed(() => dueCards.value[currentIndex.value])
const showBack = ref(false)

function updateCard(card, quality) {
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

function rate(q) {
  updateCard(currentCard.value, q)
  showBack.value = false
  // Passage à la carte suivante ou reset
  if (currentIndex.value + 1 < dueCards.value.length) currentIndex.value++
  else currentIndex.value = 0
}
</script>
