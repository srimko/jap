# 📚 Documentation des Pages - Application JAP

Cette documentation maintient une vue exhaustive de toutes les fonctionnalités de l'application JAP par page.

## 📁 Structure de la documentation

### Pages principales
- **[🏠 Home](pages/home.md)** - Transcription & Segmentation (/)
- **[📈 SM2](pages/sm2.md)** - Système de Répétition Espacée (/sm2)
- **[📜 Transcriptions](pages/transcriptions.md)** - Historique et Gestion (/transcriptions)
- **[🎵 Podcasts](pages/podcasts.md)** - Nihongo con Teppei (/podcasts)
- **[📖 About](pages/about.md)** - Présentation du Projet (/about)

## 🔄 Processus de mise à jour

### Quand mettre à jour
La documentation doit être mise à jour à chaque fois que :
- Une nouvelle fonctionnalité est ajoutée
- Une fonctionnalité existante est modifiée
- L'interface utilisateur change significativement
- De nouveaux composants sont intégrés
- Les workflows sont modifiés

### Comment demander une mise à jour
Utilisez la commande suivante :
```
"Peux-tu mettre à jour la documentation des pages ? Scanne l'application et mets à jour les fonctionnalités."
```

### Processus automatique
Lors d'une demande de mise à jour, Claude :
1. **Scanne** tous les fichiers Vue des pages
2. **Analyse** les composables et stores utilisés
3. **Identifie** les nouvelles fonctionnalités
4. **Met à jour** les fichiers markdown correspondants
5. **Synchronise** avec l'état actuel de l'application

## 📊 Métriques trackées par page

### Fonctionnalités communes
- Upload et validation de fichiers
- Gestion d'état Pinia
- Cache et persistance localStorage
- Intégrations API externes
- Composants réutilisables

### Métriques spécifiques
- **Home** : Transcriptions, cache hits, temps de traitement
- **SM2** : Cartes étudiées, taux de rétention, sessions
- **Transcriptions** : Historique, recherche, exports
- **Podcasts** : Episodes parsés, téléchargements, queue
- **About** : Page statique, liens externes

## 🏗️ Architecture documentée

### Stack technique
- **Frontend** : Vue 3 + Composition API
- **UI** : Nuxt UI + Tailwind CSS
- **État** : Pinia stores
- **API** : OpenAI (Whisper + GPT-4)
- **Cache** : SHA-256 + localStorage
- **Build** : Vite

### Patterns documentés
- Composables pour logique métier réutilisable
- Stores Pinia pour état global
- Composants Vue modulaires
- System de cache intelligent
- Intégrations API avec fallback

## 📅 Historique des mises à jour

### 2025-01-08 - Création initiale
- Documentation complète des 5 pages principales
- Structure modulaire en fichiers séparés
- Processus de mise à jour automatique défini
- Métriques et architecture documentées

---

**Note** : Cette documentation est vivante et doit être maintenue à jour avec l'évolution de l'application.