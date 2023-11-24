import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { useNavigationStore } from '@/stores/navigation';
import { useFilterStore } from '@/stores/filter';
import TheNavigation from '@/components/TheNavigation.vue';
import NavigationItem from '@/components/NavigationItem.vue';
import mockNavigation from '@/__tests__/fixtures/navigation';

const FILTER_MATCH = 'ver';

let pinia: TestingPinia;
let navigationStore: ReturnType<typeof useNavigationStore>;
let filterStore: ReturnType<typeof useFilterStore>;

describe('TheNavigation', () => {
  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    navigationStore = useNavigationStore();
    navigationStore.navigation = structuredClone(mockNavigation);
    filterStore = useFilterStore();
  });

  it('renders properly when computed:filteredNavigation is empty', () => {
    filterStore.filter = 'NO_MATCH';
    const wrapper = shallowMount(TheNavigation, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const nav = wrapper.find('nav');
    expect(nav.exists()).toBeTruthy();
    expect(nav.attributes('aria-label')).toBe('main');

    const paragraph = nav.find('p');
    expect(paragraph.text()).toBe('nothing to show yet');
  });

  it('renders properly when computed:filteredNavigation is not empty', () => {
    filterStore.filter = FILTER_MATCH;
    const wrapper = shallowMount(TheNavigation, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const nav = wrapper.find('nav');
    expect(nav.exists()).toBeTruthy();
    expect(nav.attributes('aria-label')).toBe('main');

    const list = nav.find('ul');
    expect(list.exists()).toBeTruthy();

    const routerLinks = list.findAllComponents(RouterLinkStub);
    expect(routerLinks).toHaveLength(filterStore.filteredNavigation.length);
    filterStore.filteredNavigation.forEach((nav, i) => {
      expect(routerLinks[i].text()).toBe(nav.name.toLowerCase());
      expect(routerLinks[i].props().to).toStrictEqual({
        name: 'page',
        params: { slug: nav.link },
      });
    });
  });

  it('renders properly when state:filter is empty', () => {
    const levelZeroPages = Object.values(mockNavigation.pages).filter((p) => p.level == 0);
    filterStore.filter = '';
    const wrapper = shallowMount(TheNavigation, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const nav = wrapper.find('nav');
    expect(nav.exists()).toBeTruthy();
    expect(nav.attributes('aria-label')).toBe('main');

    const list = nav.find('ul');
    expect(list.exists()).toBeTruthy();

    const navigationItems = list.findAllComponents(NavigationItem);
    expect(navigationItems).toHaveLength(levelZeroPages.length);
    levelZeroPages.forEach((page, i) => {
      expect(navigationItems[i].props().page).toStrictEqual(page);
    });
  });
});
