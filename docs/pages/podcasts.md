# 🎵 Page Podcasts (/podcasts) - Nihongo con Teppei

## Vue d'ensemble
Browser complet pour les épisodes du podcast japonais "Nihongo con Teppei" avec fonctionnalités de recherche, téléchargement et intégration directe au système de transcription.

## Fonctionnalités principales

### 📡 Gestion du Flux RSS
- **Source** : Fichier local `public/podcast.xml`
- **Parsing XML** : Analyse automatique avec DOMParser
- **Métadonnées complètes** : Titre, description, URL MP3, dates, tailles
- **Gestion d'erreurs** : Fallback en cas d'échec de lecture

### 🎧 Catalogue d'Épisodes
- **Affichage complet** : Tous les épisodes du flux RSS
- **Numérotation** : Identifiants d'épisode (#1385, #1384, etc.)
- **Métadonnées détaillées** :
  - Titre et description complète
  - Date de publication formatée français
  - Taille de fichier MP3
  - Durée d'épisode
  - URL de téléchargement direct

### 🔍 Recherche et Navigation
- **Recherche intelligente** : 
  - Dans titres d'épisodes
  - Dans descriptions complètes
  - Par numéro d'épisode
- **Tri avancé** :
  - Par numéro d'épisode (croissant/décroissant)
  - Par date de publication
  - Par titre alphabétique
  - Par taille de fichier
- **Pagination** : Navigation par pages (12 épisodes par défaut)

### 📊 Dashboard Statistiques
- **Total épisodes** : Nombre d'épisodes disponibles
- **Durée totale** : Temps cumulé en heures
- **Taille totale** : Espace disque total des MP3
- **Dernier épisode** : Numéro le plus récent
- **Taille moyenne** : Par épisode

### ⬇️ Téléchargement Direct
- **MP3 download** : Téléchargement direct des fichiers audio
- **Nom automatique** : Basé sur titre + numéro d'épisode
- **Indicateurs** : Loading states pendant téléchargement
- **Gestion erreurs** : Retry et messages d'erreur

### 🎙️ Intégration Transcription
- **Transcription directe** : Depuis la page podcasts
- **Workflow intégré** :
  1. Téléchargement automatique du MP3
  2. Conversion en objet File
  3. Passage au système de transcription
  4. Redirection vers Home avec processing
- **Cache compatible** : Utilise le système SHA-256 existant

### 📄 File d'Attente (Queue System)
- **Ajout en lot** : Queue pour traitement multiple
- **Gestion visuelle** : Widget flottant avec liste
- **Actions** : Ajouter, supprimer, traiter la file
- **Persistance** : État maintenu pendant la session

## Composants

### PodcastCard
- **Affichage épisode** : Design card avec toutes les infos
- **Actions intégrées** :
  - Télécharger MP3
  - Transcrire directement
  - Ajouter à la file d'attente
  - Ouvrir page web de l'épisode
- **Description expandable** : Voir plus/moins pour longues descriptions
- **Badges informatifs** : Numéro, date, taille, durée

### Dashboard principal
- **Header avec branding** : Nihongo con Teppei
- **Statistiques globales** : Cards avec métriques
- **Actions générales** :
  - Actualiser le flux
  - Exporter les données
- **Barre de recherche** : Avec suggestions
- **Filtres de tri** : Dropdown avec options multiples

## Gestion d'État

### Composable (`usePodcastFeed.js`)
- **episodes** : Array de tous les épisodes parsés
- **loading/error** : États de chargement et erreurs
- **statistics** : Calculs automatiques de métriques
- **Cache local** : Persistance des données parsées

### Fonctionnalités du composable
- **parseRSSFeed** : Parsing XML vers objets JavaScript
- **searchEpisodes** : Recherche dans les métadonnées
- **filterByDateRange** : Filtrage par période
- **downloadEpisode** : Téléchargement avec gestion des erreurs
- **Formatage** : Tailles, dates, durées

## Actions disponibles

### Par épisode (PodcastCard)
- **Télécharger** : Download du fichier MP3
- **Transcrire** : Intégration directe au workflow de transcription
- **Queue** : Ajout en file d'attente pour traitement en lot
- **Web** : Ouverture de la page de l'épisode

### Globales (Interface principale)
- **Actualiser** : Rechargement du fichier XML local
- **Exporter** : Téléchargement JSON avec toutes les données
- **Recherche** : Filtrage temps réel
- **Tri** : Changement d'ordre d'affichage
- **Pagination** : Navigation dans la liste

## Données exportées
- **Métadonnées podcast** : Nom, date d'export
- **Statistiques** : Résumé des métriques
- **Liste complète** : Tous les épisodes avec métadonnées
- **Format JSON** : Structuré pour réimport ou analyse

## Performance et UX
- **Loading states** : Skeletons pendant le parsing
- **Pagination intelligente** : Évite le lag sur grandes listes
- **Recherche instantanée** : Filtrage sans délai
- **Cache navigateur** : Évite le reparse du XML
- **Responsive design** : Adaptation mobile/desktop

## Intégrations système
- **Cache SHA-256** : Réutilise le système de déduplication existant
- **Store transcription** : Intégration transparente
- **Router** : Navigation contextuelle vers Home
- **localStorage** : Persistance des préférences utilisateur

## Fichiers sources
- **Vue** : `/src/views/PodcastsView.vue`
- **Composable** : `/src/composables/usePodcastFeed.js`
- **Composant** : `/src/components/PodcastCard.vue`
- **Données** : `/public/podcast.xml`

---

*Dernière mise à jour : 2025-01-08*