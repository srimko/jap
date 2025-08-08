# Jap - Application d'apprentissage du japonais

## Description
Micro-application Vue.js pour visualiser et décomposer des phrases japonaises. Affiche le texte en kanji, hiragana, romaji avec traduction française et détails des caractères.

## Stack technique
- Vue 3 + Composition API
- Tailwind CSS + Nuxt UI
- Vite
- Pinia pour la gestion d'état

## Commandes principales
```bash
# Développement
npm run dev

# Build production
npm run build

# Tests
npm run test:unit

# Lint
npm run lint

# Format
npm run format
```

## Structure du projet
- `src/views/` - Pages principales (HomeView, AboutView, SM2view)
- `src/components/` - Composants réutilisables
- `src/llm/` - Logique LLM (functionSchema, messages)
- `src/stores/` - État global Pinia
- `UI/` - Prototypes HTML

## URL de développement
http://localhost:5173/

## Notes
- Compatible avec les podcasts japonais (ex: Nihongo con Teppei)
- Objectif pédagogique : apprentissage contextuel du japonais