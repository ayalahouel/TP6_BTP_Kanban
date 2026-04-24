<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">🏗️ Chantiers en cours</h1>
      <span class="project-count">{{ projects.length }} projet(s)</span>
    </div>
    <div v-if="loading" class="loading">Chargement des chantiers...</div>
    <div v-else-if="error" class="error-msg">⚠️ Impossible de charger les projets. Vérifiez que le backend tourne sur le port 3000.</div>
    <div v-else class="projects-grid">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ProjectCard from '../components/ProjectCard.vue'
export default {
  name: 'Projects',
  components: { ProjectCard },
  data() { return { projects: [], loading: true, error: false } },
  async created() {
    try {
      const res = await axios.get('http://localhost:3000/projects')
      this.projects = res.data
    } catch (e) { this.error = true } finally { this.loading = false }
  },
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.page-title { margin-bottom: 0; }
.project-count { font-size: 13px; color: var(--c-text-muted); border: 1px solid var(--c-border); border-radius: 20px; padding: 4px 14px; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.loading { color: var(--c-text-muted); padding: 40px 0; text-align: center; }
.error-msg { background: var(--c-red-dim); color: #fca5a5; border: 1px solid var(--c-red); border-radius: var(--radius); padding: 16px 20px; font-size: 14px; }
</style>
