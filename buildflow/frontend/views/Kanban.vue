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
    <div class="filters">
      <input v-model="filterText" type="text" placeholder="🔍 Rechercher une tâche..." class="filter-input" />
      <select v-model="filterPriority" class="filter-select">
        <option value="">Toutes les priorités</option>
        <option>Haute</option>
        <option>Moyenne</option>
        <option>Basse</option>
      </select>
    </div>
    <TaskForm v-if="showForm && project" :projectId="project.id" @task-added="onTaskAdded" @cancel="showForm = false" />
    <div v-if="loading" class="loading">Chargement du tableau Kanban...</div>
    <div v-else class="kanban-board">
      <KanbanColumn v-for="col in columns" :key="col.status" :title="col.label" :tasks="filteredTasks(col.status)" :color="col.color" @task-click="goToTask" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import KanbanColumn from '../components/KanbanColumn.vue'
import TaskForm from '../components/TaskForm.vue'
export default {
  name: 'Kanban',
  components: { KanbanColumn, TaskForm },
  props: { id: { type: String, required: true } },
  data() {
    return {
      project: null, tasks: [], loading: true, showForm: false,
      filterText: '', filterPriority: '',
      columns: [
        { status: 'À faire',  label: 'À faire',  color: '#7a8099' },
        { status: 'En cours', label: 'En cours',  color: '#2b7fff' },
        { status: 'Bloqué',   label: 'Bloqué',    color: '#ef4444' },
        { status: 'Terminé',  label: 'Terminé',   color: '#22c55e' },
      ],
    }
  },
  async created() {
    try {
      const [projRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:3000/projects/${this.id}`),
        axios.get(`http://localhost:3000/tasks?projectId=${this.id}`),
      ])
      this.project = projRes.data
      this.tasks   = tasksRes.data
    } catch (e) { console.error(e) } finally { this.loading = false }
  },
  methods: {
    filteredTasks(status) {
      return this.tasks.filter(t =>
        t.status === status &&
        (!this.filterText     || t.title.toLowerCase().includes(this.filterText.toLowerCase())) &&
        (!this.filterPriority || t.priority === this.filterPriority)
      )
    },
    onTaskAdded(task) { this.tasks.push(task); this.showForm = false },
    goToTask(task) { this.$router.push({ name: 'task-detail', params: { id: task.id } }) },
  },
}
</script>

<style scoped>
.kanban-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.back-link { font-size: 13px; color: var(--c-text-muted); }
.back-link:hover { color: var(--c-blue-light); }
.project-meta { font-size: 13px; color: var(--c-text-muted); margin-top: 4px; }
.filters { display: flex; gap: 12px; margin-bottom: 20px; }
.filter-input { flex: 1; }
.filter-select { width: 200px; }
.kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 24px; align-items: flex-start; }
.loading { color: var(--c-text-muted); padding: 40px 0; text-align: center; }
</style>
