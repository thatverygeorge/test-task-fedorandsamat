import { test, expect } from '@playwright/test';
import mockNavigation from '@/__tests__/fixtures/navigation';

const TEST_PAGE = Object.values(mockNavigation.pages).find(
  (el) => !Object.hasOwn(el, 'childPageKeys')
);
if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');

test.beforeEach(async ({ page }) => {
  await page.route('https://prolegomenon.s3.amazonaws.com/contents.json', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(mockNavigation),
    })
  );

  await page.goto('/');
});

test('renders properly', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'filter' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'clear' })).toBeVisible();
});

test('shows links on match (lowercase)', async ({ page }) => {
  const matchString = TEST_PAGE.name.toLowerCase();
  await page.getByRole('textbox', { name: 'filter' }).fill(matchString);

  for (const mockPage of Object.values(mockNavigation.pages)) {
    if (mockPage.name.toLowerCase().includes(matchString)) {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeHidden();
    }
  }
});

test('shows links on match (uppercase)', async ({ page }) => {
  const matchString = TEST_PAGE.name.toUpperCase();
  await page.getByRole('textbox', { name: 'filter' }).fill(matchString);

  for (const mockPage of Object.values(mockNavigation.pages)) {
    if (mockPage.name.toUpperCase().includes(matchString)) {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeHidden();
    }
  }
});

test('shows messages on no match', async ({ page }) => {
  await page.getByRole('textbox', { name: 'filter' }).fill('INVALID_FILTER_TEXT');

  const nav = page.getByRole('navigation', { name: 'main' });
  await expect(nav.getByRole('link')).toHaveCount(0);
  await expect(nav.getByRole('paragraph').filter({ hasText: 'nothing to show yet' })).toBeVisible();
});

test('button clears the filter', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'main' });
  const input = page.getByRole('textbox', { name: 'filter' });
  await input.fill(TEST_PAGE.name);
  await expect(input).toHaveValue(TEST_PAGE.name);
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'clear' }).click();

  await expect(input).toHaveValue('');
  await expect(nav.getByRole('link')).toHaveCount(mockNavigation.rootLevelKeys.length);
});
