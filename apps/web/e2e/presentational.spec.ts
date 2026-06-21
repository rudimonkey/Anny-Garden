import { test, expect } from '@playwright/test';

test.describe('Presentational Layer Validation', () => {
  test('home page renders featured plants', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for the "Plantas Destacadas" heading
    const featuredHeading = page.getByRole('heading', { name: /Destacadas/i });
    await expect(featuredHeading).toBeVisible();

    // Check for at least one plant card (they are links to /plants/...)
    const plantCards = page.locator('a[href^="/plants/"]');
    await expect(await plantCards.count()).toBeGreaterThan(0);
  });

  test('search functionality works presentationaly', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    // Wait for hydration
    await page.waitForTimeout(1000);
    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill('Albahaca');

    // Click the search button
    await page.getByRole('button', { name: /buscar/i }).click();

    // Results should filter.
    await expect(page.getByText('Albahaca', { exact: false }).first()).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click on Buscar in nav
    await page.getByRole('link', { name: /Buscar/i }).click();
    await expect(page).toHaveURL(/.*search/);

    // Click on a plant card to go to detail
    await page.goto('http://localhost:3000');
    await page.locator('a[href^="/plants/"]').first().click();
    await expect(page).toHaveURL(/.*plants/);
  });
});
