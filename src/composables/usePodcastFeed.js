import { ref, computed } from 'vue'

export function usePodcastFeed() {
  const episodes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const feedUrl = 'https://nihongoconteppei.com/feed/podcast/'

  // Fonction pour parser le XML RSS
  const parseRSSFeed = (xmlText) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Vérifier s'il y a des erreurs de parsing
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Erreur de parsing XML: ' + parserError.textContent)
    }

    const items = xmlDoc.querySelectorAll('item')
    const parsedEpisodes = []

    items.forEach(item => {
      try {
        const title = item.querySelector('title')?.textContent || 'Sans titre'
        const description = item.querySelector('description')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        
        // Récupérer l'URL MP3 depuis l'enclosure
        const enclosure = item.querySelector('enclosure')
        const mp3Url = enclosure?.getAttribute('url') || ''
        const fileSize = enclosure?.getAttribute('length') || '0'
        const duration = item.querySelector('itunes\\:duration, duration')?.textContent || ''
        
        // Extraire le numéro d'épisode depuis le titre
        const episodeMatch = title.match(/#(\d+)/)
        const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 0

        // Nettoyer la description (enlever les balises HTML)
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim()

        parsedEpisodes.push({
          id: episodeNumber || Date.now() + Math.random(),
          title,
          description: cleanDescription,
          episodeNumber,
          mp3Url,
          webLink: link,
          publishDate: pubDate ? new Date(pubDate) : new Date(),
          fileSize: parseInt(fileSize) || 0,
          duration,
          formatted: {
            date: pubDate ? new Date(pubDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '',
            fileSize: formatFileSize(parseInt(fileSize) || 0)
          }
        })
      } catch (err) {
        console.warn('Erreur lors du parsing d\'un épisode:', err)
      }
    })

    // Trier par numéro d'épisode décroissant (plus récent en premier)
    return parsedEpisodes.sort((a, b) => b.episodeNumber - a.episodeNumber)
  }

  // Fonction pour formater la taille de fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Fonction pour récupérer le flux RSS via proxy CORS
  const fetchPodcastFeed = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Utiliser un proxy CORS pour éviter les problèmes CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`
      
      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const xmlText = await response.text()
      const parsedEpisodes = parseRSSFeed(xmlText)
      
      episodes.value = parsedEpisodes
      
      console.log(`✅ ${parsedEpisodes.length} épisodes chargés depuis le flux RSS`)
      
    } catch (err) {
      console.error('Erreur lors du chargement du flux RSS:', err)
      error.value = err.message
      episodes.value = []
    } finally {
      loading.value = false
    }
  }

  // Recherche dans les épisodes
  const searchEpisodes = (query) => {
    if (!query || !query.trim()) return episodes.value
    
    const searchTerm = query.toLowerCase().trim()
    return episodes.value.filter(episode => 
      episode.title.toLowerCase().includes(searchTerm) ||
      episode.description.toLowerCase().includes(searchTerm) ||
      episode.episodeNumber.toString().includes(searchTerm)
    )
  }

  // Filtrage par période
  const filterByDateRange = (startDate, endDate) => {
    return episodes.value.filter(episode => {
      const episodeDate = episode.publishDate
      return episodeDate >= startDate && episodeDate <= endDate
    })
  }

  // Computed properties
  const episodeCount = computed(() => episodes.value.length)
  
  const totalDuration = computed(() => {
    return episodes.value.reduce((total, episode) => {
      // Essayer de parser la durée (format HH:MM:SS ou MM:SS)
      const durationParts = episode.duration.split(':')
      if (durationParts.length >= 2) {
        const minutes = parseInt(durationParts[durationParts.length - 2]) || 0
        const seconds = parseInt(durationParts[durationParts.length - 1]) || 0
        const hours = durationParts.length === 3 ? parseInt(durationParts[0]) || 0 : 0
        
        return total + (hours * 3600) + (minutes * 60) + seconds
      }
      return total
    }, 0)
  })

  const totalSize = computed(() => {
    return episodes.value.reduce((total, episode) => total + episode.fileSize, 0)
  })

  const recentEpisodes = computed(() => {
    return episodes.value.slice(0, 10)
  })

  const statistics = computed(() => ({
    total: episodeCount.value,
    totalDuration: Math.round(totalDuration.value / 60), // en minutes
    totalSize: formatFileSize(totalSize.value),
    averageSize: episodeCount.value > 0 ? formatFileSize(totalSize.value / episodeCount.value) : '0 B',
    latestEpisode: episodes.value[0]?.episodeNumber || 0,
    oldestEpisode: episodes.value[episodes.value.length - 1]?.episodeNumber || 0
  }))

  // Fonction pour télécharger un MP3
  const downloadEpisode = async (episode) => {
    try {
      const response = await fetch(episode.mp3Url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${episode.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err)
      throw new Error('Impossible de télécharger le fichier')
    }
  }

  return {
    // State
    episodes,
    loading,
    error,
    
    // Computed
    episodeCount,
    recentEpisodes,
    statistics,
    
    // Methods
    fetchPodcastFeed,
    searchEpisodes,
    filterByDateRange,
    downloadEpisode
  }
}