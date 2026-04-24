# 🏗️ BuildFlow — Gestion de Chantiers BTP

Application web de gestion de projets BTP avec tableau Kanban.
Stack : **Vue 3** (frontend) + **Node.js / Express** (backend)

---

## 👥 Équipe

| Membre | Rôle |
|---|---|
| Lahouel Eya | Frontend — Composants Vue, routing, styles globaux |
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
# API disponible sur http://localhost:3000
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

## 🗂️ Arborescence
