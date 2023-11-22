import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Page } from '@/types';
import { useNavigationStore } from '@/stores/navigation';

export const useFilterStore = defineStore('filter', () => {
  const filter = ref<string>('');
  const navigationStore = useNavigationStore();

  const filteredNavigation = computed<Page[]>(() => {
    if (navigationStore.navigation && filter.value) {
      return Object.values(navigationStore.navigation.pages).filter((item) =>
        item.name.toLowerCase().includes(filter.value.trim().toLowerCase())
      );
    }

    return [];
  });

  function clear() {
    filter.value = '';
  }

  return { filter, filteredNavigation, clear };
});
