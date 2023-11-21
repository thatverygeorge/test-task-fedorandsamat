import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TheFooter from '@/components/TheFooter.vue';

describe('TheFooter', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(TheFooter);

    const footer = wrapper.find('footer');
    expect(footer.exists()).toBeTruthy();

    const span = footer.find('span');
    expect(span.exists()).toBeTruthy();
    expect(span.text()).toContain('made by');

    const anchor = span.find('a');
    expect(anchor.exists()).toBeTruthy();
    expect(anchor.text()).toBe('@thatverygeorge');
    expect(anchor.attributes('href')).toBe('https://github.com/thatverygeorge');
    expect(anchor.attributes('target')).toBe('_blank');
    expect(anchor.attributes('rel')).toBe('noopener noreferrer');
  });
});
