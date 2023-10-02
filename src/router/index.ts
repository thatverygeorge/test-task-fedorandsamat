import { createRouter, createWebHashHistory } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import HomeView from '@/views/HomeView.vue';
import PageView from '@/views/PageView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
      el: document.querySelector('section'),
    };
  },
  routes: [
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
      beforeEnter(to) {
        const navigationStore = useNavigationStore();
        const link = to.params.slug as string;
        const page = navigationStore.getPage('link', link);

        if (!page) {
          return {
            name: 'notFound',
            params: {
              pathMatch: to.path.split('/').slice(1),
            },
          };
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
});

export default router;
