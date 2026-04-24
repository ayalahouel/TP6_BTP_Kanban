# 🏗️ BuildFlow — Gestion de Chantiers BTP

Application web de gestion de projets BTP avec tableau Kanban.
Stack : **Vue 3** (frontend) + **Node.js / Express** (backend)

---

## 👥 Équipe

| Membre       | Rôle                                                 |
| ------------ | ---------------------------------------------------- |
| Lahouel Eya  | Frontend — Composants Vue, routing, styles globaux   |
| Kraiem Rania | Backend — API Express, données, intégration frontend |

### Répartition détaillée

**Lahouel Eya — Frontend**

- Mise en place du projet Vue 3 + Vite
- Composants : `Navbar`, `ProjectCard`, `KanbanColumn`, `TaskCard`, `TaskForm`
- Vues : `Home.vue`, `Projects.vue`, `Kanban.vue`, `TaskDetail.vue`
- Système de filtrage (texte + priorité)
- Styles globaux et palette BTP (`main.css`)
- Configuration Vue Router

**Kraiem Rania — Backend & Intégration**

- Mise en place du serveur Express
- Routes REST : `GET /projects`, `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `GET /users`
- Jeu de données crédible (3 chantiers, 17 tâches, 4 profils)
- Configuration CORS et middleware
- Tests des endpoints API
- Initialisation du dépôt GitHub et gestion des commits

---

## 🚀 Lancement rapide

### 1. Backend

```bash
cd backend
npm install
npm start
# API disponible sur http://localhost:9000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App disponible sur http://localhost:8080
```

> ⚠️ Lancer le backend **avant** le frontend.

---

## 🗂️ Screenshots

<img width="1436" height="358" alt="image" src="https://github.com/user-attachments/assets/1cdb1200-f817-4fc4-a96c-c49f18e6d559" />

<img width="1038" height="402" alt="image" src="https://github.com/user-attachments/assets/559c9625-8fb5-45f5-a0d7-8346ddb10c4a" />

<img width="999" height="338" alt="image" src="https://github.com/user-attachments/assets/a2d60942-3dd4-47d7-b964-e19a80e3c177" />

<img width="1026" height="573" alt="image" src="https://github.com/user-attachments/assets/7b322e73-4609-4754-9dd7-e0f3fcb8d8bb" />

<img width="1031" height="364" alt="image" src="https://github.com/user-attachments/assets/e55452b2-18d4-4080-b565-f55898b50e9d" />

<img width="1435" height="803" alt="image" src="https://github.com/user-attachments/assets/b059dc2c-54bc-4a0c-82de-f7e0c7d33506" />

---

## 🔧 Reprise — Partie 2 _(Corrections & Améliorations)_

## 🔧 Nazari Ibrahim

> Reprise croisée effectuée conformément aux consignes du TP Partie 2.
> Branche dédiée : `reprise-grp2`

### 🐛 Bugs corrigés

| Fichier             | Problème                                                                                                            | Correction                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Tous les composants | Port API codé en dur à `3000` alors que le backend tourne sur `9000`                                                | Création de `frontend/api.js` centralisant `API_BASE = 'http://localhost:9000'` ; import dans tous les composants |
| `frontend/`         | Fichiers manquants au démarrage (`package.json`, `main.js`, `App.vue`, `router.js`, `vite.config.js`, `index.html`) | Création de tous ces fichiers de scaffolding                                                                      |
| `backend/`          | `package.json` absent → `npm install` / `npm start` impossibles                                                     | Création du `package.json` avec dépendances `express` et `cors`                                                   |
| `main.css`          | Variable `--c-yellow` manquante → barre de priorité « Moyenne » invisible                                           | Ajout de `--c-yellow: #eab308`                                                                                    |
| `main.css`          | Classes `.prio-haute / .prio-moyenne / .prio-basse` absentes du CSS global                                          | Ajout des classes avec couleur + fond                                                                             |

### ✨ Fonctionnalités Kanban avancées ajoutées

#### 1. Déplacement rapide de tâche entre colonnes

- **`TaskCard.vue`** : ajout d'un `<select>` en bas de chaque carte pour changer de colonne directement sans quitter le Kanban
- **`KanbanColumn.vue`** : émission de l'événement `move-task` vers le parent
- **`Kanban.vue`** : méthode `moveTask()` qui appelle `PATCH /tasks/:id` et met à jour la liste en mémoire

#### 2. Filtres combinés

- **`Kanban.vue`** : ajout du filtre **Responsable** (en plus du texte et de la priorité existants)
- La liste des responsables est générée dynamiquement à partir des tâches du projet courant

#### 3. Tri par échéance ou priorité

- **`Kanban.vue`** : nouveau `<select>` de tri (par défaut / par échéance / par priorité)
- Le tri s'applique colonne par colonne sans affecter les filtres

#### 4. Modification d'une tâche existante

- **`TaskDetail.vue`** : bouton **✏️ Modifier** ouvre un formulaire d'édition inline
- Champs éditables : titre, description, notes, responsable, priorité, statut, échéance
- Sauvegarde via `PATCH /tasks/:id`

#### 5. Suppression d'une tâche avec confirmation

- **`TaskDetail.vue`** : bouton **🗑 Supprimer** ouvre une modal de confirmation
- Suppression via `DELETE /tasks/:id` (nouvelle route backend)
- Redirection automatique vers le Kanban après suppression

#### 6. Notes de chantier par tâche

- **`TaskDetail.vue`** : champ **Notes de chantier** visible en lecture et éditable en mode modification
- Le champ `notes` est sauvegardé via `PATCH /tasks/:id` (le backend stocke tout champ transmis dans le body)

#### 7. Gestion des états d'interface

- **Toast de succès/erreur** sur Kanban et TaskDetail (disparaît après 3 s)
- Indicateur **« En retard »** sur les cartes et la page détail (badge rouge si `deadline < aujourd'hui` et statut ≠ Terminé)
- États **chargement / erreur / liste vide** présents sur toutes les vues

#### 8. Amélioration de la lisibilité

- Ajout de `--c-yellow` et classes `.prio` avec fond coloré pour les niveaux de priorité
- Bouton **Danger** (`.btn-danger`) en rouge pour les actions destructrices
- Séparation visuelle des zones notes dans le détail tâche (`pre-wrap`, fond distinct)

### 🔌 Modifications backend

| Route        | Méthode              | Description                        |
| ------------ | -------------------- | ---------------------------------- |
| `/tasks/:id` | `DELETE` _(ajouté)_  | Supprime une tâche par son id      |
| `/tasks/:id` | `PATCH` _(existant)_ | Accepte désormais le champ `notes` |

### 📁 Nouveaux fichiers créés

```
frontend/
├── api.js               ← URL de base de l'API (port 9000)
├── main.js              ← Point d'entrée Vue
├── App.vue              ← Composant racine
├── router.js            ← Routes Vue Router
├── vite.config.js       ← Configuration Vite (port 8080)
├── index.html           ← HTML principal
└── assets/
    └── main.css         ← Variables CSS + styles globaux
backend/
└── package.json         ← Dépendances Express + cors
```
