<template>
  <div class="task-form">
    <h3 class="form-title">➕ Nouvelle tâche</h3>
    <form @submit.prevent="submitTask">
      <div class="field">
        <label for="title">Titre *</label>
        <input id="title" v-model="form.title" type="text" placeholder="Ex : Pose des fenêtres R+2" required />
        <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" rows="2" placeholder="Détails de la tâche..."></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="assignee">Responsable</label>
          <select id="assignee" v-model="form.assignee">
            <option value="">— Choisir —</option>
            <option v-for="u in users" :key="u.id" :value="u.name">{{ u.name }} ({{ u.role }})</option>
          </select>
        </div>
        <div class="field">
          <label for="priority">Priorité</label>
          <select id="priority" v-model="form.priority">
            <option>Haute</option>
            <option>Moyenne</option>
            <option>Basse</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="status">Statut initial</label>
          <select id="status" v-model="form.status">
            <option>À faire</option>
            <option>En cours</option>
            <option>Bloqué</option>
            <option>Terminé</option>
          </select>
        </div>
        <div class="field">
          <label for="deadline">Échéance</label>
          <input id="deadline" v-model="form.deadline" type="date" />
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Annuler</button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Ajouter la tâche' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE } from '../api.js'
export default {
  name: 'TaskForm',
  props: { projectId: { type: Number, required: true } },
  emits: ['task-added', 'cancel'],
  data() {
    return {
      loading: false,
      form: { title: '', description: '', assignee: '', priority: 'Moyenne', status: 'À faire', deadline: '' },
      errors: {},
      users: [],
    }
  },
  async created() {
    try {
      const res = await axios.get(`${API_BASE}/users`)
      this.users = res.data
    } catch (e) { console.error(e) }
  },
  methods: {
    validate() {
      this.errors = {}
      if (!this.form.title.trim()) this.errors.title = 'Le titre est obligatoire.'
      return Object.keys(this.errors).length === 0
    },
    async submitTask() {
      if (!this.validate()) return
      this.loading = true
      try {
        const res = await axios.post(`${API_BASE}/tasks`, { ...this.form, projectId: this.projectId })
        this.$emit('task-added', res.data)
        this.form = { title: '', description: '', assignee: '', priority: 'Moyenne', status: 'À faire', deadline: '' }
        this.errors = {}
      } catch (e) { console.error(e) } finally { this.loading = false }
    },
  },
}
</script>

<style scoped>
.task-form { background: var(--c-surface); border: 1px solid var(--c-blue); border-radius: var(--radius-lg); padding: 24px; margin-top: 24px; }
.form-title { font-family: var(--font-condensed); font-size: 18px; font-weight: 700; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field-error { font-size: 12px; color: var(--c-red); }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
</style>
