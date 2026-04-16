# Guide Développeur — Hifz Al-Quran

Documentation technique pour comprendre la structure du projet et pouvoir le continuer seul.

## Structure des fichiers

### 📁 Racine du projet
```
project/
├── package.json          # Dépendances et scripts npm
├── vite.config.ts        # Configuration Vite (build, dev server)
├── tsconfig.json         # Configuration TypeScript globale
├── tsconfig.app.json     # Configuration TypeScript pour l'application
├── tailwind.config.js    # Configuration Tailwind CSS
├── postcss.config.js     # Configuration PostCSS
├── eslint.config.js      # Règles ESLint
├── vercel.json          # Configuration déploiement Vercel
└── dist/                # Build de production (généré)
```

### 📁 src/ - Code source principal

#### ⚙️ Fichiers de configuration
- **`main.tsx`** : Point d'entrée de l'application React
- **`App.tsx`** : Router principal avec toutes les routes
- **`index.css`** : Styles globaux et variables CSS
- **`vite-env.d.ts`** : Types Vite pour les imports

#### 📁 components/ - Composants UI réutilisables
```
components/
├── Header.tsx           # Barre de navigation supérieure
├── Footer.tsx           # Pied de page
└── [autres composants]  # Éléments réutilisables (boutons, cartes, etc.)
```

#### 📁 pages/ - Pages principales de l'application
```
pages/
├── Home.tsx             # Page d'accueil avec présentation
├── Lire/                # Module lecture du Coran
│   ├── index.tsx        # Page principale de lecture
│   ├── Reader.tsx       # Composant lecteur de versets
│   ├── AudioPlayer.tsx  # Lecteur audio intégré
│   └── [autres]         # Sous-composants lecture
├── Hifz_backup/         # Ancienne version Hifz (sauvegardée)
│   └── [fichiers originaux]
├── Signets.tsx          # Gestion des signets personnels
├── Ressources.tsx       # Page ressources additionnelles
└── Contact.tsx          # Page contact
```

#### 📁 components/ - Composants UI réutilisables
```
components/
├── Header.tsx           # Barre de navigation supérieure
├── Footer.tsx           # Pied de page
├── hifz/                # Nouveau module Hifz (workflow complet)
│   └── HifzApp.tsx      # Application Hifz principale
├── questionnaire/        # Formulaire personnalisé Hifz
│   ├── QuestionnaireContainer.tsx  # Container principal
│   ├── Stepper.tsx      # Navigation entre étapes
│   ├── Step1Situation.tsx  # Étape 1: Situation utilisateur
│   ├── Step2Memorized.tsx   # Étape 2: Mémorisation existante
│   ├── Step3Objective.tsx    # Étape 3: Objectifs
│   ├── Step4Availability.tsx  # Étape 4: Disponibilités
│   └── Step5Name.tsx     # Étape 5: Nom personnel
├── summary/             # Résumé du programme personnalisé
│   └── ProgramSummary.tsx
├── dashboard/           # Tableau de bord Hifz
│   └── Dashboard.tsx
└── [autres composants]  # Éléments réutilisables (boutons, cartes, etc.)
```

#### 📁 lib/ - Logique métier et utilitaires
```
lib/
├── quranApi.ts          # Appels API Coran (api.alquran.cloud)
├── hifzSchedule.ts      # Calculs planning automatique (ancienne version)
├── hifzPace.ts          # Rythme de mémorisation (ancienne version)
├── hifzMotivation.ts    # Messages et citations motivationnelles
└── bismillah.ts         # Gestion du Bismillah selon sourates
```

#### 📁 utils/ - Utilitaires modernisés
```
utils/
├── calculations.ts      # Calculs programme Hifz (nouvelle version)
├── storage.ts          # Gestion localStorage (nouvelle version)
└── [autres utilitaires] # Fonctions utilitaires variées
```

#### 📁 hooks/ - Hooks React personnalisés
```
hooks/
├── useLocalStorage.ts   # Stockage local persistant
└── useDarkMode.ts       # Gestion thème sombre/clair
```

#### 📁 types/ - Définitions TypeScript
```
types/
├── index.ts             # Types originaux (ancienne version)
└── hifz.ts             # Types Hifz (nouvelle version) :
    • QuestionnaireData   # Données formulaire
    • HifzProfile        # Profil utilisateur complet
    • ProgrammeHifz      # Programme calculé
    • HifzProgress       # Progression détaillée
    • Situation, Objectif # Types énumérés
```

