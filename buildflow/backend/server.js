
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, name: 'Marc Dupont',   role: 'Chef de projet' },
  { id: 2, name: 'Sophie Martin', role: 'Conducteur de travaux' },
  { id: 3, name: 'Julien Roux',   role: 'Conducteur de travaux' },
  { id: 4, name: 'Claire Leroy',  role: 'Chef de projet' },
];

const projects = [
  { id: 1, name: 'Résidence Les Acacias', location: 'Lyon, 69003', description: 'Construction d\'un immeuble résidentiel de 32 logements, R+5.', startDate: '2024-03-01', endDate: '2025-09-30', status: 'En cours', manager: 'Marc Dupont', budget: '4 200 000 €', progress: 42 },
  { id: 2, name: 'Centre Commercial Étoile', location: 'Bordeaux, 33000', description: 'Rénovation complète d\'un centre commercial de 8 500 m².', startDate: '2024-01-15', endDate: '2025-06-15', status: 'En cours', manager: 'Claire Leroy', budget: '7 800 000 €', progress: 68 },
  { id: 3, name: 'Entrepôt Logistique Nord', location: 'Lille, 59000', description: 'Construction d\'un entrepôt logistique de 12 000 m².', startDate: '2024-06-01', endDate: '2025-12-31', status: 'À faire', manager: 'Sophie Martin', budget: '5 500 000 €', progress: 8 },
];

let tasks = [
  { id: 1,  projectId: 1, title: 'Étude de sol géotechnique',       assignee: 'Marc Dupont',   deadline: '2024-04-15', priority: 'Haute',   status: 'Terminé',  description: 'Analyse complète du terrain avant fondations.' },
  { id: 2,  projectId: 1, title: 'Coulage des fondations',          assignee: 'Julien Roux',   deadline: '2024-06-01', priority: 'Haute',   status: 'Terminé',  description: 'Fondations en béton armé, profondeur 3m.' },
  { id: 3,  projectId: 1, title: 'Élévation structure R+1',         assignee: 'Julien Roux',   deadline: '2024-09-01', priority: 'Haute',   status: 'En cours', description: 'Montage des murs porteurs et dalles R+1.' },
  { id: 4,  projectId: 1, title: 'Installation réseau électrique',  assignee: 'Sophie Martin', deadline: '2024-10-15', priority: 'Moyenne', status: 'En cours', description: 'Tirage des câbles et pose des armoires.' },
  { id: 5,  projectId: 1, title: 'Pose menuiseries extérieures',    assignee: 'Marc Dupont',   deadline: '2025-01-20', priority: 'Moyenne', status: 'À faire',  description: 'Fenêtres et portes-fenêtres double vitrage.' },
  { id: 6,  projectId: 1, title: 'Validation plan sécurité incendie', assignee: 'Marc Dupont', deadline: '2024-08-30', priority: 'Haute',   status: 'Bloqué',   description: 'En attente de validation par la commission.' },
  { id: 7,  projectId: 1, title: 'Raccordement eau potable',        assignee: 'Julien Roux',   deadline: '2025-03-01', priority: 'Haute',   status: 'À faire',  description: 'Branchement réseau eau de la ville.' },
  { id: 8,  projectId: 2, title: 'Démolition ancienne façade',      assignee: 'Claire Leroy',  deadline: '2024-03-01', priority: 'Haute',   status: 'Terminé',  description: 'Démolition et évacuation des matériaux.' },
  { id: 9,  projectId: 2, title: 'Mise aux normes PMR allées',      assignee: 'Sophie Martin', deadline: '2024-05-15', priority: 'Haute',   status: 'Terminé',  description: 'Rampes, ascenseurs, signalétique adaptée.' },
  { id: 10, projectId: 2, title: 'Pose nouvelle façade vitrée',     assignee: 'Julien Roux',   deadline: '2024-08-01', priority: 'Haute',   status: 'En cours', description: 'Façade rideau aluminium et verre.' },
  { id: 11, projectId: 2, title: 'Réfection toiture-terrasse',      assignee: 'Claire Leroy',  deadline: '2024-09-30', priority: 'Moyenne', status: 'En cours', description: 'Étanchéité et isolation thermique.' },
  { id: 12, projectId: 2, title: 'Installation CVC zones commerce', assignee: 'Marc Dupont',   deadline: '2024-12-01', priority: 'Moyenne', status: 'À faire',  description: 'Chauffage, ventilation, climatisation.' },
  { id: 13, projectId: 2, title: 'Livraison lot électricité',       assignee: 'Sophie Martin', deadline: '2024-07-31', priority: 'Haute',   status: 'Bloqué',   description: 'Fournisseur en défaut de livraison.' },
  { id: 14, projectId: 3, title: 'Obtention permis de construire',  assignee: 'Claire Leroy',  deadline: '2024-07-01', priority: 'Haute',   status: 'Terminé',  description: 'Dépôt et suivi du dossier permis.' },
  { id: 15, projectId: 3, title: 'Préparation et terrassement',     assignee: 'Julien Roux',   deadline: '2024-08-15', priority: 'Haute',   status: 'En cours', description: 'Décapage, nivellement, évacuation terres.' },
  { id: 16, projectId: 3, title: 'Appel d\'offres charpente métal', assignee: 'Sophie Martin', deadline: '2024-09-01', priority: 'Haute',   status: 'À faire',  description: 'Consultation des entreprises charpente.' },
  { id: 17, projectId: 3, title: 'Étude thermique RE2020',          assignee: 'Marc Dupont',   deadline: '2024-08-01', priority: 'Moyenne', status: 'Bloqué',   description: 'Bureau d\'étude non encore désigné.' },
];

let nextTaskId = tasks.length + 1;

app.get('/projects', (req, res) => res.json(projects));

app.get('/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
  res.json(project);
});

app.get('/tasks', (req, res) => {
  const { projectId } = req.query;
  if (projectId) return res.json(tasks.filter(t => t.projectId === parseInt(projectId)));
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title, projectId, assignee, deadline, priority, status, description } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: 'Le titre et le projet sont requis.' });
  const newTask = { id: nextTaskId++, projectId: parseInt(projectId), title, assignee: assignee || 'Non assigné', deadline: deadline || '', priority: priority || 'Moyenne', status: status || 'À faire', description: description || '' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  Object.assign(task, req.body);
  res.json(task);
});

app.get('/users', (req, res) => res.json(users));

app.listen(PORT, () => console.log(`BuildFlow API running at http://localhost:${PORT}`));
