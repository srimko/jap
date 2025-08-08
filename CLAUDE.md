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

## Roadmap Management
**🤖 AUTOMATIQUE - Claude doit TOUJOURS :**

### Après chaque feature/fix implémenté(e) :
1. **Identifier** la tâche correspondante dans ROADMAP.md
2. **Mettre à jour** automatiquement le statut :
   - `- [ ]` → `- [x]` (tâche complétée)
   - Ajouter date : `- [x] **Task** (✅ 2025-01-08)`
3. **Déplacer** vers section "Completed" si milestone atteint
4. **Commenter** brièvement la completion dans le commit

### Template de commit avec roadmap :
```
feat: Add dark mode toggle

🗺️ ROADMAP: Mode sombre/clair ✅

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Règles de mapping :
- Security fixes → 🔴 Priorité Critique  
- Core features → 🟠 Priorité Haute
- UI/UX → 🟡 Priorité Moyenne
- Performance/Tests → 🟢 Priorité Basse

**IMPORTANT : Ne jamais implémenter une feature sans mettre à jour ROADMAP.md**

## Notes
- Compatible avec les podcasts japonais (ex: Nihongo con Teppei)
- Objectif pédagogique : apprentissage contextuel du japonais