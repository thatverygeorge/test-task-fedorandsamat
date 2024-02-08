import type { ComponentPublicInstance } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouterLinkStub, VueWrapper, mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useNavigationStore } from '@/stores/navigation';
import mockNavigation from '@/__tests__/fixtures/navigation';
import NavigationItem from '@/components/NavigationItem.vue';

const TEST_PAGE_WITH_CHILDREN = mockNavigation.pages['capital_vol'];
if (!TEST_PAGE_WITH_CHILDREN) throw new Error('TEST_PAGE is undefined');

let wrapper: VueWrapper;
let navigationStore: ReturnType<typeof useNavigationStore>;

describe('NavigationItem', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    navigationStore = useNavigationStore();
    navigationStore.navigation = structuredClone(mockNavigation);

    wrapper = mount<unknown, ComponentPublicInstance>(NavigationItem, {
      props: {
        page: undefined,
      },
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  });

  it('renders properly when props:page is undefined', () => {
    const listItem = wrapper.find('li');
    expect(listItem.exists()).toBeFalsy();
  });

  it('renders properly when props:page is valid (no childPageKeys)', async () => {
    const TEST_PAGE = mockNavigation.pages['denominator_behind_at_shyly_er'];
    if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

    await wrapper.setProps({ page: TEST_PAGE });

    const listItem = wrapper.find('li');
    expect(listItem.exists()).toBeTruthy();

    const button = listItem.find('button');
    expect(button.exists()).toBeFalsy();

    const routerLink = listItem.findComponent(RouterLinkStub);
    expect(routerLink.exists()).toBeTruthy();
    expect(routerLink.text()).toBe(TEST_PAGE.name.toLowerCase());
    expect(routerLink.props().to).toStrictEqual({
      name: 'page',
      params: { slug: TEST_PAGE.link },
    });
  });

  it('renders properly when props:page is valid (with childPageKeys)', async () => {
    const TEST_PAGE_CHILD =
      mockNavigation.pages[TEST_PAGE_WITH_CHILDREN.childPageKeys?.[0] || 'bronze_gah_whenever'];
    await wrapper.setProps({ page: TEST_PAGE_WITH_CHILDREN });

    const listItem = wrapper.find('li');
    expect(listItem.exists()).toBeTruthy();

    const button = listItem.find('button');
    expect(button.exists()).toBeTruthy();
    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-controls')).toBe(`id_${TEST_PAGE_WITH_CHILDREN.key}_menu`);
    expect(button.attributes('aria-label')).toBe(
      `expand ${TEST_PAGE_WITH_CHILDREN.name.toLowerCase()} menu`
    );

    const span = button.find('span');
    expect(span.exists()).toBeTruthy();
    expect(span.text()).toBe('▶');
    expect(span.attributes('aria-hidden')).toBe('true');

    const routerLink = listItem.findComponent(RouterLinkStub);
    expect(routerLink.exists()).toBeTruthy();
    expect(routerLink.text()).toBe(TEST_PAGE_WITH_CHILDREN.name.toLowerCase());
    expect(routerLink.props().to).toStrictEqual({
      name: 'page',
      params: { slug: TEST_PAGE_WITH_CHILDREN.link },
    });

    const innerList = listItem.find('ul');
    expect(innerList.exists()).toBeTruthy();
    expect(innerList.attributes('id')).toBe(`id_${TEST_PAGE_WITH_CHILDREN.key}_menu`);

    const navigationItem = innerList.findComponent(NavigationItem);
    expect(navigationItem.exists()).toBeTruthy();

    expect(navigationItem.props().page).toStrictEqual(TEST_PAGE_CHILD);
  });

  it('button click calls action:toggleItem', async () => {
    await wrapper.setProps({ page: TEST_PAGE_WITH_CHILDREN });

    const listItem = wrapper.find('li');
    const button = listItem.find('button');

    await button.trigger('click');

    expect(navigationStore.toggleItem).toHaveBeenCalledOnce();
  });

  it("button's aria-expanded is false when props.page.isOpen is false", async () => {
    TEST_PAGE_WITH_CHILDREN.isOpen = false;
    await wrapper.setProps({ page: TEST_PAGE_WITH_CHILDREN });

    const button = wrapper.find('button');

    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it("button's aria-expanded is true when props.page.isOpen is true", async () => {
    TEST_PAGE_WITH_CHILDREN.isOpen = true;
    await wrapper.setProps({ page: TEST_PAGE_WITH_CHILDREN });

    const button = wrapper.find('button');

    expect(button.attributes('aria-expanded')).toBe('true');
  });
});
