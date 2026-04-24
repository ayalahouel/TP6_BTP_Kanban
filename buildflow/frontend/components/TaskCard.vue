<template>
  <div class="task-card" @click="$emit('click')">
    <div class="priority-bar" :class="'prio-bar-' + task.priority.toLowerCase()"></div>
    <div class="task-body">
      <p class="task-title">{{ task.title }}</p>
      <div class="task-meta">
        <span class="task-assignee">👤 {{ task.assignee }}</span>
        <span :class="'prio-' + task.priority.toLowerCase()">{{ task.priority }}</span>
      </div>
      <div v-if="task.deadline" class="task-deadline" :class="{ 'deadline-late': isLate }">
        📅 {{ formattedDate }}
        <span v-if="isLate" class="late-tag">En retard</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskCard',
  props: { task: { type: Object, required: true } },
  emits: ['click'],
  computed: {
    formattedDate() {
      if (!this.task.deadline) return '';
      return new Date(this.task.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    isLate() {
      if (!this.task.deadline || this.task.status === 'Terminé') return false;
      return new Date(this.task.deadline) < new Date();
    },
  },
}
</script>

<style scoped>
.task-card { display: flex; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: border-color 0.15s, transform 0.15s; }
.task-card:hover { border-color: var(--c-blue); transform: translateX(2px); }
.priority-bar { width: 4px; flex-shrink: 0; }
.prio-bar-haute { background: var(--c-orange); }
.prio-bar-moyenne { background: var(--c-yellow); }
.prio-bar-basse { background: var(--c-border); }
.task-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.task-title { font-size: 13px; font-weight: 600; line-height: 1.4; }
.task-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.task-assignee { color: var(--c-text-muted); }
.task-deadline { font-size: 11px; color: var(--c-text-muted); display: flex; align-items: center; gap: 6px; }
.deadline-late { color: var(--c-red); }
.late-tag { background: var(--c-red-dim); color: #fca5a5; border-radius: 10px; padding: 1px 7px; font-size: 10px; font-weight: 600; }
</style>
