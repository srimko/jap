# 📜 Page Transcriptions (/transcriptions) - Historique et Gestion

## Vue d'ensemble
Dashboard complet pour la gestion, consultation et analyse de l'historique des transcriptions avec statistiques avancées et fonctionnalités de cache.

## Fonctionnalités principales

### 📋 Historique Complet
- **Liste chronologique** : Toutes les transcriptions triées par date
- **Statuts multiples** : pending, processing, completed, error
- **Métadonnées détaillées** : Nom, taille, durée, date de création
- **Persistance** : Sauvegarde automatique en localStorage

### 🔍 Recherche et Filtrage Avancés
- **Recherche textuelle** : Dans noms de fichiers et contenu transcrit
- **Filtres par statut** :
  - Toutes les transcriptions
  - Terminées uniquement
  - En erreur
  - En cours de traitement
- **Tri chronologique** : Plus récentes en premier

### 📊 Dashboard Statistiques
- **Total transcriptions** : Nombre global dans l'historique
- **Activité aujourd'hui** : Transcriptions du jour
- **Temps moyen** : Performance moyenne de traitement
- **Taux de succès** : Pourcentage de transcriptions réussies
- **Statistiques cache** : Total en cache, hits, taille du cache

### 💾 Gestion du Cache SHA-256
- **Visualisation** : Nombre d'éléments en cache
- **Métriques** : Cache hits pour optimisation
- **Actions** :
  - Vider le cache complet
  - Forcer le retraitement des fichiers
- **Indicateurs** : Badge "Cache" sur les transcriptions depuis le cache

### 📤 Export et Sauvegarde
- **Format JSON** : Export structuré de toutes les données
- **Métadonnées complètes** : Inclut analyses, timestamps, métadonnées
- **Horodatage** : Noms de fichiers avec date d'export
- **Restauration** : Possibilité d'import futur

### 🗑️ Gestion et Nettoyage
- **Suppression individuelle** : Par transcription avec confirmation
- **Suppression globale** : Nettoyage complet de l'historique
- **Sécurité** : Confirmations obligatoires pour éviter pertes accidentelles
- **Actions réversibles** : Via export préventif

## Informations par transcription

### Métadonnées fichier
- **Nom original** : Nom du fichier audio uploadé
- **Taille** : Formatée en B/KB/MB/GB
- **Durée** : Format MM:SS
- **Date création** : Timestamp formaté français

### Badges et indicateurs
- **Statut coloré** : Vert (completed), Rouge (error), Bleu (processing)
- **Cache indicator** : Badge cyan si depuis le cache
- **Actions rapides** : Voir, supprimer par transcription

### Contenu détaillé (pour transcriptions complètes)
- **Transcription brute** : Texte de sortie Whisper
- **Analyse japonaise** :
  - Kanji, Hiragana, Romaji
  - Traduction française
  - Nombre de mots segmentés
- **Métadonnées techniques** :
  - Temps de traitement
  - Modèle IA utilisé (whisper/gpt-4)

## Pagination et Performance
- **Pagination intelligente** : 10 éléments par page par défaut
- **Navigation** : Composant UPagination
- **Performance** : Calcul à la volée des pages
- **Responsive** : Adaptation mobile/desktop

## Actions disponibles

### Par transcription
- **Voir** : Redirection vers Home avec transcription active
- **Supprimer** : Suppression individuelle avec confirmation
- **Réouvrir** : Consultation du résultat détaillé

### Globales
- **Actualiser** : Rechargement depuis le store
- **Export complet** : Téléchargement JSON de tout l'historique
- **Vider cache** : Suppression du cache SHA-256 avec confirmation
- **Vider historique** : Suppression complète avec confirmation

## Store et État

### Store Pinia (`transcription.js`)
- **transcriptions** : Array de tous les enregistrements
- **currentTranscription** : Transcription active pour affichage
- **Cache management** : Map des hash vers données
- **Statistics** : Calculs de métriques en temps réel

### Fonctions utilitaires
- **formatDate** : Formatage français des dates
- **formatFileSize** : Conversion bytes vers unités lisibles
- **formatDuration** : Conversion secondes vers MM:SS
- **getStatusColor/Label** : Styling conditionnel des statuts

## Métriques calculées
- **Total** : Nombre total de transcriptions
- **Aujourd'hui** : Transcriptions du jour courant
- **Temps moyen** : Moyenne des temps de traitement
- **Taux succès** : Pourcentage de transcriptions réussies
- **Cache stats** : Utilisation et efficacité du cache

## Intégrations
- **Router** : Navigation vers Home avec context
- **Store global** : Synchronisation avec état application
- **Cache système** : Intégration complète avec déduplication SHA-256
- **Export système** : Génération fichiers de sauvegarde

## Fichier source
`/src/views/TranscriptionsView.vue`

---

*Dernière mise à jour : 2025-01-08*