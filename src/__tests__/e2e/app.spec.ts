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
});

test('home page renders properly', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'fedorandsamat' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeVisible();
});

test('invalid link redirects to 404', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/INVALID`);

  await expect(page.getByRole('heading', { level: 2, name: '404. not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'go home' })).toBeVisible();
});

test('link on 404 redirects home', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/INVALID`);

  await page.getByRole('link', { name: 'go home' }).click();

  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeVisible();
});

test('header link redirects home', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/${TEST_PAGE.link}`);
  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeHidden();

  await page.getByRole('heading', { level: 1, name: 'fedorandsamat' }).click();

  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeVisible();
});

test('footer link opens a new github tab', async ({ page }) => {
  await page.goto('/');

  const newTabPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '@thatverygeorge' }).click();
  const newTab = await newTabPromise;
  await newTab.waitForLoadState();

  await expect(newTab).toHaveURL('https://github.com/thatverygeorge');
});
