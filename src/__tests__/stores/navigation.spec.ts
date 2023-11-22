import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNavigationStore } from '@/stores/navigation';
import mockNavigation from '@/__tests__/fixtures/navigation';
import type { Page } from '@/types';

const TEST_PAGE = mockNavigation.pages['capital_vol'];

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue(mockNavigation),
});

function getOpenStatuses(pages: Page[]): Array<boolean | undefined> {
  if (pages.length == 0) return [];

  const result = [];

  for (const page of pages) {
    result.push(page.isOpen);
  }

  return result;
}

let store: ReturnType<typeof useNavigationStore>;

describe('store:navigation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    store = useNavigationStore();
    store.navigation = structuredClone(mockNavigation);
  });

  describe('action:fetchNavigation', () => {
    it('makes the request to the right endpoint', async () => {
      await store.fetchNavigation();

      expect(fetch).toHaveBeenCalledWith('https://prolegomenon.s3.amazonaws.com/contents.json');
    });

    it('sets data if the response is ok', async () => {
      store.navigation = undefined;

      await store.fetchNavigation();

      expect(store.navigation).toStrictEqual(mockNavigation);
    });

    it('does nothing if the response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });
      store.navigation = undefined;

      await store.fetchNavigation();

      expect(store.navigation).toBeUndefined();
    });
  });

  describe('action:injectOpenStatuses', () => {
    it('injects open status into the pages', async () => {
      const pagesToCheck = Object.values(store.navigation?.pages || []).filter(
        (p) => p.childPageKeys
      );

      const openStatusesBefore = getOpenStatuses(pagesToCheck);
      store.injectOpenStatuses();
      const openStatusesAfter = getOpenStatuses(pagesToCheck);

      expect(openStatusesBefore.every((el) => el == undefined)).toStrictEqual(
        openStatusesAfter.every((el) => el == false)
      );
    });
  });

  describe('action:getPage', () => {
    it('returns a page on a valid key', () => {
      const page = store.getPage('key', TEST_PAGE.key);

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns undefined on an invalid key', () => {
      const page = store.getPage('key', 'INVALID_KEY');

      expect(page).toBeUndefined();
    });

    it('returns a page on a valid name (lowercase)', () => {
      const page = store.getPage('name', 'capital vol');

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns a page on a valid name (uppercase)', () => {
      const page = store.getPage('name', 'capital vol'.toUpperCase());

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns undefined on an invalid name', () => {
      const page = store.getPage('name', 'INVALID_NAME');

      expect(page).toBeUndefined();
    });

    it('returns a page on a valid link (lowercase)', () => {
      const page = store.getPage('link', 'capital-vol.html');

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns a page on a valid link (uppercase)', () => {
      const page = store.getPage('link', 'capital-vol.html'.toUpperCase());

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns undefined on an invalid link', () => {
      const page = store.getPage('link', 'INVALID_LINK');

      expect(page).toBeUndefined();
    });
  });

  describe('action:toggleItem', () => {
    it('toggles item on a valid key', () => {
      const wasOpen = store.navigation?.pages[TEST_PAGE.key].isOpen || false;

      store.toggleItem(TEST_PAGE.key);

      expect(store.navigation?.pages[TEST_PAGE.key].isOpen).toBe(!wasOpen);

      store.toggleItem(TEST_PAGE.key);

      expect(store.navigation?.pages[TEST_PAGE.key].isOpen).toBe(wasOpen);
    });

    it('does nothing on an invalid key', () => {
      store.toggleItem('INVALID_KEY');

      if (store.navigation) {
        const isSomePagesOpen = Object.values(store.navigation?.pages).some((page) => page.isOpen);

        expect(isSomePagesOpen).toBeFalsy();
      }
    });
  });

  describe('action:openTree', () => {
    function getPagesTree(page: Page): Page[] {
      if (!store.navigation) return [];

      const arr = [];

      while (page.level >= 0) {
        arr.push(page);

        if (!page.parentKey) {
          break;
        }

        page = store.navigation.pages[page.parentKey];
      }

      return arr;
    }

    it('opens a tree of a level 5 page without childPageKeys', () => {
      if (!store.navigation) throw new Error('store.navigation is undefined');

      const wasOpen = store.navigation.pages['besides_madly'].isOpen;
      const openStatusesBefore = getOpenStatuses(
        getPagesTree(store.navigation.pages['besides_madly'])
      );

      store.openTree(store.navigation.pages['besides_madly']);

      const openStatusesAfter = getOpenStatuses(
        getPagesTree(store.navigation.pages['besides_madly'])
      );
      expect(openStatusesBefore.slice(1).map((el) => !el)).toStrictEqual(
        openStatusesAfter.slice(1)
      );
      expect(store.navigation.pages['besides_madly'].isOpen).toBe(wasOpen);
    });

    it('opens a tree of a level 4 page with childPageKeys', () => {
      if (!store.navigation) throw new Error('store.navigation is undefined');

      const openStatusesBefore = getOpenStatuses(
        getPagesTree(store.navigation.pages['millet_justly_royal'])
      );

      store.openTree(store.navigation.pages['millet_justly_royal']);

      const openStatusesAfter = getOpenStatuses(
        getPagesTree(store.navigation.pages['millet_justly_royal'])
      );
      expect(openStatusesBefore.map((el) => !el)).toStrictEqual(openStatusesAfter);
    });

    it('opens a tree of a level 0 page without childPageKeys', () => {
      if (!store.navigation) throw new Error('store.navigation is undefined');

      const openStatusesBefore = getOpenStatuses(
        getPagesTree(store.navigation.pages['denominator_behind_at_shyly_er'])
      );

      store.openTree(store.navigation.pages['denominator_behind_at_shyly_er']);

      const openStatusesAfter = getOpenStatuses(
        getPagesTree(store.navigation.pages['denominator_behind_at_shyly_er'])
      );
      expect(openStatusesBefore).toStrictEqual(openStatusesAfter);
    });

    it('opens a tree of a level 0 page with childPageKeys', () => {
      if (!store.navigation) throw new Error('store.navigation is undefined');

      const openStatusesBefore = getOpenStatuses(
        getPagesTree(store.navigation.pages['capital_vol'])
      );

      store.openTree(store.navigation.pages['capital_vol']);

      const openStatusesAfter = getOpenStatuses(
        getPagesTree(store.navigation.pages['capital_vol'])
      );
      expect(openStatusesBefore.map((el) => !el)).toStrictEqual(openStatusesAfter);
    });
  });
});
