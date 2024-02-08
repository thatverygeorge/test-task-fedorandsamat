import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { useNavigationStore } from '@/stores/navigation';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { routes } from '@/router';
import mockNavigation from '@/__tests__/fixtures/navigation';
import PageView from '@/views/PageView.vue';

const TETS_SLUG = 'denominator-behind-at-shyly-er.html';
const TETS_SLUG_INVALID = 'INVALID_SLUG';

let pinia: TestingPinia;
let router: Router;
let navigationStore: ReturnType<typeof useNavigationStore>;

describe('PageView', () => {
  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    navigationStore = useNavigationStore();
    navigationStore.navigation = structuredClone(mockNavigation);

    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    });
  });

  it('renders properly on a valid slug', async () => {
    await router.push({ name: 'page', params: { slug: TETS_SLUG } });
    await router.isReady();
    const spyOnPush = vi.spyOn(router, 'push');

    const wrapper = shallowMount(PageView, {
      props: {
        slug: TETS_SLUG,
      },
      global: {
        plugins: [pinia, router],
      },
    });

    const section = wrapper.find('section');
    expect(section.exists()).toBeTruthy();

    const heading = section.find('h2');
    expect(heading.exists()).toBeTruthy();
    expect(heading.text()).toBe(`page: ${TETS_SLUG}`);

    expect(spyOnPush).toHaveBeenCalledTimes(0);
    expect(navigationStore.openTree).toHaveBeenCalledOnce();
  });

  it('redirects to 404 on an invalid slug', async () => {
    await router.push({ name: 'page', params: { slug: TETS_SLUG_INVALID } });
    await router.isReady();
    const spyOnPush = vi.spyOn(router, 'push');

    shallowMount(PageView, {
      props: {
        slug: TETS_SLUG_INVALID,
      },
      global: {
        plugins: [pinia, router],
      },
    });

    expect(spyOnPush).toHaveBeenCalledOnce();
    expect(spyOnPush).toHaveBeenCalledWith({
      name: 'notFound',
      params: {
        pathMatch: [TETS_SLUG_INVALID],
      },
      query: router.currentRoute.value.query,
      hash: router.currentRoute.value.hash,
    });
    expect(navigationStore.openTree).toHaveBeenCalledTimes(0);
  });
});
