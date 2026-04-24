<template>
  <nav class="navbar">
    <router-link to="/" class="brand">
      <span class="brand-icon">⬛</span>
      <span class="brand-name">Build<span class="brand-accent">Flow</span></span>
    </router-link>
    <div class="nav-links">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/projects" class="nav-link">Chantiers</router-link>
    </div>
    <div class="nav-badge">BTP Manager v1.0</div>
  </nav>
</template>

<script>
export default { name: 'Navbar' }
</script>

<style scoped>
.navbar { display: flex; align-items: center; gap: 32px; padding: 0 24px; height: 58px; background: var(--c-surface); border-bottom: 1px solid var(--c-border); position: sticky; top: 0; z-index: 100; }
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.brand-icon { font-size: 18px; }
.brand-name { font-family: var(--font-condensed); font-size: 20px; font-weight: 700; color: var(--c-text); letter-spacing: 0.05em; }
.brand-accent { color: var(--c-orange); }
.nav-links { display: flex; gap: 4px; flex: 1; }
.nav-link { padding: 6px 14px; border-radius: var(--radius); color: var(--c-text-muted); font-weight: 500; font-size: 14px; text-decoration: none; transition: all 0.15s; }
.nav-link:hover { color: var(--c-text); background: var(--c-surface2); }
.nav-link.router-link-active { color: var(--c-blue-light); background: #1a2540; }
.nav-badge { font-size: 11px; color: var(--c-text-muted); border: 1px solid var(--c-border); border-radius: 20px; padding: 3px 10px; letter-spacing: 0.04em; }
</style>
