import { test, expect } from '@playwright/test';

test.describe('Presentational Layer Validation', () => {
  test('home page renders featured plants', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Use getByRole to avoid strict mode ambiguity with multiple badges
    const featuredHeading = page.getByRole('heading', { name: 'Destacado' });
    await expect(featuredHeading).toBeVisible();

    // Check for at least one plant card
    const plantCards = page.locator('a[href^="/plants/"]');
    expect(await plantCards.count()).toBeGreaterThan(0);
  });

  test('search functionality works presentationaly', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    const searchInput = page.getByPlaceholder('Buscar...');
    await searchInput.fill('Albahaca');

    // Results should filter. We use first() to avoid ambiguity if there are multiple matches
    await expect(page.getByText('Albahaca', { exact: false }).first()).toBeVisible();
  });

  test('language switcher changes UI strings', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const langBtn = page.locator('button', { hasText: 'EN' });
    await langBtn.click();

    // Nav should change
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Search')).toBeVisible();

    // Plant title should change. Use first() to avoid ambiguity with multiplied mock data
    await expect(page.getByText('Sweet Basil', { exact: false }).first()).toBeVisible();
  });

  test('pinning a plant reflects visually', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for the links to be ready
    const plantLink = page.locator('a[href^="/plants/"]').first();
    await plantLink.click();

    // The detail page should have the pin button.
    // In our implementation, it's a button with white heart icon.
    // Let's use a more robust selector.
    const pinBtn = page.locator('button', { hasText: /🤍|❤️/ });
    await expect(pinBtn).toBeVisible();

    // If it's already pinned, click to unpin then pin again to be sure of state
    const text = await pinBtn.innerText();
    if (text.includes('❤️')) {
        await pinBtn.click();
        await expect(pinBtn).toHaveText('🤍');
    }

    await pinBtn.click();
    await expect(pinBtn).toHaveText('❤️');
  });
});
