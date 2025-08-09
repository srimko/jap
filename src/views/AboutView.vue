<template>
  <UContainer>
    <div class="max-w-6xl mx-auto">
      <!-- En-tête principal -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🇯🇵 À propos de <span class="text-blue-600">JAP</span>
        </h1>
        <p class="text-xl text-gray-600 leading-relaxed">
          こんにちは！Votre assistant personnel pour l'apprentissage du japonais
        </p>
      </div>

      <!-- Histoire du projet -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <UIcon name="i-heroicons-heart" class="text-red-500 mr-3" />
            L'histoire du projet
          </h2>
          <div class="prose prose-gray">
            <p class="text-gray-700 leading-relaxed mb-4">
              Comme beaucoup d'apprenants de japonais, j'ai rapidement découvert que <strong>la lecture et la compréhension des phrases complètes</strong> représentent l'un des plus grands défis de cette langue fascinante.
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              Face à cette difficulté, j'ai décidé de créer un outil qui m'aiderait (et aiderait d'autres passionnés) à <strong>décortiquer et comprendre le japonais, phrase par phrase</strong>.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Ce qui a commencé comme une simple idée s'est transformé en une application complète avec des fonctionnalités avancées d'apprentissage.
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <UIcon name="i-heroicons-light-bulb" class="text-yellow-500 mr-3" />
            Vision et objectif
          </h2>
          <div class="prose prose-gray">
            <p class="text-gray-700 leading-relaxed mb-4">
              <strong>Rendre l'apprentissage du japonais accessible</strong> en combinant technologie moderne et méthodes pédagogiques éprouvées.
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              Notre approche se base sur l'<strong>apprentissage contextuel</strong> : comprendre le japonais dans des situations réelles plutôt que par des règles abstraites.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Chaque fonctionnalité est conçue pour faciliter la <strong>progression naturelle</strong> de l'apprenant, du niveau débutant au niveau avancé.
            </p>
          </div>
        </div>
      </div>

      <!-- Fonctionnalités principales -->
      <div class="mb-16">
        <h2 class="text-3xl font-semibold text-center text-gray-900 mb-8">
          🛠️ Fonctionnalités de l'application
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Transcription & Analyse -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-microphone" class="text-blue-600 text-2xl mr-3" />
                <h3 class="font-semibold">Transcription IA</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• Transcription audio via OpenAI Whisper</li>
              <li>• Analyse linguistique avec GPT-4</li>
              <li>• Segmentation kanji/hiragana/romaji</li>
              <li>• Traduction contextuelle française</li>
              <li>• Cache intelligent pour éviter les redondances</li>
            </ul>
          </UCard>

          <!-- Hiragana -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-academic-cap" class="text-purple-600 text-2xl mr-3" />
                <h3 class="font-semibold">Apprentissage Hiragana</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• 45 hiragana avec fichiers audio authentiques</li>
              <li>• Audio provenant de <a href="https://www.thoughtco.com/how-to-pronounce-hiragana-japanese-hiragana-with-audio-files-4077351" target="_blank" class="text-blue-600 hover:underline">ThoughtCo.com</a></li>
              <li>• Mode entraînement avec masquage</li>
              <li>• Lecture séquentielle et par lignes</li>
              <li>• Interface interactive responsive</li>
            </ul>
          </UCard>

          <!-- Répétition Espacée -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-arrow-path" class="text-green-600 text-2xl mr-3" />
                <h3 class="font-semibold">Système SM2</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• Algorithme de répétition espacée scientifique</li>
              <li>• Cartes flash personnalisables</li>
              <li>• Statistiques de rétention détaillées</li>
              <li>• Sessions d'étude optimisées</li>
              <li>• Suivi des progrès à long terme</li>
            </ul>
          </UCard>

          <!-- Podcasts -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-musical-note" class="text-orange-600 text-2xl mr-3" />
                <h3 class="font-semibold">Podcasts Intégrés</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• Catalogue Nihongo con Teppei complet</li>
              <li>• Téléchargement direct des épisodes</li>
              <li>• Recherche et filtrage avancés</li>
              <li>• Statistiques d'écoute détaillées</li>
              <li>• Intégration avec transcription</li>
            </ul>
          </UCard>

          <!-- Historique -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-clock" class="text-indigo-600 text-2xl mr-3" />
                <h3 class="font-semibold">Gestion & Historique</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• Historique complet des transcriptions</li>
              <li>• Recherche dans le contenu analysé</li>
              <li>• Export/import des données</li>
              <li>• Dashboard avec métriques</li>
              <li>• Sauvegarde locale persistante</li>
            </ul>
          </UCard>

          <!-- Performance -->
          <UCard class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-bolt" class="text-yellow-600 text-2xl mr-3" />
                <h3 class="font-semibold">Performance & UX</h3>
              </div>
            </template>
            <ul class="text-sm space-y-2 text-gray-600">
              <li>• Architecture Vue 3 + Composition API</li>
              <li>• Cache SHA-256 pour performances</li>
              <li>• Interface responsive moderne</li>
              <li>• Animations et transitions fluides</li>
              <li>• Feedback utilisateur en temps réel</li>
            </ul>
          </UCard>
        </div>
      </div>

      <!-- Sources et inspiration -->
      <div class="mb-16">
        <h2 class="text-3xl font-semibold text-center text-gray-900 mb-8">
          📚 Sources d'inspiration
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UCard class="border-l-4 border-blue-500">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-radio" class="text-blue-600 text-2xl mr-3" />
                <h3 class="font-semibold">Nihongo con Teppei</h3>
              </div>
            </template>
            <div class="space-y-3">
              <p class="text-gray-700 text-sm">
                Podcast japonais de référence pour les apprenants débutants à intermédiaires. 
                Teppei explique les concepts en japonais simple avec une diction claire.
              </p>
              <div class="flex items-center space-x-4">
                <UButton
                  @click="openNihongoSite"
                  color="blue"
                  variant="outline"
                  size="sm"
                >
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="mr-1" />
                  Visiter le site
                </UButton>
                <UButton
                  to="/podcasts"
                  color="purple"
                  variant="soft"
                  size="sm"
                >
                  <UIcon name="i-heroicons-musical-note" class="mr-1" />
                  Parcourir les épisodes
                </UButton>
              </div>
            </div>
          </UCard>

          <UCard class="border-l-4 border-green-500">
            <template #header>
              <div class="flex items-center">
                <UIcon name="i-heroicons-beaker" class="text-green-600 text-2xl mr-3" />
                <h3 class="font-semibold">Méthodes scientifiques</h3>
              </div>
            </template>
            <div class="space-y-3">
              <p class="text-gray-700 text-sm">
                Algorithme SM2 (SuperMemo) pour la répétition espacée, techniques d'apprentissage
                contextuel, et intégration d'IA moderne pour l'analyse linguistique.
              </p>
              <div class="flex flex-wrap gap-2">
                <UBadge color="green" size="xs">Répétition espacée</UBadge>
                <UBadge color="blue" size="xs">IA conversationnelle</UBadge>
                <UBadge color="purple" size="xs">Apprentissage contextuel</UBadge>
                <UBadge color="orange" size="xs">Immersion audio</UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Statistiques d'utilisation -->
      <div class="mb-16">
        <h2 class="text-3xl font-semibold text-center text-gray-900 mb-8">
          📊 L'application en chiffres
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center p-6 bg-blue-50 rounded-lg">
            <div class="text-3xl font-bold text-blue-600 mb-2">5+</div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">Pages fonctionnelles</div>
          </div>
          
          <div class="text-center p-6 bg-purple-50 rounded-lg">
            <div class="text-3xl font-bold text-purple-600 mb-2">79</div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">Hiragana disponibles</div>
          </div>
          
          <div class="text-center p-6 bg-green-50 rounded-lg">
            <div class="text-3xl font-bold text-green-600 mb-2">1400+</div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">Épisodes podcasts</div>
          </div>
          
          <div class="text-center p-6 bg-orange-50 rounded-lg">
            <div class="text-3xl font-bold text-orange-600 mb-2">∞</div>
            <div class="text-sm text-gray-600 uppercase tracking-wide">Possibilités d'apprentissage</div>
          </div>
        </div>
      </div>

      <!-- Technologies utilisées -->
      <div class="mb-16">
        <h2 class="text-3xl font-semibold text-center text-gray-900 mb-8">
          ⚙️ Technologies utilisées
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">V</span>
            </div>
            <span class="font-medium">Vue.js 3</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">P</span>
            </div>
            <span class="font-medium">Pinia</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">T</span>
            </div>
            <span class="font-medium">Tailwind CSS</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">V</span>
            </div>
            <span class="font-medium">Vite</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">AI</span>
            </div>
            <span class="font-medium">OpenAI API</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">W</span>
            </div>
            <span class="font-medium">Web Speech API</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">S</span>
            </div>
            <span class="font-medium">SHA-256</span>
          </div>
          
          <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
              <span class="text-white text-sm font-bold">LS</span>
            </div>
            <span class="font-medium">LocalStorage</span>
          </div>
        </div>
      </div>

      <!-- Comment commencer -->
      <div class="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 class="text-3xl font-semibold text-gray-900 mb-4">
          🚀 Prêt à commencer votre apprentissage ?
        </h2>
        <p class="text-gray-700 mb-6 max-w-2xl mx-auto">
          Explorez toutes les fonctionnalités de l'application pour découvrir une nouvelle façon d'apprendre le japonais.
        </p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <UButton to="/" color="blue" size="lg">
            <UIcon name="i-heroicons-microphone" class="mr-2" />
            Commencer une transcription
          </UButton>
          
          <UButton to="/hiragana" color="purple" variant="outline" size="lg">
            <UIcon name="i-heroicons-academic-cap" class="mr-2" />
            Apprendre les hiragana
          </UButton>
          
          <UButton to="/podcasts" color="green" variant="outline" size="lg">
            <UIcon name="i-heroicons-musical-note" class="mr-2" />
            Explorer les podcasts
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
// Fonction pour ouvrir le site Nihongo con Teppei
const openNihongoSite = () => {
  window.open('https://nihongoconteppei.com/', '_blank')
}
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation des cartes au scroll */
.hover\\:shadow-lg {
  transition: all 0.3s ease;
}

/* Animations spéciales pour les statistiques */
.bg-blue-50, .bg-purple-50, .bg-green-50, .bg-orange-50 {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-blue-50:hover, .bg-purple-50:hover, .bg-green-50:hover, .bg-orange-50:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Style pour les badges */
.prose {
  color: inherit;
}

.prose strong {
  color: #1f2937;
  font-weight: 600;
}

/* Responsive amélioré */
@media (max-width: 768px) {
  .grid.grid-cols-2.md\\:grid-cols-4 {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .text-4xl {
    font-size: 2.5rem;
  }
  
  .text-3xl {
    font-size: 2rem;
  }
}

/* Amélioration du contraste */
.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

/* Animation des boutons CTA */
.bg-gradient-to-r {
  position: relative;
  overflow: hidden;
}

.bg-gradient-to-r::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.bg-gradient-to-r:hover::before {
  left: 100%;
}
</style>
