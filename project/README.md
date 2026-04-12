# Hifz Al-Quran — حفظ القرآن

Application web pour accompagner la **mémorisation du Coran** (Hifz) : lecture des versets, suivi de progression, signets et rythme personnalisé.

## Fonctionnalités

- **Accueil** — Présentation du projet et accès rapides aux sections.
- **Lire** — Sourates et versets via [api.alquran.cloud](https://alquran.cloud/api) : texte arabe (Uthmani), traduction française (Hamidullah), audio par récitateur. Modes *Ayah par Ayah* et *Lecture*, gestion du Bismillah conforme à l’usage (Fatiha, Tawba, autres sourates).
- **Mon Hifz** — Profil (Juz actuel, objectif, temps quotidien, ressenti sur la mémorisation), tâche du jour, chrono de session, évaluation après page, consolidation à 10 Juz, rappels de révision.
- **Signets** — Versets enregistrés dans le navigateur (`localStorage`).

## Stack technique

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (icônes)

## Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm (fourni avec Node)

## Installation

```bash
cd project
npm install
```

## Scripts

| Commande        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Serveur de développement       |
| `npm run build`| Build de production (`dist/`)  |
| `npm run preview` | Prévisualiser le build      |
| `npm run lint` | ESLint                         |
| `npm run typecheck` | Vérification TypeScript   |

## Données locales

Les préférences et données utilisateur sont stockées dans **`localStorage`** (profil Hifz, progression, signets, thème sombre, etc.). Aucun compte n’est requis pour l’usage de base.

## API externe

- **Coran** : `https://api.alquran.cloud/v1` (texte, traduction, métadonnées audio).
- **Audio** : fichiers servis par le CDN islamic.network (chemins alignés sur les numéros globaux d’ayah).

Un accès réseau est nécessaire pour charger les sourates et l’audio.

## Structure (aperçu)

```
src/
├── components/     # En-tête, pied de page
├── data/           # Liste des sourates, récitateurs
├── hooks/          # useLocalStorage, useDarkMode
├── lib/            # API Coran, Bismillah, rythme Hifz, etc.
├── pages/          # Home, Lire, Hifz, Signets
└── types/          # Types TypeScript partagés
```

## Licence

Projet privé — adaptez la licence selon votre usage.

---

*Qu’Allah accepte votre Hifz et facilite la mémorisation de Son Livre.*