#### 📁 data/ - Données statiques
```
data/
├── surahs.json          # Liste complète des sourates
├── reciters.json        # Liste des récitateurs audio
└── juz.ts              # Constantes Juz (nouvelle version)
```

#### 📁 ressources/ - Fichiers statiques
```
ressources/
└── [images, pdf, etc.]  # Ressources additionnelles
```

## Flux de données principal

### 1. Nouveau workflow Hifz (principal)
- **Questionnaire** : `components/questionnaire/QuestionnaireContainer.tsx`
- **Types** : `types/hifz.ts` (QuestionnaireData, HifzProfile, ProgrammeHifz)
- **Calculs** : `utils/calculations.ts` (calculateProgramme, minutesToPagesPerDay)
- **Stockage** : `utils/storage.ts` (loadProfile, saveProfile, loadProgress, saveProgress)
- **Workflow** : loading → questionnaire → summary → dashboard

### 2. Ancien workflow Hifz (backup)
- **Création** : `pages/Hifz_backup/ProfilForm.tsx` → `localStorage` clé `hifz-profile`
- **Type** : `UserProfile` (prénom, juz actuel, objectif, temps quotidien)
- **Utilisation** : Calcul planning automatique via `lib/hifzSchedule.ts`

### 3. Progression quotidienne
- **Stockage** : `localStorage` clé `hifz-progress`
- **Type** : `HifzProgress` (jours, joursConsecutifs, pagesCompletees, derniereRevision)
- **Calculs** : `utils/calculations.ts` (formatDuration, getPagesThisMonth)

### 4. Lecture Coran
- **API** : `lib/quranApi.ts` → `api.alquran.cloud`
- **Données** : Versets, traductions, audio
- **Navigation** : Gestion pages/versets avec paramètres URL

## Points d'entrée clés

### Pour modifier le nouveau questionnaire Hifz
→ `components/questionnaire/` : Tous les composants du formulaire
→ `utils/calculations.ts` : Fonctions `calculateProgramme()`, `minutesToPagesPerDay()`

### Pour modifier l'ancien planning Hifz
→ `lib/hifzSchedule.ts` : Fonctions `getDailyMemoGoal()`, `getWeeklyPlan()`

### Pour changer l'API Coran
→ `lib/quranApi.ts` : Toutes les fonctions d'appel API

### Pour ajouter une nouvelle page
→ `src/App.tsx` : Ajouter route dans `<Routes>`
→ Créer fichier dans `src/pages/`

### Pour modifier les types
→ `src/types/index.ts` : Types originaux
→ `src/types/hifz.ts` : Types Hifz (nouvelle version)

## Dépendances principales

### Production
- **React 18** : Framework frontend
- **React Router DOM 7** : Routing client
- **Supabase** : Backend BaaS (non utilisé actuellement)
- **Lucide React** : Icônes modernes

### Développement
- **Vite 8** : Build tool et dev server
- **TypeScript** : Typage statique
- **Tailwind CSS 3** : Framework CSS
- **ESLint** : Linting code

## Scripts npm utiles

```bash
npm run dev          # Serveur développement (http://localhost:5173)
npm run build        # Build production (dossier dist/)
npm run preview      # Prévisualiser build production
npm run lint         # Vérifier code ESLint
npm run typecheck    # Vérifier types TypeScript
```

## Bonnes pratiques du projet

1. **TypeScript strict** : Toujours typer les fonctions et variables
2. **Components purs** : Props en entrée, JSX en sortie
3. **LocalStorage** : Utiliser le hook `useLocalStorage` pour la persistance
4. **Routes** : Utiliser React Router pour la navigation
5. **Styles** : Classes Tailwind, pas de CSS inline
6. **API** : Centraliser les appels dans `lib/`

## Évolutions possibles

### Court terme
- Ajouter des statistiques avancées dans `Hifz/`
- Améliorer l'interface audio dans `Lire/`
- Ajouter des thèmes personnalisés

### Moyen terme
- Intégrer Supabase pour sauvegarde cloud
- Créer la PWA (Service Worker, manifest)
- Ajouter notifications push pour rappels

### Long terme
- Application mobile native
- Système de révisions intelligent
- Communauté et partage progression

---

*Ce document est vivant : à mettre à jour dès que l'architecture évolue.*
