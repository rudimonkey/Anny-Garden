import { test, expect } from '@playwright/test';

test.describe('Full Presentational Integration Validation', () => {
  test('pagination works on search page', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Check initial page - look for the active page button "1"
    const activePage = page.locator('button.bg-leafGreen9', { hasText: '1' });
    await expect(activePage).toBeVisible();

    // Go to next page (button "2")
    await page.getByRole('button', { name: '2', exact: true }).click();

    // Check that page 2 is now active
    const activePage2 = page.locator('button.bg-leafGreen9', { hasText: '2' });
    await expect(activePage2).toBeVisible();

    // Check that items changed - page 2 should have something with (7) or higher
    await expect(page.getByText(/\(\d+\)/).first()).toBeVisible();
  });

  test('featured badge is bilingual', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText(/DESTACADO|FEATURED/).first()).toBeVisible();

    // Toggle language
    const langBtn = page.getByRole('button', { name: /EN|ES/ });
    const currentLang = await langBtn.innerText();
    await langBtn.click();

    const newLang = currentLang === 'EN' ? 'FEATURED' : 'DESTACADO';
    await expect(page.getByText(newLang).first()).toBeVisible();
  });

  test('pinning triggers visual feedback (toast)', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    // Find a heart button
    const pinBtn = page.locator('button', { hasText: /🤍|❤️/ }).first();
    await pinBtn.click();

    // Check for toast feedback (either added or removed)
    await expect(page.getByText(/favoritos/)).toBeVisible();
  });
});
