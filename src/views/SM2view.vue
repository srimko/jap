<template>
  <UContainer>
    <div class="max-w-2xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Système de répétition espacée SM2</h2>
      
      <div v-if="dueCards.length">
        <div class="mb-6">
          <UCard>
            <template #header>
              <h3 class="text-xl font-bold">{{ currentCard.front }}</h3>
            </template>
            
            <div class="text-center">
              <UButton 
                @click="toggleShowBack" 
                class="mb-4"
                :label="showBack ? 'Cacher la réponse' : 'Voir la réponse'"
              />
              
              <p v-if="showBack" class="text-lg bg-gray-50 p-4 rounded">
                {{ currentCard.back }}
              </p>
            </div>
          </UCard>
        </div>
        
        <div v-if="showBack">
          <p class="block mb-3 font-semibold">Évaluez la difficulté de votre réponse :</p>
          <div class="grid grid-cols-6 gap-2">
            <UButton 
              v-for="n in 6" 
              :key="n - 1" 
              @click="rate(n - 1)"
              variant="outline"
              size="sm"
              :label="(n - 1).toString()"
            />
          </div>
          <p class="text-sm text-gray-600 mt-2">
            0 = Échec total • 5 = Parfait
          </p>
        </div>
      </div>
      
      <div v-else class="text-center">
        <UCard>
          <p class="text-lg">🎉 Toutes les cartes sont à jour pour aujourd'hui !</p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { useSM2 } from '@/composables/useSM2'

const initialCards = [
  {
    id: '1',
    front: 'こんにちは',
    back: 'Bonjour',
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
  },
  {
    id: '2',
    front: 'ありがとう',
    back: 'Merci',
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
  }
]

const {
  dueCards,
  currentCard,
  showBack,
  rate,
  toggleShowBack
} = useSM2(initialCards)
</script>
