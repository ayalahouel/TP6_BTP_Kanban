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

## 🗂️ Screenshots
<img width="1436" height="358" alt="image" src="https://github.com/user-attachments/assets/1cdb1200-f817-4fc4-a96c-c49f18e6d559" />

<img width="1038" height="402" alt="image" src="https://github.com/user-attachments/assets/559c9625-8fb5-45f5-a0d7-8346ddb10c4a" />

<img width="999" height="338" alt="image" src="https://github.com/user-attachments/assets/a2d60942-3dd4-47d7-b964-e19a80e3c177" />

<img width="1026" height="573" alt="image" src="https://github.com/user-attachments/assets/7b322e73-4609-4754-9dd7-e0f3fcb8d8bb" />

<img width="1031" height="364" alt="image" src="https://github.com/user-attachments/assets/e55452b2-18d4-4080-b565-f55898b50e9d" />

<img width="1435" height="803" alt="image" src="https://github.com/user-attachments/assets/b059dc2c-54bc-4a0c-82de-f7e0c7d33506" />






