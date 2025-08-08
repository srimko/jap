# 🏠 Page Home (/) - Transcription & Segmentation

## Vue d'ensemble
Page principale de l'application permettant l'upload et la transcription de fichiers audio japonais avec analyse linguistique complète.

## Fonctionnalités principales

### 🎙️ Upload et Validation Audio
- **Formats supportés** : MP3, WAV, M4A, AAC et autres formats audio
- **Validation avancée** : Vérification automatique du type, taille et durée
- **Limites** : Configurables via `useAudioValidation`
- **Interface** : Drag & drop avec indicateurs visuels

### 🚀 Système de Cache Intelligent
- **Algorithme SHA-256** : Génération d'empreintes uniques par fichier
- **Déduplication** : Évite les appels API redondants pour les mêmes fichiers
- **Storage** : localStorage avec persistance entre sessions
- **Indicateurs temps réel** : 
  - `found` - Fichier trouvé en cache
  - `processing` - Traitement en cours
  - `saving` - Sauvegarde du résultat

### 📝 Transcription Audio
- **Service** : OpenAI Whisper API
- **Langues** : Optimisé pour le japonais
- **Qualité** : Transcription haute précision
- **Gestion erreurs** : Retry automatique et fallback

### 🇯🇵 Analyse Linguistique Japonaise
- **Service** : OpenAI GPT-4
- **Segmentation** : Découpage mot par mot et kanji par kanji
- **Formats** :
  - **Kanji** : Écriture traditionnelle
  - **Hiragana** : Lecture phonétique
  - **Romaji** : Transcription latine
  - **Traduction** : Français
- **Liaison visuelle** : Correspondance entre les différents formats

## Composants utilisés

### Interface principale
- **FileValidationAlert** : Affichage des erreurs de validation
- **CacheIndicator** : Statut du cache en temps réel
- **AudioFileInfo** : Métadonnées du fichier (taille, durée, type)

### Affichage des résultats
- **JapaneseTextDisplay** : Rendu segmenté du texte japonais
- **LoadingSkeleton** : États de chargement pour la transcription
- **CompletionLoadingSkeleton** : États de chargement pour l'analyse

## Workflow technique

1. **Upload** → Sélection fichier audio
2. **Validation** → Vérification type/taille/durée
3. **Hashing** → Génération empreinte SHA-256
4. **Cache Check** → Recherche en cache local
5. **Si cache trouvé** → Affichage instantané
6. **Si nouveau fichier** :
   - Transcription via Whisper
   - Analyse linguistique via GPT-4
   - Sauvegarde en cache
7. **Affichage** → Rendu multi-format du résultat

## Gestion d'état

### Store Pinia utilisé
- **transcriptionStore** : Gestion cache et historique
- **Persistance** : localStorage automatique
- **Métadonnées** : Tracking des performances et statistiques

### État local (composable)
- **useJapaneseTranscription** : Logique métier principale
- **Reactive state** : Synchronisation temps réel avec l'interface

## Métriques trackées
- Temps de traitement par fichier
- Taux de succès des transcriptions
- Utilisation du cache (hits/misses)
- Taille des fichiers traités
- Modèles IA utilisés

## API externes
- **OpenAI Whisper** : Transcription audio
- **OpenAI GPT-4** : Analyse linguistique japonaise

## Fichier source
`/src/views/HomeView.vue`

---

*Dernière mise à jour : 2025-01-08*