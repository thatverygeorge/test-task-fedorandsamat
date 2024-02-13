import { test, expect } from '@playwright/test';
import mockNavigation from '@/__tests__/fixtures/navigation';
import type { Page } from '@/types';

const TEST_PAGE = Object.values(mockNavigation.pages).find(
  (el) => !Object.hasOwn(el, 'childPageKeys')
);
const TEST_PAGE_WITH_CHILDREN = Object.values(mockNavigation.pages).find((el) =>
  Object.hasOwn(el, 'childPageKeys')
);

if (!TEST_PAGE) throw new Error('TEST_PAGE is undefined');
if (!TEST_PAGE_WITH_CHILDREN) throw new Error('TEST_PAGE_WITH_CHILDREN is undefined');

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
  const nav = page.getByRole('navigation', { name: 'main' });
  await expect(nav).toBeVisible();

  const listItems = nav.getByRole('listitem');
  await expect(listItems).toHaveCount(mockNavigation.rootLevelKeys.length);

  for (const key of mockNavigation.rootLevelKeys) {
    const mockPage = mockNavigation.pages[key];
    if (!mockPage) throw new Error('mockPage is undefined');

    if (Object.hasOwn(mockPage, 'childPageKeys')) {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();
      await expect(page.getByRole('button', { name: `expand ${mockPage.name}` })).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();
      await expect(page.getByRole('button', { name: `expand ${mockPage.name}` })).toBeHidden();
    }
  }
});

test('click on an item redirects to relevant page', async ({ page }) => {
  await page.getByRole('link', { name: TEST_PAGE_WITH_CHILDREN.name }).click();

  await expect(
    page.getByRole('heading', { level: 2, name: `page: ${TEST_PAGE_WITH_CHILDREN.link}` })
  ).toBeVisible();
});

test('click on an item opens additional navigation', async ({ page }) => {
  const childKey: string | undefined = TEST_PAGE_WITH_CHILDREN.childPageKeys![0];
  if (!childKey) throw new Error('childKey is undefined');
  const mockPage = mockNavigation.pages[childKey];
  if (!mockPage) throw new Error('mockPage is undefined');
  await expect(page.getByRole('link', { name: `page: ${mockPage.name}` })).toBeHidden();

  await page.getByRole('link', { name: TEST_PAGE_WITH_CHILDREN.name }).click();

  await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();
});

test('click on a button opens additional navigation', async ({ page }) => {
  let mockPage: Page | undefined = TEST_PAGE_WITH_CHILDREN;
  while (mockPage) {
    await expect(page.getByRole('link', { name: mockPage.name })).toBeVisible();

    if (!mockPage.childPageKeys) break;

    const button = page.getByRole('button', { name: `expand ${mockPage.name}` });
    await expect(button).toBeVisible();
    await button.click();

    const childKey: string | undefined = mockPage.childPageKeys[0];
    if (!childKey) throw new Error('childKey is undefined');
    mockPage = mockNavigation.pages[childKey];
  }

  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeVisible();
});

test('click on a button closes additional navigation', async ({ page }) => {
  let currentPage: Page | undefined = TEST_PAGE_WITH_CHILDREN;

  while (currentPage) {
    await expect(page.getByRole('link', { name: currentPage.name })).toBeVisible();

    if (!currentPage.childPageKeys) break;

    await page.getByRole('button', { name: `expand ${currentPage.name}` }).click();
    const childKey: string | undefined = currentPage.childPageKeys[0];
    if (!childKey) throw new Error('childKey is undefined');
    currentPage = mockNavigation.pages[childKey];
  }

  while (currentPage) {
    await expect(page.getByRole('link', { name: currentPage.name })).toBeVisible();

    if (!currentPage.parentKey) break;

    const prevPageName = currentPage.name;
    currentPage = mockNavigation.pages[currentPage.parentKey];
    if (!currentPage) throw new Error('currentPage is undefined');

    await page.getByRole('button', { name: `expand ${currentPage.name}` }).click();
    await expect(page.getByRole('link', { name: prevPageName })).toBeHidden();
  }

  await expect(page.getByRole('heading', { level: 2, name: 'home page' })).toBeVisible();
});
