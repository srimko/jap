# 📈 Page SM2 (/sm2) - Système de Répétition Espacée

## Vue d'ensemble
Interface pour l'apprentissage par répétition espacée utilisant l'algorithme SM2 (SuperMemo 2) pour optimiser la mémorisation du vocabulaire japonais.

## Fonctionnalités principales

### 🧠 Algorithme SM2
- **Base scientifique** : Algorithme SuperMemo 2 pour optimisation de la rétention
- **Calcul automatique** : Intervalles de révision adaptatifs
- **Facteur de facilité** : Ajustement basé sur les performances
- **Planification intelligente** : Prédiction des prochaines révisions

### 📚 Système de Cartes Flash
- **Format** : Question/Réponse (front/back)
- **Interface intuitive** : Révélation progressive du contenu
- **Actions** :
  - Affichage de la question
  - Révélation de la réponse
  - Auto-évaluation de la difficulté

### ⭐ Système de Notation
- **Échelle** : 0 à 5
  - **0** : Échec total (oubli complet)
  - **1-2** : Difficile (rappel avec effort)
  - **3-4** : Correct (rappel normal)
  - **5** : Parfait (rappel facile et immédiat)
- **Impact** : Ajustement automatique de l'intervalle de révision

### 📊 Statistiques de Session
- **Cartes étudiées** : Nombre de cartes vues dans la session
- **Taux de réussite** : Pourcentage de bonnes réponses
- **Progression** : Suivi en temps réel
- **Indicateurs visuels** : Badges et barres de progression

### 🎯 Gestion des Cartes Dues
- **Cartes du jour** : Affichage des cartes à réviser aujourd'hui
- **Priorisation** : Ordre basé sur l'urgence et la difficulté
- **Session terminée** : Message de félicitations et statistiques

## États de l'application

### Session active
- Affichage de la carte courante
- Boutons de notation (0-5)
- Statistiques en cours
- Progression de la session

### Session terminée
- Message de félicitation
- Statistiques globales :
  - Total des cartes
  - Cartes étudiées aujourd'hui
- Bouton "Nouvelle session"

### Aucune carte due
- Message informatif
- Statistiques générales
- Possibilité de forcer une nouvelle session

## Store Pinia

### État global (`cards.js`)
- **cartes** : Collection de toutes les cartes
- **cartes dues** : Filtre des cartes à réviser
- **session courante** : État de la session d'étude
- **statistiques** : Métriques de performance

### Persistance
- **localStorage** : Sauvegarde automatique
- **Récupération** : Chargement au démarrage
- **Synchronisation** : Mise à jour temps réel

## Algorithme SM2 détaillé

### Variables par carte
- **Interval** : Jours jusqu'à la prochaine révision
- **Repetition** : Nombre de répétitions consécutives réussies
- **Ease Factor** : Facteur de facilité (1.3 minimum)

### Calcul des intervalles
1. **Première fois** : 1 jour
2. **Deuxième fois** : 6 jours
3. **Suivantes** : `interval * ease_factor`

### Ajustement du facteur
- **Bonne réponse** : Augmentation du facteur
- **Mauvaise réponse** : Diminution du facteur
- **Échec** : Remise à zéro de l'intervalle

## Composant utilisé
- **Composable** : `useSM2` pour la logique algorithmique
- **Interface** : Composants Nuxt UI pour les cartes et boutons
- **Responsive** : Adaptation mobile et desktop

## Métriques trackées
- Nombre total de cartes
- Cartes dues par jour
- Temps de révision par session
- Taux de rétention global
- Évolution des performances

## Intégrations futures possibles
- Import de cartes depuis les transcriptions
- Export vers d'autres systèmes SRS
- Synchronisation multi-appareils
- Analytics avancés d'apprentissage

## Fichier source
`/src/views/SM2view.vue`

---

*Dernière mise à jour : 2025-01-08*