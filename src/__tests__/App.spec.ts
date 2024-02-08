import type { ComponentPublicInstance } from 'vue';
import { describe, it, expect, beforeEach } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory, RouterView, type Router } from 'vue-router';
import { routes } from '@/router';
import App from '@/App.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import NavigationFilter from '@/components/NavigationFilter.vue';
import TheNavigation from '@/components/TheNavigation.vue';

let router: Router;
let wrapper: VueWrapper;

describe('PageView', () => {
  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    });

    wrapper = shallowMount<unknown, ComponentPublicInstance>(App, {
      global: {
        plugins: [router],
      },
    });
  });

  it('renders properly', () => {
    expect(wrapper.findComponent(TheHeader).exists()).toBeTruthy();
    expect(wrapper.findComponent(TheFooter).exists()).toBeTruthy();

    const main = wrapper.find('main');
    expect(main.exists()).toBeTruthy();

    const aside = main.find('aside');
    expect(aside.exists()).toBeTruthy();

    const button = aside.find('button');
    expect(button.exists()).toBeTruthy();
    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-controls')).toBe('main_navigation');
    expect(button.attributes('aria-label')).toBe('expand main navigation');

    const span = button.find('span');
    expect(span.exists()).toBeTruthy();
    expect(span.text()).toBe('↧');
    expect(span.attributes('aria-hidden')).toBe('true');

    expect(aside.findComponent(NavigationFilter).exists()).toBeTruthy();
    expect(aside.findComponent(TheNavigation).exists()).toBeTruthy();

    expect(main.findComponent(RouterView).exists()).toBeTruthy();
  });

  it('button click changes navigation visibility', async () => {
    const button = wrapper.find('button');
    const initialState = button.attributes('aria-expanded') === 'true' ? true : false;
    await button.trigger('click');
    const endState = button.attributes('aria-expanded') === 'true' ? true : false;

    expect(endState).toBe(!initialState);
  });
});
