import { ref, computed } from 'vue'

export function useHiragana() {
  const showRomaji = ref(true)
  const playOnHover = ref(false)
  const currentPlaying = ref(null)

  // Structured hiragana data organized by rows (based on kanji.html file)
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
      null, // empty cell
      { char: 'ゆ', romaji: 'yu' },
      null, // empty cell
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
      null, // empty cell
      null, // empty cell
      null, // empty cell
      { char: 'を', romaji: 'wo' }
    ],
    [
      { char: 'ん', romaji: 'n' },
      null, // empty cell
      null, // empty cell
      null, // empty cell
      null  // case vide
    ]
  ])

  // Combined hiragana (ya, yu, yo)
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

  // Current view (basic or combinations)
  const currentView = ref('basic')

  // Function to check if a hiragana has an audio file
  const hasAudioFile = (hiragana) => {
    return hiragana && availableAudioFiles.includes(hiragana.romaji)
  }

  // Filtered grid to show only hiragana with audio (keeps row structure)
  const filteredHiraganaGrid = computed(() => {
    return hiraganaGrid.value.map(row => 
      row.map(hiragana => hasAudioFile(hiragana) ? hiragana : null)
    ).filter(row => row.some(hiragana => hiragana !== null))
  })

  // Current grid based on the view
  const currentGrid = computed(() => {
    return currentView.value === 'basic' ? filteredHiraganaGrid.value : combinationsGrid.value
  })

  // Flat list of all hiragana (for search)
  const allHiragana = computed(() => {
    const basic = hiraganaGrid.value.flat().filter(Boolean)
    const combinations = combinationsGrid.value.flat().filter(Boolean)
    return [...basic, ...combinations]
  })

  // Statistics
  const statistics = computed(() => ({
    basicCount: filteredHiraganaGrid.value.flat().filter(Boolean).length,
    combinationsCount: combinationsGrid.value.flat().filter(Boolean).length,
    totalCount: allHiragana.value.length,
    audioAvailableCount: availableAudioFiles.length
  }))

  // State for audio file management
  const audioCache = ref(new Map())
  const currentAudio = ref(null)

  // List of available audio files (based on files in public/audio/hiragana/)
  const availableAudioFiles = [
    'a', 'chi', 'e', 'fu', 'ha', 'he', 'hi', 'ho', 'i', 'ka', 'ke', 'ki', 'ko', 'ku',
    'ma', 'me', 'mi', 'mo', 'mu', 'n', 'na', 'ne', 'ni', 'no', 'nu', 'o', 'ra', 're',
    'ri', 'ro', 'ru', 'sa', 'se', 'shi', 'so', 'su', 'ta', 'te', 'to', 'tsu', 'u',
    'wa', 'ya', 'yo', 'yu'
  ]

  // Play local audio files
  const speakHiragana = async (hiragana) => {
    if (!hiragana) return

    try {
      // Stop any current audio
      if (currentAudio.value) {
        currentAudio.value.pause()
        currentAudio.value.currentTime = 0
      }

      // Indicate which hiragana is currently playing
      currentPlaying.value = hiragana.char

      // Build the audio file path
      const audioPath = `/audio/hiragana/${hiragana.romaji}.mp3`
      
      // Check if audio is cached
      let audio = audioCache.value.get(hiragana.romaji)
      
      if (!audio) {
        // Create a new Audio object
        audio = new Audio(audioPath)
        audio.preload = 'auto'
        
        // Cache the audio
        audioCache.value.set(hiragana.romaji, audio)
      }

      // Clean old event listeners to avoid duplicates
      audio.onended = null
      audio.onerror = null
      audio.oncanplaythrough = null

      // Configure events for this playback
      audio.onended = () => {
        currentPlaying.value = null
        currentAudio.value = null
      }

      audio.onerror = () => {
        console.warn(`❌ Impossible de charger le fichier audio: ${audioPath}`)
        currentPlaying.value = null
        currentAudio.value = null
        // Fallback to speech synthesis if available
        fallbackToSpeechSynthesis(hiragana)
      }

      // Set current audio before playing
      currentAudio.value = audio

      // Try to play the audio file
      try {
        await audio.play()
        console.log(`🔊 Lecture audio MP3: ${hiragana.char} → ${hiragana.romaji}`)
      } catch (playError) {
        console.warn(`❌ Erreur lors de la lecture MP3: ${playError.message}`)
        currentPlaying.value = null
        currentAudio.value = null
        fallbackToSpeechSynthesis(hiragana)
      }

    } catch (error) {
      console.error('❌ Erreur lors de la lecture audio:', error)
      currentPlaying.value = null
      currentAudio.value = null
      fallbackToSpeechSynthesis(hiragana)
    }
  }

  // Fallback to browser speech synthesis
  const fallbackToSpeechSynthesis = (hiragana) => {
    // Don't use fallback if audio is already playing
    if (currentAudio.value) {
      return
    }

    if ('speechSynthesis' in window) {
      // Cancel any ongoing synthesis
      speechSynthesis.cancel()
      
      // Mark that we're using speech synthesis
      currentPlaying.value = hiragana.char
      
      const utterance = new SpeechSynthesisUtterance(hiragana.romaji)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.6
      utterance.pitch = 1.0
      utterance.volume = 0.9
      
      // Try to find a Japanese voice
      const voices = speechSynthesis.getVoices()
      const japaneseVoice = voices.find(voice => 
        voice.lang.startsWith('ja') || 
        voice.name.includes('Japan') || 
        voice.name.includes('Japanese')
      )
      
      if (japaneseVoice) {
        utterance.voice = japaneseVoice
      }

      utterance.onend = () => {
        currentPlaying.value = null
      }

      utterance.onerror = () => {
        currentPlaying.value = null
      }
      
      speechSynthesis.speak(utterance)
      console.log(`🔊 Fallback synthèse vocale: ${hiragana.char} → ${hiragana.romaji}`)
    } else {
      console.warn('❌ Aucun système audio disponible')
      currentPlaying.value = null
    }
  }

  // Stop current audio playback
  const stopAudio = () => {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    currentPlaying.value = null
  }

  // Play all hiragana in a row
  const playRow = async (rowIndex) => {
    const row = currentGrid.value[rowIndex]
    if (!row) return

    for (let i = 0; i < row.length; i++) {
      const hiragana = row[i]
      if (hiragana) {
        await speakHiragana(hiragana)
        // Wait for pronunciation to end before next one
        await new Promise(resolve => {
          const checkEnd = () => {
            if (currentPlaying.value === null) {
              resolve()
            } else {
              setTimeout(checkEnd, 100)
            }
          }
          setTimeout(checkEnd, 1000) // Minimum delay between each
        })
      }
    }
  }

  // Play all hiragana in the grid
  const playAll = async () => {
    for (let i = 0; i < currentGrid.value.length; i++) {
      await playRow(i)
      // Short pause between rows
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Function to handle hover audio
  const handleHover = (hiragana) => {
    if (playOnHover.value && hiragana) {
      // Short delay to avoid accidental playback
      setTimeout(() => {
        if (playOnHover.value) { // Double check
          speakHiragana(hiragana)
        }
      }, 200)
    }
  }

  // Find a specific hiragana
  const findHiragana = (char) => {
    return allHiragana.value.find(h => h.char === char)
  }

  // Get a random list of hiragana for quiz
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
    stopAudio,
    handleHover,
    findHiragana,
    getRandomHiragana
  }
}