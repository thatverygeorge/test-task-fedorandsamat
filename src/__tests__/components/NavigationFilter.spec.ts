import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useFilterStore } from '@/stores/filter';
import NavigationFilter from '@/components/NavigationFilter.vue';

vi.mock('lodash.debounce', () => ({
  default: vi.fn((fn) => fn),
}));

let wrapper: VueWrapper;

describe('NavigationFilter', () => {
  beforeEach(() => {
    wrapper = shallowMount(NavigationFilter, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
  });

  it('renders properly', () => {
    const form = wrapper.find('form');
    expect(form.exists()).toBeTruthy();

    const fieldset = form.find('fieldset');
    expect(fieldset.exists()).toBeTruthy();

    const legend = fieldset.find('legend');
    expect(legend.exists()).toBeTruthy();
    expect(legend.text()).toBe('filter');

    const input = fieldset.find('input');
    expect(input.exists()).toBeTruthy();
    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('name')).toBe('filter');
    expect(input.attributes('id')).toBe('filter');
    expect(input.attributes('autocomplete')).toBe('off');

    const button = fieldset.find('button');
    expect(button.exists()).toBeTruthy();
    expect(button.text()).toBe('clear');
  });

  it('input fills state:filter', async () => {
    const filterStore = useFilterStore();
    const input = wrapper.find('input');

    await input.setValue('TEST');

    expect(filterStore.filter).toBe('TEST');
  });

  it('button calls action:clear', async () => {
    const filterStore = useFilterStore();
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(filterStore.clear).toHaveBeenCalledOnce();
  });
});
