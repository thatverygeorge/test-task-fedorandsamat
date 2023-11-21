import { describe, it, expect } from 'vitest';
import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import TheHeader from '@/components/TheHeader.vue';

describe('TheHeader', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(TheHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const header = wrapper.find('header');
    expect(header.exists()).toBeTruthy();

    const heading = header.find('h1');
    expect(heading.exists()).toBeTruthy();

    const routerLink = heading.findComponent(RouterLinkStub);
    expect(routerLink.exists()).toBeTruthy();
    expect(routerLink.text()).toBe('fedorandsamat');
    expect(routerLink.props().to).toStrictEqual({ name: 'home' });
  });
});
