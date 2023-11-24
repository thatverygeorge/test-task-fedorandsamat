import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNavigationStore } from '@/stores/navigation';
import mockNavigation from '@/__tests__/fixtures/navigation';
import type { Page } from '@/types';

const TEST_PAGE = mockNavigation.pages['capital_vol'];
if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

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
      const page = store.getPage('name', TEST_PAGE.name);

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns a page on a valid name (uppercase)', () => {
      const page = store.getPage('name', TEST_PAGE.name.toUpperCase());

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns undefined on an invalid name', () => {
      const page = store.getPage('name', 'INVALID_NAME');

      expect(page).toBeUndefined();
    });

    it('returns a page on a valid link (lowercase)', () => {
      const page = store.getPage('link', TEST_PAGE.link);

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns a page on a valid link (uppercase)', () => {
      const page = store.getPage('link', TEST_PAGE.link.toUpperCase());

      expect(page).toStrictEqual(TEST_PAGE);
    });

    it('returns undefined on an invalid link', () => {
      const page = store.getPage('link', 'INVALID_LINK');

      expect(page).toBeUndefined();
    });
  });

  describe('action:toggleItem', () => {
    it('toggles item on a valid key', () => {
      const TEST_PAGE = store.navigation?.pages['capital_vol'];
      if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');
      const wasOpen = TEST_PAGE.isOpen || false;

      store.toggleItem(TEST_PAGE.key);

      expect(TEST_PAGE.isOpen).toBe(!wasOpen);

      store.toggleItem(TEST_PAGE.key);

      expect(TEST_PAGE.isOpen).toBe(wasOpen);
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

        if (page.parentKey) {
          const parentPage = store.navigation.pages[page.parentKey];
          if (parentPage) page = parentPage;
        } else {
          break;
        }
      }

      return arr;
    }

    it('opens a tree of a level 5 page without childPageKeys', () => {
      const TEST_PAGE = store.navigation?.pages['besides_madly'];
      if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

      const wasOpen = TEST_PAGE.isOpen;
      const openStatusesBefore = getOpenStatuses(getPagesTree(TEST_PAGE));

      store.openTree(TEST_PAGE);

      const openStatusesAfter = getOpenStatuses(getPagesTree(TEST_PAGE));
      expect(openStatusesBefore.slice(1).map((el) => !el)).toStrictEqual(
        openStatusesAfter.slice(1)
      );
      expect(TEST_PAGE.isOpen).toBe(wasOpen);
    });

    it('opens a tree of a level 4 page with childPageKeys', () => {
      const TEST_PAGE = store.navigation?.pages['millet_justly_royal'];
      if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

      const openStatusesBefore = getOpenStatuses(getPagesTree(TEST_PAGE));

      store.openTree(TEST_PAGE);

      const openStatusesAfter = getOpenStatuses(getPagesTree(TEST_PAGE));
      expect(openStatusesBefore.map((el) => !el)).toStrictEqual(openStatusesAfter);
    });

    it('opens a tree of a level 0 page without childPageKeys', () => {
      const TEST_PAGE = store.navigation?.pages['denominator_behind_at_shyly_er'];
      if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

      const openStatusesBefore = getOpenStatuses(getPagesTree(TEST_PAGE));

      store.openTree(TEST_PAGE);

      const openStatusesAfter = getOpenStatuses(getPagesTree(TEST_PAGE));
      expect(openStatusesBefore).toStrictEqual(openStatusesAfter);
    });

    it('opens a tree of a level 0 page with childPageKeys', () => {
      const TEST_PAGE = store.navigation?.pages['capital_vol'];
      if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');
      const openStatusesBefore = getOpenStatuses(getPagesTree(TEST_PAGE));

      store.openTree(TEST_PAGE);

      const openStatusesAfter = getOpenStatuses(getPagesTree(TEST_PAGE));
      expect(openStatusesBefore.map((el) => !el)).toStrictEqual(openStatusesAfter);
    });
  });
});
