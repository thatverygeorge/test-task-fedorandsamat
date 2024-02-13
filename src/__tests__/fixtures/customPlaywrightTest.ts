import { test as base } from '@playwright/test';
import mockNavigation from '@/__tests__/fixtures/navigation';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://prolegomenon.s3.amazonaws.com/contents.json', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockNavigation),
      })
    );

    use(page);
  },
});
