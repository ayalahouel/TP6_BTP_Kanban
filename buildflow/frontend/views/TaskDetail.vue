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
        <div class="header-actions">
          <span :class="statusBadgeClass">{{ task.status }}</span>
          <button class="btn btn-ghost" @click="editMode = !editMode">
            {{ editMode ? '✕ Annuler' : '✏️ Modifier' }}
          </button>
          <button class="btn btn-danger" @click="confirmDelete = true">🗑 Supprimer</button>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="confirmDelete" class="modal-overlay" @click.self="confirmDelete = false">
        <div class="modal">
          <h3 class="modal-title">Confirmer la suppression</h3>
          <p class="modal-body">Voulez-vous vraiment supprimer la tâche <strong>« {{ task.title }} »</strong> ? Cette action est irréversible.</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="confirmDelete = false">Annuler</button>
            <button class="btn btn-danger" :disabled="deleting" @click="deleteTask">
              {{ deleting ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </div>
      </div>

      <!-- View mode -->
      <div v-if="!editMode" class="detail-grid">
        <div class="detail-main card">
          <h3 class="section-title">Description</h3>
          <p class="task-desc">{{ task.description || 'Aucune description fournie.' }}</p>

          <h3 class="section-title" style="margin-top: 24px">Notes de chantier</h3>
          <p v-if="task.notes" class="task-desc notes-text">{{ task.notes }}</p>
          <p v-else class="task-desc" style="font-style: italic;">Aucune note pour cette tâche.</p>
        </div>
        <div class="detail-sidebar">
          <div class="card meta-card">
            <div class="meta-row"><span class="meta-key">Responsable</span><span>{{ task.assignee }}</span></div>
            <div class="meta-row"><span class="meta-key">Priorité</span><span :class="'prio prio-' + task.priority.toLowerCase()">{{ task.priority }}</span></div>
            <div class="meta-row"><span class="meta-key">Échéance</span><span :class="{ 'text-red': isLate }">{{ formattedDate || '—' }}<span v-if="isLate" class="late-badge">En retard</span></span></div>
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

      <!-- Edit mode -->
      <div v-else class="edit-form card">
        <h3 class="section-title">Modifier la tâche</h3>
        <div class="field">
          <label>Titre *</label>
          <input v-model="editData.title" type="text" />
        </div>
        <div class="field">
          <label>Description</label>
          <textarea v-model="editData.description" rows="3"></textarea>
        </div>
        <div class="field">
          <label>Notes de chantier</label>
          <textarea v-model="editData.notes" rows="3" placeholder="Ajoutez des notes ou commentaires sur cette tâche..."></textarea>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Responsable</label>
            <select v-model="editData.assignee">
              <option v-for="u in users" :key="u.id" :value="u.name">{{ u.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Priorité</label>
            <select v-model="editData.priority">
              <option>Haute</option>
              <option>Moyenne</option>
              <option>Basse</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Statut</label>
            <select v-model="editData.status">
              <option>À faire</option>
              <option>En cours</option>
              <option>Bloqué</option>
              <option>Terminé</option>
            </select>
          </div>
          <div class="field">
            <label>Échéance</label>
            <input v-model="editData.deadline" type="date" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-ghost" @click="editMode = false">Annuler</button>
          <button class="btn btn-primary" :disabled="saving" @click="saveEdit">
            {{ saving ? 'Enregistrement...' : '✓ Enregistrer les modifications' }}
          </button>
        </div>
      </div>

      <!-- Success toast -->
      <div v-if="toast.msg" :class="['toast', 'toast-' + toast.type]">{{ toast.msg }}</div>
    </div>

    <div v-else class="error-msg">Tâche introuvable.</div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE } from '../api.js'

export default {
  name: 'TaskDetail',
  props: { id: { type: String, required: true } },
  data() {
    return {
      task: null, loading: true, editMode: false, saving: false,
      confirmDelete: false, deleting: false,
      editData: {},
      users: [],
      toast: { msg: '', type: 'success' },
    }
  },
  computed: {
    formattedDate() {
      if (!this.task?.deadline) return ''
      return new Date(this.task.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    isLate() {
      if (!this.task?.deadline || this.task.status === 'Terminé') return false
      return new Date(this.task.deadline) < new Date()
    },
    statusBadgeClass() {
      const map = { 'À faire': 'badge badge-todo', 'En cours': 'badge badge-inprog', 'Bloqué': 'badge badge-blocked', 'Terminé': 'badge badge-done' }
      return map[this.task?.status] || 'badge badge-todo'
    },
    backLink() { return this.task ? `/kanban/${this.task.projectId}` : '/projects' },
  },
  async created() {
    try {
      const [taskRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/tasks/${this.id}`),
        axios.get(`${API_BASE}/users`),
      ])
      this.task  = taskRes.data
      this.users = usersRes.data
      this.resetEditData()
    } catch (e) { console.error(e) } finally { this.loading = false }
  },
  methods: {
    resetEditData() {
      this.editData = { ...this.task }
    },
    async updateStatus() {
      try {
        const res = await axios.patch(`${API_BASE}/tasks/${this.task.id}`, { status: this.task.status })
        this.task = res.data
        this.showToast('Statut mis à jour.')
      } catch (e) { this.showToast('Erreur lors de la mise à jour.', 'error') }
    },
    async saveEdit() {
      if (!this.editData.title?.trim()) return this.showToast('Le titre est obligatoire.', 'error')
      this.saving = true
      try {
        const res = await axios.patch(`${API_BASE}/tasks/${this.task.id}`, this.editData)
        this.task = res.data
        this.resetEditData()
        this.editMode = false
        this.showToast('Tâche modifiée avec succès !')
      } catch (e) { this.showToast('Erreur lors de la sauvegarde.', 'error') }
      finally { this.saving = false }
    },
    async deleteTask() {
      this.deleting = true
      try {
        await axios.delete(`${API_BASE}/tasks/${this.task.id}`)
        this.$router.push(this.backLink)
      } catch (e) { this.showToast('Erreur lors de la suppression.', 'error') }
      finally { this.deleting = false }
    },
    showToast(msg, type = 'success') {
      this.toast = { msg, type }
      setTimeout(() => { this.toast = { msg: '', type: 'success' } }, 3000)
    },
  },
}
</script>

<style scoped>
.back-link { font-size: 13px; color: var(--c-text-muted); display: inline-block; margin-bottom: 20px; }
.back-link:hover { color: var(--c-blue-light); }
.detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.task-project { font-size: 13px; color: var(--c-text-muted); margin-top: 4px; }
.detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
.section-title { font-family: var(--font-condensed); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-text-muted); margin-bottom: 12px; }
.task-desc { font-size: 14px; line-height: 1.7; color: var(--c-text-muted); }
.notes-text { white-space: pre-wrap; background: var(--c-surface2); border-radius: var(--radius); padding: 12px; border: 1px solid var(--c-border); }
.meta-card { display: flex; flex-direction: column; gap: 14px; }
.meta-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.meta-key { color: var(--c-text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
.status-select { width: auto; padding: 4px 8px; font-size: 13px; }
.back-btn-wrap { margin-top: 12px; }
.text-red { color: var(--c-red); }
.late-badge { display: inline-block; margin-left: 6px; background: var(--c-red-dim); color: #fca5a5; border-radius: 10px; padding: 1px 7px; font-size: 10px; font-weight: 600; }

/* Edit form */
.edit-form { margin-top: 0; }
.field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }

/* Delete confirmation modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); padding: 28px; max-width: 440px; width: 90%; }
.modal-title { font-family: var(--font-condensed); font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.modal-body { font-size: 14px; color: var(--c-text-muted); line-height: 1.6; margin-bottom: 20px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* Toast */
.toast { position: fixed; bottom: 28px; right: 28px; padding: 12px 20px; border-radius: var(--radius); font-size: 14px; font-weight: 600; z-index: 999; animation: slideIn 0.2s ease; }
.toast-success { background: rgba(34,197,94,0.15); border: 1px solid var(--c-green); color: var(--c-green); }
.toast-error   { background: var(--c-red-dim); border: 1px solid var(--c-red); color: var(--c-red); }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.loading { color: var(--c-text-muted); padding: 40px 0; text-align: center; }
.error-msg { color: var(--c-red); padding: 20px 0; }
</style>
