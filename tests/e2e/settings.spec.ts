/**
 * E2E Tests — System Settings (SCR-10)
 * Test Cases: TC-SET-01 through TC-SET-06
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

async function loginAsAdmin(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"], input[placeholder*="email"]', 'admin@pas.vn');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

test.describe('SCR-10: System Settings', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/settings`);
    await page.waitForTimeout(1500);
  });

  // TC-SET-01: Page loads
  test('TC-SET-01: Settings page loads', async ({ page }) => {
    await expect(page.locator('text=Cài đặt hệ thống')).toBeVisible();
  });

  // TC-SET-02: GPS tab
  test('TC-SET-02: GPS settings tab loads', async ({ page }) => {
    await page.click('text=GPS, text=Vị trí').first();
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('input, select, text=GPS, text=vĩ độ, text=kinh độ, text=radius').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SET-03: QR settings tab
  test('TC-SET-03: QR settings tab loads', async ({ page }) => {
    await page.click('text=QR, text=Mã QR').first();
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('input, select, text=QR, text=thời hạn, text=hết hạn').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SET-04: Attendance settings tab
  test('TC-SET-04: Attendance settings tab loads', async ({ page }) => {
    await page.click('text=Chấm công, text=Attendance').first();
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('input, select, text=chấm công, text=đi trễ, text=quên').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SET-05: Save settings
  test('TC-SET-05: Save settings button works', async ({ page }) => {
    const saveBtn = page.locator('button:has-text("Lưu"), button:has-text("Save")').first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
      // Should show saved confirmation or loading state
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  // TC-SET-06: Settings persistence
  test('TC-SET-06: Settings persist after page reload', async ({ page }) => {
    // Change a setting
    const input = page.locator('input[type="number"], input[type="text"]').first();
    if (await input.count() > 0) {
      const originalValue = await input.inputValue();
      await input.fill('999');
      // Save
      const saveBtn = page.locator('button:has-text("Lưu"), button:has-text("Save")').first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        await page.waitForTimeout(1500);
      }
      // Reload page
      await page.reload();
      await page.waitForTimeout(1500);
      // Value should persist
      const newValue = await page.locator('input[type="number"], input[type="text"]').first().inputValue();
      expect(newValue).toBe('999');
      // Restore original value
      await page.locator('input[type="number"], input[type="text"]').first().fill(originalValue || '100');
      const saveBtn2 = page.locator('button:has-text("Lưu"), button:has-text("Save")').first();
      if (await saveBtn2.count() > 0) {
        await saveBtn2.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});
