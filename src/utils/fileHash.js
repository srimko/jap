/**
 * Utilitaires pour générer des hash de fichiers audio
 * Permet de détecter les doublons et éviter les appels API inutiles
 */

/**
 * Génère un hash SHA-256 d'un fichier
 * @param {File} file - Le fichier à hasher
 * @returns {Promise<string>} - Le hash hexadécimal du fichier
 */
export async function generateFileHash(file) {
  try {
    // Lire le fichier comme ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Générer le hash SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    
    // Convertir en string hexadécimal
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  } catch (error) {
    console.error('Erreur lors de la génération du hash:', error)
    throw new Error('Impossible de générer le hash du fichier')
  }
}

/**
 * Génère un hash rapide basé sur les métadonnées du fichier
 * Moins précis mais plus rapide que le hash complet
 * @param {File} file - Le fichier à hasher
 * @returns {string} - Hash basé sur nom, taille, et date de modification
 */
export function generateQuickHash(file) {
  const metadata = `${file.name}_${file.size}_${file.lastModified}_${file.type}`
  
  // Simple hash djb2
  let hash = 5381
  for (let i = 0; i < metadata.length; i++) {
    hash = ((hash << 5) + hash) + metadata.charCodeAt(i)
  }
  
  return Math.abs(hash).toString(16)
}

/**
 * Génère un hash hybride : quick hash + échantillon du contenu
 * Bon compromis entre précision et performance
 * @param {File} file - Le fichier à hasher
 * @returns {Promise<string>} - Hash hybride
 */
export async function generateHybridHash(file) {
  try {
    // Hash rapide des métadonnées
    const quickHash = generateQuickHash(file)
    
    // Échantillonner le début et la fin du fichier (premiers et derniers 8KB)
    const chunkSize = 8192 // 8KB
    const fileSize = file.size
    
    let sampleBuffer
    
    if (fileSize <= chunkSize * 2) {
      // Fichier petit : hash complet
      sampleBuffer = await file.arrayBuffer()
    } else {
      // Fichier plus grand : échantillonner début + fin
      const startChunk = file.slice(0, chunkSize)
      const endChunk = file.slice(fileSize - chunkSize, fileSize)
      
      const startBuffer = await startChunk.arrayBuffer()
      const endBuffer = await endChunk.arrayBuffer()
      
      // Combiner les deux chunks
      sampleBuffer = new Uint8Array(startBuffer.byteLength + endBuffer.byteLength)
      sampleBuffer.set(new Uint8Array(startBuffer), 0)
      sampleBuffer.set(new Uint8Array(endBuffer), startBuffer.byteLength)
    }
    
    // Hash SHA-256 de l'échantillon
    const hashBuffer = await crypto.subtle.digest('SHA-256', sampleBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Combiner quick hash + content hash
    return `${quickHash}_${contentHash.substring(0, 16)}`
  } catch (error) {
    console.error('Erreur lors de la génération du hash hybride:', error)
    // Fallback sur quick hash
    return generateQuickHash(file)
  }
}

/**
 * Vérifie si deux fichiers ont le même hash
 * @param {string} hash1 - Premier hash
 * @param {string} hash2 - Deuxième hash  
 * @returns {boolean} - True si les hash sont identiques
 */
export function compareHashes(hash1, hash2) {
  return hash1 === hash2
}

/**
 * Génère des métadonnées étendues pour un fichier
 * @param {File} file - Le fichier à analyser
 * @returns {Promise<object>} - Métadonnées du fichier
 */
export async function generateFileMetadata(file) {
  const hash = await generateHybridHash(file)
  
  return {
    hash,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    extension: file.name.split('.').pop()?.toLowerCase() || '',
    sizeFormatted: formatFileSize(file.size),
    createdAt: new Date().toISOString()
  }
}

/**
 * Formate la taille d'un fichier
 * @param {number} bytes - Taille en bytes
 * @returns {string} - Taille formatée
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Vérifie si le navigateur supporte les fonctionnalités de hash
 * @returns {boolean} - True si supporté
 */
export function isHashingSupported() {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' && 
         typeof crypto.subtle.digest === 'function'
}