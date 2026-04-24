<template>
  <div class="kanban-col">
    <div class="col-header" :style="{ borderTopColor: color }">
      <span class="col-title">{{ title }}</span>
      <span class="col-count">{{ tasks.length }}</span>
    </div>
    <div class="col-body">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :allStatuses="statusList"
        @click="$emit('task-click', task)"
        @move="(newStatus) => $emit('move-task', { task, newStatus })"
      />
      <div v-if="tasks.length === 0" class="col-empty">Aucune tâche</div>
    </div>
  </div>
</template>

<script>
import TaskCard from './TaskCard.vue'
export default {
  name: 'KanbanColumn',
  components: { TaskCard },
  props: {
    title: { type: String, required: true },
    tasks: { type: Array, default: () => [] },
    color: { type: String, default: '#2b7fff' },
  },
  emits: ['task-click', 'move-task'],
  data() {
    return {
      statusList: ['À faire', 'En cours', 'Bloqué', 'Terminé'],
    }
  },
}
</script>

<style scoped>
.kanban-col { flex: 1; min-width: 240px; max-width: 300px; display: flex; flex-direction: column; }
.col-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--c-surface); border: 1px solid var(--c-border); border-top: 3px solid; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
.col-title { font-family: var(--font-condensed); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.col-count { background: var(--c-surface2); color: var(--c-text-muted); border-radius: 20px; padding: 1px 9px; font-size: 12px; font-weight: 700; border: 1px solid var(--c-border); }
.col-body { flex: 1; display: flex; flex-direction: column; gap: 8px; padding: 10px; background: var(--c-surface2); border: 1px solid var(--c-border); border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg); min-height: 200px; }
.col-empty { text-align: center; color: var(--c-text-muted); font-size: 13px; padding: 24px 0; border: 1px dashed var(--c-border); border-radius: var(--radius); }
</style>
