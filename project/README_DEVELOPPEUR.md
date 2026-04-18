# 🛠️ Guide Développeur — Hifz Al-Quran

Bienvenue dans le guide technique du projet **Hifz Al-Quran**. Ce document est conçu pour t'aider à comprendre l'architecture et à modifier le code sereinement.

---

## 🚀 Démarrage Rapide

1. **Installer les dépendances** : `npm install`
2. **Lancer en local** : `npm run dev` (accéder à `http://localhost:5173`)
3. **Build de production** : `npm run build`

---

## 📁 Structure du Projet (src/)

### 🎨 Design & Style
- **`tailwind.config.js`** : Configuration des couleurs (ex: palette `gold`), polices et thèmes.
- **`src/index.css`** : Classes utilitaires premium (`.premium-card`, `.section-title`, `.gold-gradient`) et styles globaux.
- **`src/components/`** : Éléments communs (`Header.tsx`, `Footer.tsx`).

### 📖 Module de Lecture (src/pages/Lire/)
- **`index.tsx`** : Gestionnaire principal du mode lecture.
- **`VerseDisplay.tsx`** : Affichage du Mushaf (mode page).
- **`AyahByAyahView.tsx`** : Affichage verset par verset.
- **`CompactSurahAudio.tsx`** : Lecteur audio flottant et sélection du récitateur.

### 🕋 Module Hifz (src/pages/hifz/)
L'application propose deux parcours distincts :
- **`CustomProgramme/`** : Parcours personnalisé avec questionnaire complet (Situation → Objectif → Disponibilité → Prénom).
- **`GuidedProgramme/`** : Parcours rapide avec rythmes pré-établis.
- **`shared/`** : Composants communs aux deux programmes (Calendrier, Graphiques, Citations).

### ⚙️ Logique & Données (src/lib/)
- **`quranApi.ts`** : Définition des types (`ApiVerse`, `ApiPageVerse`) et appels à l'API `api.alquran.cloud`.
- **`revisionHelper.ts`** : Algorithmes de calcul des pages à réviser et des séries (streaks).
- **`hifzSchedule.ts`** : Logique de planification du programme.

---

## 🛠️ Comment modifier... ?

### 📧 Changer l'email de contact
Va dans `src/pages/Contact.tsx` et modifie la variable `CONTACT_EMAIL`.

### 🎨 Modifier une taille de police ou une couleur
La plupart des styles utilisent **Tailwind CSS**. 
- Pour un changement global : `src/index.css` ou `tailwind.config.js`.
- Pour un élément précis : Modifie directement les classes `text-sm`, `text-xl`, etc., dans le fichier `.tsx` concerné.

### 🔢 Ajuster la logique du programme Hifz
Tout se passe dans `src/pages/hifz/CustomProgramme/QuestionnaireContainer.tsx` pour la navigation du formulaire et `src/lib/revisionHelper.ts` pour le calcul du suivi.

### 🎙️ Ajouter un nouveau récitateur
Modifie `src/data/reciters.ts` pour ajouter l'ID de l'API et le nom d'affichage.

---

## 📦 Dépendances Clés

- **React 18 + Vite** : Framework et outil de build ultra-rapide.
- **Tailwind CSS** : Pour tout le design (sans fichiers CSS complexes).
- **Framer Motion** : Pour les animations fluides et les transitions de pages.
- **Lucide React** : Bibliothèque d'icônes.
- **Recharts** : Pour les graphiques de progression dans le dashboard.

---

## ☁️ Déploiement

Le projet est configuré pour **Vercel**. 
Chaque push sur la branche `master` déclenche automatiquement un nouveau déploiement. 
Le fichier `vercel.json` gère les redirections pour React Router.

---

## 💡 Bonnes Pratiques
1. **Types** : Toujours utiliser les interfaces définies dans `src/types/` ou `src/lib/quranApi.ts`.
2. **Git** : Fais des petits commits clairs (ex: "Design: Ajustement taille police" plutôt que "Modif").
3. **Mobile First** : Vérifie toujours que tes changements de design s'affichent bien sur mobile (classes `sm:`, `md:`, `lg:`).

Qu'Allah facilite tes développements ! 🤲✨
