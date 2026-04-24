<template>
  <div class="page">
    <div v-if="project" class="kanban-header">
      <div>
        <router-link to="/projects" class="back-link">← Retour aux chantiers</router-link>
        <h1 class="page-title" style="margin-top: 8px">{{ project.name }}</h1>
        <p class="project-meta">📍 {{ project.location }} · Chef de projet : {{ project.manager }}</p>
      </div>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '✕ Annuler' : '+ Ajouter une tâche' }}
      </button>
    </div>

    <!-- Filters & sort -->
    <div class="filters">
      <input v-model="filterText" type="text" placeholder="🔍 Rechercher une tâche..." class="filter-input" />
      <select v-model="filterPriority" class="filter-select">
        <option value="">Toutes les priorités</option>
        <option>Haute</option>
        <option>Moyenne</option>
        <option>Basse</option>
      </select>
      <select v-model="filterAssignee" class="filter-select">
        <option value="">Tous les responsables</option>
        <option v-for="u in assignees" :key="u" :value="u">{{ u }}</option>
      </select>
      <select v-model="sortBy" class="filter-select">
        <option value="">Trier par défaut</option>
        <option value="deadline">Trier par échéance</option>
        <option value="priority">Trier par priorité</option>
      </select>
    </div>

    <TaskForm v-if="showForm && project" :projectId="project.id" @task-added="onTaskAdded" @cancel="showForm = false" />

    <!-- Success / error toasts -->
    <div v-if="toast.msg" :class="['toast', 'toast-' + toast.type]">{{ toast.msg }}</div>

    <div v-if="loading" class="loading">Chargement du tableau Kanban...</div>
    <div v-else class="kanban-board">
      <KanbanColumn
        v-for="col in columns"
        :key="col.status"
        :title="col.label"
        :tasks="filteredTasks(col.status)"
        :color="col.color"
        @task-click="goToTask"
        @move-task="moveTask"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE } from '../api.js'
import KanbanColumn from '../components/KanbanColumn.vue'
import TaskForm from '../components/TaskForm.vue'

const PRIORITY_ORDER = { Haute: 0, Moyenne: 1, Basse: 2 }

export default {
  name: 'Kanban',
  components: { KanbanColumn, TaskForm },
  props: { id: { type: String, required: true } },
  data() {
    return {
      project: null, tasks: [], loading: true, showForm: false,
      filterText: '', filterPriority: '', filterAssignee: '', sortBy: '',
      toast: { msg: '', type: 'success' },
      columns: [
        { status: 'À faire',  label: 'À faire',  color: '#7a8099' },
        { status: 'En cours', label: 'En cours',  color: '#2b7fff' },
        { status: 'Bloqué',   label: 'Bloqué',    color: '#ef4444' },
        { status: 'Terminé',  label: 'Terminé',   color: '#22c55e' },
      ],
    }
  },
  computed: {
    assignees() {
      return [...new Set(this.tasks.map(t => t.assignee).filter(Boolean))]
    },
  },
  async created() {
    try {
      const [projRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE}/projects/${this.id}`),
        axios.get(`${API_BASE}/tasks?projectId=${this.id}`),
      ])
      this.project = projRes.data
      this.tasks   = tasksRes.data
    } catch (e) { console.error(e) } finally { this.loading = false }
  },
  methods: {
    filteredTasks(status) {
      let list = this.tasks.filter(t =>
        t.status === status &&
        (!this.filterText     || t.title.toLowerCase().includes(this.filterText.toLowerCase())) &&
        (!this.filterPriority || t.priority === this.filterPriority) &&
        (!this.filterAssignee || t.assignee === this.filterAssignee)
      )
      if (this.sortBy === 'deadline') {
        list = [...list].sort((a, b) => {
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline) - new Date(b.deadline)
        })
      } else if (this.sortBy === 'priority') {
        list = [...list].sort((a, b) =>
          (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
        )
      }
      return list
    },
    onTaskAdded(task) {
      this.tasks.push(task)
      this.showForm = false
      this.showToast('Tâche ajoutée avec succès !', 'success')
    },
    async moveTask({ task, newStatus }) {
      try {
        const res = await axios.patch(`${API_BASE}/tasks/${task.id}`, { status: newStatus })
        const idx = this.tasks.findIndex(t => t.id === task.id)
        if (idx !== -1) this.tasks[idx] = res.data
        this.showToast(`Tâche déplacée vers « ${newStatus} »`, 'success')
      } catch (e) {
        this.showToast('Erreur lors du déplacement de la tâche.', 'error')
      }
    },
    goToTask(task) { this.$router.push({ name: 'task-detail', params: { id: task.id } }) },
    showToast(msg, type = 'success') {
      this.toast = { msg, type }
      setTimeout(() => { this.toast = { msg: '', type: 'success' } }, 3000)
    },
  },
}
</script>

<style scoped>
.kanban-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.back-link { font-size: 13px; color: var(--c-text-muted); }
.back-link:hover { color: var(--c-blue-light); }
.project-meta { font-size: 13px; color: var(--c-text-muted); margin-top: 4px; }
.filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-input { flex: 1; min-width: 180px; }
.filter-select { width: 180px; }
.kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 24px; align-items: flex-start; }
.loading { color: var(--c-text-muted); padding: 40px 0; text-align: center; }
.toast { position: fixed; bottom: 28px; right: 28px; padding: 12px 20px; border-radius: var(--radius); font-size: 14px; font-weight: 600; z-index: 999; animation: slideIn 0.2s ease; }
.toast-success { background: rgba(34,197,94,0.15); border: 1px solid var(--c-green); color: var(--c-green); }
.toast-error   { background: var(--c-red-dim); border: 1px solid var(--c-red); color: var(--c-red); }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
