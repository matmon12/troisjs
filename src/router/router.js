import {createRouter, createWebHistory} from "vue-router";
import Home from "@/pages/Home.vue";
const routes = [
  { path: '/troisjs/', name: "Home", component: Home }
]

const router  = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

export default router;