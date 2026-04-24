<template>
  <div class="page">
    <router-link :to="backLink" class="back-link">← Retour au Kanban</router-link>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="task" class="task-detail">
      <div class="detail-header">
        <div>
          <h1 class="page-title">{{ task.title }}</h1>
          <p class="task-project">Projet ID #{{ task.projectId }}</p>
        </div>
        <span :class="statusBadgeClass">{{ task.status }}</span>
      </div>
      <div class="detail-grid">
        <div class="detail-main card">
          <h3 class="section-title">Description</h3>
          <p class="task-desc">{{ task.description || 'Aucune description fournie.' }}</p>
        </div>
        <div class="detail-sidebar">
          <div class="card meta-card">
            <div class="meta-row"><span class="meta-key">Responsable</span><span>{{ task.assignee }}</span></div>
            <div class="meta-row"><span class="meta-key">Priorité</span><span :class="'prio-' + task.priority.toLowerCase()">{{ task.priority }}</span></div>
            <div class="meta-row"><span class="meta-key">Échéance</span><span>{{ formattedDate || '—' }}</span></div>
            <div class="meta-row">
              <span class="meta-key">Statut</span>
              <select v-model="task.status" @change="updateStatus" class="status-select">
                <option>À faire</option>
                <option>En cours</option>
                <option>Bloqué</option>
                <option>Terminé</option>
              </select>
            </div>
          </div>
          <div class="back-btn-wrap">
            <router-link :to="backLink" class="btn btn-ghost" style="display:inline-flex">← Retour au Kanban</router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error-msg">Tâche introuvable.</div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TaskDetail',
  props: { id: { type: String, required: true } },
  data() { return { task: null, loading: true } },
  computed: {
    formattedDate() {
      if (!this.task?.deadline) return ''
      return new Date(this.task.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    statusBadgeClass() {
      const map = { 'À faire': 'badge badge-todo', 'En cours': 'badge badge-inprog', 'Bloqué': 'badge badge-blocked', 'Terminé': 'badge badge-done' }
      return map[this.task?.status] || 'badge badge-todo'
    },
    backLink() { return this.task ? `/kanban/${this.task.projectId}` : '/projects' },
  },
  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/tasks/${this.id}`)
      this.task = res.data
    } catch (e) { console.error(e) } finally { this.loading = false }
  },
  methods: {
    async updateStatus() {
      try { await axios.patch(`http://localhost:3000/tasks/${this.task.id}`, { status: this.task.status }) }
      catch (e) { console.error(e) }
    },
  },
}
</script>

<style scoped>
.back-link { font-size: 13px; color: var(--c-text-muted); display: inline-block; margin-bottom: 20px; }
.back-link:hover { color: var(--c-blue-light); }
.detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.task-project { font-size: 13px; color: var(--c-text-muted); margin-top: 4px; }
.detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
.section-title { font-family: var(--font-condensed); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-text-muted); margin-bottom: 12px; }
.task-desc { font-size: 14px; line-height: 1.7; color: var(--c-text-muted); }
.meta-card { display: flex; flex-direction: column; gap: 14px; }
.meta-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.meta-key { color: var(--c-text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
.status-select { width: auto; padding: 4px 8px; font-size: 13px; }
.back-btn-wrap { margin-top: 12px; }
.loading { color: var(--c-text-muted); padding: 40px 0; text-align: center; }
.error-msg { color: var(--c-red); padding: 20px 0; }
</style>
