import { describe, it, expect } from 'vitest';

import { RouterLinkStub, mount } from '@vue/test-utils';
import NotFoundView from '@/views/NotFoundView.vue';

describe('NotFoundView', () => {
  it('renders properly', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const section = wrapper.find('section');
    expect(section.exists()).toBeTruthy();

    const heading = section.find('h2');
    expect(heading.exists()).toBeTruthy();
    expect(heading.text()).toBe('404. not found');

    const routerLink = section.findComponent(RouterLinkStub);
    expect(routerLink.exists()).toBeTruthy();
    expect(routerLink.text()).toBe('go home');
    expect(routerLink.props().to).toStrictEqual({ name: 'home' });
  });
});
