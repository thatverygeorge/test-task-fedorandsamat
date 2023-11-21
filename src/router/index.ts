import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PageView from '@/views/PageView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    alias: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/:slug',
    name: 'page',
    component: PageView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
      el: document.querySelector('section'),
    };
  },
  routes: routes,
});

export default router;
