import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Navigation, Page } from '@/types';

export const useNavigationStore = defineStore('navigation', () => {
  const navigation = ref<Navigation>();

  async function fetchNavigation() {
    const res = await fetch('https://prolegomenon.s3.amazonaws.com/contents.json');
    const data = (await res.json()) as Navigation;

    for (const item of Object.values(data.pages)) {
      if (Object.hasOwn(item, 'childPageKeys')) item.isOpen = false;
    }

    navigation.value = data;
  }

  function getPage(key: keyof Page, value: string): Page | undefined {
    if (!navigation.value) return;

    if (key === 'key') return navigation.value.pages[value];

    return Object.values(navigation.value.pages).find((page) => page[key] === value);
  }

  function toggleItem(key: string) {
    if (!navigation.value) return;

    navigation.value.pages[key].isOpen = !navigation.value.pages[key].isOpen;
  }

  function openItem(key: string) {
    if (!navigation.value) return;

    if (!navigation.value.pages[key].isOpen) {
      navigation.value.pages[key].isOpen = true;
    }
  }

  function openTree(slug: string) {
    if (!navigation.value) return;

    const page = getPage('link', slug);

    if (!page) return;

    page.isOpen = true;

    if (!page.level) return;
    if (!page.parentKey) return;

    let parentKey = page.parentKey;

    for (let i = page.level; i >= 0; i--) {
      const parent = navigation.value?.pages[parentKey];

      if (parent) {
        parent.isOpen = true;
        parentKey = parent.parentKey ?? '';
      }
    }
  }

  return { navigation, fetchNavigation, getPage, toggleItem, openItem, openTree };
});
