<template>
  <div class="project-card card" @click="goToKanban">
    <div class="card-header">
      <span class="card-icon">🏗️</span>
      <span :class="statusBadgeClass">{{ project.status }}</span>
    </div>
    <h3 class="card-title">{{ project.name }}</h3>
    <p class="card-location">📍 {{ project.location }}</p>
    <p class="card-desc">{{ project.description }}</p>
    <div class="progress-section">
      <div class="progress-header">
        <span>Avancement</span>
        <strong>{{ project.progress }}%</strong>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
      </div>
    </div>
    <div class="card-meta">
      <div class="meta-item">
        <span class="meta-label">Chef de projet</span>
        <span>{{ project.manager }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Budget</span>
        <span class="meta-budget">{{ project.budget }}</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="see-kanban">Voir le Kanban →</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: { project: { type: Object, required: true } },
  computed: {
    statusBadgeClass() {
      const map = { 'En cours': 'badge badge-inprog', 'À faire': 'badge badge-todo', 'Terminé': 'badge badge-done', 'Bloqué': 'badge badge-blocked' };
      return map[this.project.status] || 'badge badge-todo';
    },
  },
  methods: {
    goToKanban() { this.$router.push({ name: 'kanban', params: { id: this.project.id } }); },
  },
}
</script>

<style scoped>
.project-card { cursor: pointer; display: flex; flex-direction: column; gap: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-icon { font-size: 20px; }
.card-title { font-family: var(--font-condensed); font-size: 20px; font-weight: 700; line-height: 1.2; }
.card-location { font-size: 13px; color: var(--c-text-muted); }
.card-desc { font-size: 13px; color: var(--c-text-muted); line-height: 1.5; }
.progress-section { display: flex; flex-direction: column; gap: 5px; }
.progress-header { display: flex; justify-content: space-between; font-size: 13px; color: var(--c-text-muted); }
.progress-bar { height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--c-blue), var(--c-blue-light)); border-radius: 3px; transition: width 0.6s ease; }
.card-meta { display: flex; justify-content: space-between; font-size: 13px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 11px; color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.meta-budget { color: var(--c-orange); font-weight: 600; }
.card-footer { margin-top: auto; border-top: 1px solid var(--c-border); padding-top: 12px; }
.see-kanban { font-size: 13px; font-weight: 600; color: var(--c-blue-light); }
</style>
