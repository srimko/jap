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
          
          <!-- Statistiques de session -->
          <div v-if="statistics.sessionStats.isActive" class="mt-4 p-3 bg-blue-50 rounded">
            <p class="text-sm text-blue-700">
              🏆 Session: {{ statistics.sessionStats.cardsStudied }} cartes étudiées
              • {{ Math.round((statistics.sessionStats.correctAnswers / Math.max(1, statistics.sessionStats.cardsStudied)) * 100) }}% de réussite
            </p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center">
        <UCard>
          <template #header>
            <h3 class="text-xl font-bold">🎉 Session terminée !</h3>
          </template>
          
          <div class="space-y-4">
            <p class="text-lg">Toutes les cartes sont à jour pour aujourd'hui !</p>
            
            <!-- Statistiques globales -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 p-3 rounded">
                <p class="font-semibold text-gray-600">Total cartes</p>
                <p class="text-2xl font-bold text-blue-600">{{ statistics.total }}</p>
              </div>
              
              <div class="bg-gray-50 p-3 rounded">
                <p class="font-semibold text-gray-600">Étudiées aujourd'hui</p>
                <p class="text-2xl font-bold text-green-600">{{ statistics.studiedToday }}</p>
              </div>
            </div>
            
            <UButton 
              v-if="statistics.total > 0"
              @click="startStudySession"
              color="blue"
              label="Nouvelle session"
            />
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { useCardsStore } from '@/stores/cards'
import { onMounted } from 'vue'

const cardsStore = useCardsStore()

const {
  dueCards,
  currentCard,
  showBack,
  statistics,
  rate,
  toggleShowBack,
  startStudySession
} = cardsStore

onMounted(() => {
  if (dueCards.length > 0 && !cardsStore.studySession.isActive) {
    startStudySession()
  }
})
</script>
