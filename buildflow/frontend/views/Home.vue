<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-tag">Gestion de chantiers BTP</div>
        <h1 class="hero-title">Suivez vos chantiers,<br><span class="hero-accent">maîtrisez vos délais.</span></h1>
        <p class="hero-sub">BuildFlow centralise vos projets de construction et vous donne une vue claire de l'avancement de chaque tâche grâce à un tableau Kanban adapté au BTP.</p>
        <div class="hero-actions">
          <router-link to="/projects" class="btn btn-primary">Voir les chantiers →</router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-grid">
          <div class="vis-col" v-for="col in kanbanPreview" :key="col.label">
            <div class="vis-col-head" :style="{ background: col.color }">{{ col.label }}</div>
            <div class="vis-card" v-for="n in col.count" :key="n"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="features page">
      <h2 class="page-title">Fonctionnalités</h2>
      <div class="features-grid">
        <div class="feat-card card" v-for="f in features" :key="f.icon">
          <span class="feat-icon">{{ f.icon }}</span>
          <h3 class="feat-title">{{ f.title }}</h3>
          <p class="feat-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>
    <section class="stats page">
      <div class="stat-item" v-for="s in stats" :key="s.label">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      kanbanPreview: [
        { label: 'À faire',  color: '#2a2f42', count: 2 },
        { label: 'En cours', color: '#1e3a5f', count: 3 },
        { label: 'Bloqué',   color: '#7f1d1d', count: 1 },
        { label: 'Terminé',  color: '#14532d', count: 2 },
      ],
      features: [
        { icon: '🏗️', title: 'Suivi de chantiers', desc: 'Visualisez tous vos projets BTP en cours, leur avancement et leur budget.' },
        { icon: '📋', title: 'Tableau Kanban',      desc: 'Organisez les tâches en colonnes (À faire, En cours, Bloqué, Terminé).' },
        { icon: '👥', title: 'Gestion des équipes', desc: 'Assignez chaque tâche à un chef de projet ou conducteur de travaux.' },
        { icon: '⚡', title: 'Filtrage rapide',     desc: 'Retrouvez n\'importe quelle tâche par statut, priorité ou mot-clé.' },
      ],
      stats: [
        { value: '3',   label: 'Chantiers actifs' },
        { value: '17',  label: 'Tâches suivies' },
        { value: '4',   label: 'Membres d\'équipe' },
        { value: '42%', label: 'Avancement moyen' },
      ],
    }
  },
}
</script>

<style scoped>
.hero { display: flex; align-items: center; justify-content: space-between; gap: 48px; padding: 64px 48px; background: linear-gradient(135deg, var(--c-surface) 0%, var(--c-bg) 100%); border-bottom: 1px solid var(--c-border); min-height: 380px; }
.hero-content { max-width: 520px; }
.hero-tag { display: inline-block; background: var(--c-orange-dim); color: var(--c-orange); border: 1px solid var(--c-orange); border-radius: 20px; padding: 3px 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
.hero-title { font-family: var(--font-condensed); font-size: 44px; font-weight: 700; line-height: 1.1; margin-bottom: 16px; }
.hero-accent { color: var(--c-orange); }
.hero-sub { color: var(--c-text-muted); font-size: 16px; line-height: 1.6; margin-bottom: 28px; }
.hero-actions { display: flex; gap: 12px; }
.hero-visual { flex-shrink: 0; }
.visual-grid { display: flex; gap: 8px; padding: 16px; background: var(--c-surface2); border: 1px solid var(--c-border); border-radius: var(--radius-lg); }
.vis-col { display: flex; flex-direction: column; gap: 6px; width: 80px; }
.vis-col-head { border-radius: 4px 4px 0 0; padding: 5px 8px; font-size: 10px; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; }
.vis-card { height: 36px; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: 4px; }
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.feat-card { display: flex; flex-direction: column; gap: 10px; cursor: default; }
.feat-card:hover { border-color: var(--c-orange); }
.feat-icon { font-size: 28px; }
.feat-title { font-family: var(--font-condensed); font-size: 16px; font-weight: 700; }
.feat-desc { font-size: 13px; color: var(--c-text-muted); line-height: 1.5; }
.stats { display: flex; gap: 0; border: 1px solid var(--c-border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 48px; }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 28px 20px; background: var(--c-surface); border-right: 1px solid var(--c-border); gap: 4px; }
.stat-item:last-child { border-right: none; }
.stat-value { font-family: var(--font-condensed); font-size: 36px; font-weight: 700; color: var(--c-blue-light); }
.stat-label { font-size: 13px; color: var(--c-text-muted); text-align: center; }
</style>
