# 📝 Changelog - Application JAP

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Non publié] - 2025-01-08

### ✨ Ajouté
- **Page Podcasts Nihongo con Teppei** (`/podcasts`)
  - Parser RSS complet pour fichier local `podcast.xml`
  - Composant `PodcastCard.vue` avec actions de téléchargement
  - Composable `usePodcastFeed.js` pour gestion du flux RSS
  - Navigation, recherche, tri, statistiques et export JSON
  - Pagination intelligente pour grandes listes d'épisodes

- **Système de cache et déduplication intelligent**
  - Utilitaire `fileHash.js` avec algorithme SHA-256 hybride
  - Cache localStorage avec Map() pour performances optimales
  - Composant `CacheIndicator.vue` avec feedback temps réel
  - Statistiques cache : hits, taille totale, gestion dans l'interface

- **Interface historique des transcriptions** (`/transcriptions`)
  - Page `TranscriptionsView.vue` avec dashboard statistiques complet
  - Recherche avancée dans le contenu des transcriptions
  - Filtres par statut avec pagination automatique
  - Actions CRUD : voir, supprimer, exporter, vider tout

- **Architecture Pinia centralisée**
  - Store `app.js` : thème, préférences, gestion erreurs globales
  - Store `cards.js` : SM2 complet, statistiques, sessions, import/export
  - Store `transcription.js` : historique, cache, recherche, persistance
  - Migration des composables vers architecture Pinia

- **Validation fichiers audio complète**
  - Composable `useAudioValidation.js` avec validation type/taille/durée
  - Composants `FileValidationAlert.vue` et `AudioFileInfo.vue`
  - Support formats : MP3, WAV, M4A, OGG, WebM (max 50MB, 10min)
  - Intégration dans `HomeView.vue` avec feedback utilisateur

- **Documentation complète du projet**
  - Documentation par page dans le dossier `docs/`
  - ROADMAP.md avec planification détaillée et auto-update
  - Structure modulaire pour maintenance future

### 🎨 Amélioré
- **Affichage analyse japonaise** dans les transcriptions
  - Design redesigné avec sections colorées distinctes
  - Kanji (rouge), Hiragana (rose), Romaji (bleu), Traduction (vert)
  - Cartes blanches avec ombres et gradients pour lisibilité
  - Badges informatifs et compteur de mots analysés

- **Composants réutilisables**
  - Refactoring complet avec séparation des préoccupations
  - Composants modulaires : `JapaneseWordCard`, `LoadingSkeleton`
  - Architecture scalable pour futures fonctionnalités

### 🔧 Corrigé
- **Problèmes CORS** pour téléchargement des podcasts MP3
  - Utilisation du proxy `allorigins.win` pour contourner restrictions
  - Gestion d'erreurs améliorée avec messages utilisateur
  - Simplification des noms de fichiers pour éviter caractères spéciaux

- **Synchronisation cache-UI** dans les transcriptions
  - Fix de l'affichage des transcriptions depuis le cache
  - Watchers réactifs pour synchronisation store-composants
  - Appel systématique de `processTranscription()` pour tous les cas

### 🗑️ Supprimé
- **Bouton "Transcrire cet épisode"** remplacé par "Télécharger MP3"
- **Imports inutilisés** dans les composants (cleanup ESLint)
- **Code dupliqué** remplacé par composables réutilisables

---

## Notes de développement

### Architecture technique
- **Frontend** : Vue 3 + Composition API
- **UI Framework** : Nuxt UI + Tailwind CSS  
- **État global** : Pinia stores
- **APIs externes** : OpenAI (Whisper + GPT-4)
- **Cache** : SHA-256 + localStorage
- **Build** : Vite

### Performances
- **Cache intelligent** : Évite les appels API redondants
- **Pagination** : Navigation optimisée pour grandes listes
- **Lazy loading** : Composants chargés à la demande
- **Déduplication** : Fichiers identiques détectés automatiquement

### Sécurité
- **Validation robuste** : Fichiers audio vérifiés (type, taille, durée)
- **Sanitisation** : Nettoyage des noms de fichiers
- **Gestion d'erreurs** : Messages utilisateur sans exposition technique

---

*🤖 Ce changelog est maintenu automatiquement par Claude lors des développements.*