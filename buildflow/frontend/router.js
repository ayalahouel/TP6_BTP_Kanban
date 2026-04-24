import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Projects from './views/Projects.vue'
import Kanban from './views/Kanban.vue'
import TaskDetail from './views/TaskDetail.vue'

const routes = [
  { path: '/',             name: 'home',        component: Home },
  { path: '/projects',     name: 'projects',    component: Projects },
  { path: '/kanban/:id',   name: 'kanban',      component: Kanban,     props: true },
  { path: '/tasks/:id',    name: 'task-detail', component: TaskDetail, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
