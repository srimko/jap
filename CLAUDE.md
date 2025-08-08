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

## Documentation Management
**🤖 AUTOMATIQUE - Claude doit TOUJOURS :**

### Après chaque feature/fix implémenté(e) :
1. **Mettre à jour CHANGELOG.md** avec les changements :
   - Section `[Non publié]` avec date du jour
   - Catégories : ✨ Ajouté, 🎨 Amélioré, 🔧 Corrigé, 🗑️ Supprimé
2. **Mettre à jour ROADMAP.md** si nouvelles tâches identifiées :
   - Ajouter nouvelles fonctionnalités planifiées
   - Déplacer tâches complétées vers section "Completed"
3. **Mettre à jour docs/pages/** si changements dans les pages
4. **Commenter** brièvement dans le commit

### Template de commit avec documentation :
```
feat: Add dark mode toggle

Updates CHANGELOG.md and ROADMAP.md accordingly.

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Fichiers de documentation :
- **CHANGELOG.md** : Historique des changements implémentés
- **ROADMAP.md** : Planification des futures fonctionnalités
- **docs/pages/*** : Documentation détaillée par page
- **docs/README.md** : Index de la documentation

**IMPORTANT : Toujours maintenir la documentation à jour avec le code**

## Notes
- Compatible avec les podcasts japonais (ex: Nihongo con Teppei)
- Objectif pédagogique : apprentissage contextuel du japonais