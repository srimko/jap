import { ref, computed } from 'vue'

export function useHiragana() {
  const showRomaji = ref(true)
  const playOnHover = ref(false)
  const currentPlaying = ref(null)

  // Données hiragana structurées par lignes (basées sur le fichier kanji.html)
  const hiraganaGrid = ref([
    [
      { char: 'あ', romaji: 'a' },
      { char: 'い', romaji: 'i' },
      { char: 'う', romaji: 'u' },
      { char: 'え', romaji: 'e' },
      { char: 'お', romaji: 'o' }
    ],
    [
      { char: 'か', romaji: 'ka' },
      { char: 'き', romaji: 'ki' },
      { char: 'く', romaji: 'ku' },
      { char: 'け', romaji: 'ke' },
      { char: 'こ', romaji: 'ko' }
    ],
    [
      { char: 'が', romaji: 'ga' },
      { char: 'ぎ', romaji: 'gi' },
      { char: 'ぐ', romaji: 'gu' },
      { char: 'げ', romaji: 'ge' },
      { char: 'ご', romaji: 'go' }
    ],
    [
      { char: 'さ', romaji: 'sa' },
      { char: 'し', romaji: 'shi' },
      { char: 'す', romaji: 'su' },
      { char: 'せ', romaji: 'se' },
      { char: 'そ', romaji: 'so' }
    ],
    [
      { char: 'ざ', romaji: 'za' },
      { char: 'じ', romaji: 'ji' },
      { char: 'ず', romaji: 'zu' },
      { char: 'ぜ', romaji: 'ze' },
      { char: 'ぞ', romaji: 'zo' }
    ],
    [
      { char: 'た', romaji: 'ta' },
      { char: 'ち', romaji: 'chi' },
      { char: 'つ', romaji: 'tsu' },
      { char: 'て', romaji: 'te' },
      { char: 'と', romaji: 'to' }
    ],
    [
      { char: 'だ', romaji: 'da' },
      { char: 'ぢ', romaji: 'ji' },
      { char: 'づ', romaji: 'zu' },
      { char: 'で', romaji: 'de' },
      { char: 'ど', romaji: 'do' }
    ],
    [
      { char: 'な', romaji: 'na' },
      { char: 'に', romaji: 'ni' },
      { char: 'ぬ', romaji: 'nu' },
      { char: 'ね', romaji: 'ne' },
      { char: 'の', romaji: 'no' }
    ],
    [
      { char: 'は', romaji: 'ha' },
      { char: 'ひ', romaji: 'hi' },
      { char: 'ふ', romaji: 'fu' },
      { char: 'へ', romaji: 'he' },
      { char: 'ほ', romaji: 'ho' }
    ],
    [
      { char: 'ば', romaji: 'ba' },
      { char: 'び', romaji: 'bi' },
      { char: 'ぶ', romaji: 'bu' },
      { char: 'べ', romaji: 'be' },
      { char: 'ぼ', romaji: 'bo' }
    ],
    [
      { char: 'ぱ', romaji: 'pa' },
      { char: 'ぴ', romaji: 'pi' },
      { char: 'ぷ', romaji: 'pu' },
      { char: 'ぺ', romaji: 'pe' },
      { char: 'ぽ', romaji: 'po' }
    ],
    [
      { char: 'ま', romaji: 'ma' },
      { char: 'み', romaji: 'mi' },
      { char: 'む', romaji: 'mu' },
      { char: 'め', romaji: 'me' },
      { char: 'も', romaji: 'mo' }
    ],
    [
      { char: 'や', romaji: 'ya' },
      null, // case vide
      { char: 'ゆ', romaji: 'yu' },
      null, // case vide
      { char: 'よ', romaji: 'yo' }
    ],
    [
      { char: 'ら', romaji: 'ra' },
      { char: 'り', romaji: 'ri' },
      { char: 'る', romaji: 'ru' },
      { char: 'れ', romaji: 're' },
      { char: 'ろ', romaji: 'ro' }
    ],
    [
      { char: 'わ', romaji: 'wa' },
      null, // case vide
      null, // case vide
      null, // case vide
      { char: 'を', romaji: 'wo' }
    ],
    [
      { char: 'ん', romaji: 'n' },
      null, // case vide
      null, // case vide
      null, // case vide
      null  // case vide
    ]
  ])

  // Hiragana combinés (ya, yu, yo)
  const combinationsGrid = ref([
    [
      { char: 'きゃ', romaji: 'kya' },
      { char: 'きゅ', romaji: 'kyu' },
      { char: 'きょ', romaji: 'kyo' }
    ],
    [
      { char: 'しゃ', romaji: 'sha' },
      { char: 'しゅ', romaji: 'shu' },
      { char: 'しょ', romaji: 'sho' }
    ],
    [
      { char: 'ちゃ', romaji: 'cha' },
      { char: 'ちゅ', romaji: 'chu' },
      { char: 'ちょ', romaji: 'cho' }
    ],
    [
      { char: 'にゃ', romaji: 'nya' },
      { char: 'にゅ', romaji: 'nyu' },
      { char: 'にょ', romaji: 'nyo' }
    ],
    [
      { char: 'ひゃ', romaji: 'hya' },
      { char: 'ひゅ', romaji: 'hyu' },
      { char: 'ひょ', romaji: 'hyo' }
    ],
    [
      { char: 'みゃ', romaji: 'mya' },
      { char: 'みゅ', romaji: 'myu' },
      { char: 'みょ', romaji: 'myo' }
    ],
    [
      { char: 'りゃ', romaji: 'rya' },
      { char: 'りゅ', romaji: 'ryu' },
      { char: 'りょ', romaji: 'ryo' }
    ],
    [
      { char: 'ぎゃ', romaji: 'gya' },
      { char: 'ぎゅ', romaji: 'gyu' },
      { char: 'ぎょ', romaji: 'gyo' }
    ],
    [
      { char: 'じゃ', romaji: 'ja' },
      { char: 'じゅ', romaji: 'ju' },
      { char: 'じょ', romaji: 'jo' }
    ],
    [
      { char: 'びゃ', romaji: 'bya' },
      { char: 'びゅ', romaji: 'byu' },
      { char: 'びょ', romaji: 'byo' }
    ],
    [
      { char: 'ぴゃ', romaji: 'pya' },
      { char: 'ぴゅ', romaji: 'pyu' },
      { char: 'ぴょ', romaji: 'pyo' }
    ]
  ])

  // Vue actuelle (basic ou combinations)
  const currentView = ref('basic')

  // Grille actuelle basée sur la vue
  const currentGrid = computed(() => {
    return currentView.value === 'basic' ? hiraganaGrid.value : combinationsGrid.value
  })

  // Liste plate de tous les hiragana (pour recherche)
  const allHiragana = computed(() => {
    const basic = hiraganaGrid.value.flat().filter(Boolean)
    const combinations = combinationsGrid.value.flat().filter(Boolean)
    return [...basic, ...combinations]
  })

  // Statistiques
  const statistics = computed(() => ({
    basicCount: hiraganaGrid.value.flat().filter(Boolean).length,
    combinationsCount: combinationsGrid.value.flat().filter(Boolean).length,
    totalCount: allHiragana.value.length
  }))

  // Synthèse vocale pour la prononciation
  const speakHiragana = (hiragana) => {
    if (!hiragana) return

    if ('speechSynthesis' in window) {
      // Annuler toute synthèse en cours
      speechSynthesis.cancel()
      
      // Indiquer quel hiragana est en cours de lecture
      currentPlaying.value = hiragana.char
      
      const utterance = new SpeechSynthesisUtterance(hiragana.romaji)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.6 // Plus lent pour la prononciation claire
      utterance.pitch = 1.0
      utterance.volume = 0.9
      
      // Essayer de trouver une voix japonaise
      const voices = speechSynthesis.getVoices()
      const japaneseVoice = voices.find(voice => 
        voice.lang.startsWith('ja') || 
        voice.name.includes('Japan') || 
        voice.name.includes('Japanese')
      )
      
      if (japaneseVoice) {
        utterance.voice = japaneseVoice
      }

      // Événements de fin de lecture
      utterance.onend = () => {
        currentPlaying.value = null
      }

      utterance.onerror = () => {
        currentPlaying.value = null
        console.warn('❌ Erreur lors de la synthèse vocale')
      }
      
      speechSynthesis.speak(utterance)
      
      console.log(`🔊 Prononciation: ${hiragana.char} → ${hiragana.romaji}`)
    } else {
      console.warn('❌ Synthèse vocale non supportée par ce navigateur')
      alert('La synthèse vocale n\'est pas supportée par votre navigateur.')
    }
  }

  // Jouer tous les hiragana d'une ligne
  const playRow = async (rowIndex) => {
    const row = currentGrid.value[rowIndex]
    if (!row) return

    for (let i = 0; i < row.length; i++) {
      const hiragana = row[i]
      if (hiragana) {
        speakHiragana(hiragana)
        // Attendre la fin de la prononciation avant le suivant
        await new Promise(resolve => {
          const checkEnd = () => {
            if (currentPlaying.value === null) {
              resolve()
            } else {
              setTimeout(checkEnd, 100)
            }
          }
          setTimeout(checkEnd, 800) // Délai minimum entre chaque
        })
      }
    }
  }

  // Jouer tous les hiragana de la grille
  const playAll = async () => {
    for (let i = 0; i < currentGrid.value.length; i++) {
      await playRow(i)
      // Petite pause entre les lignes
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  // Fonction pour gérer le hover audio
  const handleHover = (hiragana) => {
    if (playOnHover.value && hiragana) {
      // Petit délai pour éviter les lectures accidentelles
      setTimeout(() => {
        if (playOnHover.value) { // Double vérification
          speakHiragana(hiragana)
        }
      }, 200)
    }
  }

  // Chercher un hiragana spécifique
  const findHiragana = (char) => {
    return allHiragana.value.find(h => h.char === char)
  }

  // Obtenir une liste de hiragana aléatoires pour le quiz
  const getRandomHiragana = (count = 10) => {
    const shuffled = [...allHiragana.value].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  return {
    // State
    showRomaji,
    playOnHover,
    currentView,
    currentPlaying,
    
    // Data
    hiraganaGrid,
    combinationsGrid,
    
    // Computed
    currentGrid,
    allHiragana,
    statistics,
    
    // Methods
    speakHiragana,
    playRow,
    playAll,
    handleHover,
    findHiragana,
    getRandomHiragana
  }
}