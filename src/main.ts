import './assets/main.css';

import { createApp, type Component } from 'vue';
import { createPinia } from 'pinia';
import { useNavigationStore } from '@/stores/navigation';

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App as Component);

app.use(createPinia());

const navigationStore = useNavigationStore();
await navigationStore.fetchNavigation();
navigationStore.injectOpenStatuses();

app.use(router);

app.mount('#app');
