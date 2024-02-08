import type { Component } from 'vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PageView from '@/views/PageView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    alias: '/home',
    name: 'home',
    component: HomeView as Component,
  },
  {
    path: '/:slug',
    name: 'page',
    component: PageView as Component,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView as Component,
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
