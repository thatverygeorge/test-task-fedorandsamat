import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Navigation, Page } from '@/types';

export const useNavigationStore = defineStore('navigation', () => {
  const navigation = ref<Navigation>();

  async function fetchNavigation() {
    const res = await fetch('https://prolegomenon.s3.amazonaws.com/contents.json');

    if (res.ok) {
      const data = (await res.json()) as Navigation;
      navigation.value = data;
    }
  }

  function injectOpenStatuses() {
    if (navigation.value) {
      for (const item of Object.values(navigation.value.pages)) {
        if (Object.hasOwn(item, 'childPageKeys')) item.isOpen = false;
      }
    }
  }

  function getPage(key: 'key' | 'name' | 'link', value: string): Page | undefined {
    if (navigation.value) {
      if (key === 'key') return navigation.value.pages[value];

      return Object.values(navigation.value.pages).find(
        (page) => page[key].toLowerCase() === value.toLowerCase()
      );
    }
  }

  function toggleItem(key: string) {
    if (navigation.value && navigation.value.pages[key]) {
      navigation.value.pages[key].isOpen = !navigation.value.pages[key].isOpen;
    }
  }

  function openTree(page: Page) {
    if (navigation.value) {
      while (page.level >= 0) {
        if (page.childPageKeys) {
          page.isOpen = true;
        }

        if (!page.parentKey) {
          break;
        }

        page = navigation.value.pages[page.parentKey];
      }
    }
  }

  return {
    navigation,
    injectOpenStatuses,
    fetchNavigation,
    getPage,
    toggleItem,
    openTree,
  };
});
