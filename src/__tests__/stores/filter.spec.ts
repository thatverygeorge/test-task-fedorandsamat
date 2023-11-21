import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFilterStore } from '@/stores/filter';
import { useNavigationStore } from '@/stores/navigation';
import mockNavigation from '@/__tests__/fixtures/navigation';

const FILTER_MATCH = 'ver';
const FILTER_NO_MATCH = 'NO_MATCH';

let filterStore: ReturnType<typeof useFilterStore>;
let navigationStore: ReturnType<typeof useNavigationStore>;

describe('store:navigation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    filterStore = useFilterStore();
    navigationStore = useNavigationStore();
    navigationStore.navigation = structuredClone(mockNavigation);
  });

  describe('computed:filteredNavigation', () => {
    it('is empty on empty filter', async () => {
      expect(filterStore.filteredNavigation).toStrictEqual([]);
    });

    it('is empty on empty navigation', async () => {
      filterStore.filter = FILTER_MATCH;
      navigationStore.navigation = undefined;

      expect(filterStore.filteredNavigation).toStrictEqual([]);
    });

    it('is empty on no match', async () => {
      filterStore.filter = FILTER_NO_MATCH;

      expect(filterStore.filteredNavigation).toStrictEqual([]);
    });

    it('is not empty on match (lowercase)', async () => {
      filterStore.filter = FILTER_MATCH.toLowerCase();

      expect(filterStore.filteredNavigation).toHaveLength(2);
    });

    it('is not empty on match (uppercase)', async () => {
      filterStore.filter = FILTER_MATCH.toUpperCase();

      expect(filterStore.filteredNavigation).toHaveLength(2);
    });
  });

  describe('action:clear', () => {
    it('clears the store', async () => {
      filterStore.filter = FILTER_MATCH;
      expect(filterStore.filter).toBe(FILTER_MATCH);

      filterStore.clear();

      expect(filterStore.filter).toBe('');
    });
  });
});
