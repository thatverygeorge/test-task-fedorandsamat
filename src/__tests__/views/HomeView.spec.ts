import { describe, it, expect } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(HomeView);

    const section = wrapper.find('section');
    expect(section.exists()).toBeTruthy();

    const heading = section.find('h2');
    expect(heading.exists()).toBeTruthy();
    expect(heading.text()).toBe('home page');
  });
});
