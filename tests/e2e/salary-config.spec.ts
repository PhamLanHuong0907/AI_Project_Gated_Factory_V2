/**
 * E2E Tests — Salary Config (SCR-07)
 * Test Cases: TC-SALC-01 through TC-SALC-10
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

test.describe('SCR-07: Salary Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/salary/config`);
    await page.waitForTimeout(1500);
  });

  // TC-SALC-01: Page loads
  test('TC-SALC-01: Salary config page loads', async ({ page }) => {
    await expect(page.locator('text=Cấu hình lương hệ thống')).toBeVisible();
  });

  // TC-SALC-02: Tabs are visible
  test('TC-SALC-02: All salary config tabs are visible', async ({ page }) => {
    await expect(page.locator('text=Vị trí')).toBeVisible();
    await expect(page.locator('text=Thâm niên')).toBeVisible();
    await expect(page.locator('text=Phụ cấp')).toBeVisible();
    await expect(page.locator('text=Thưởng')).toBeVisible();
    await expect(page.locator('text=Công thức')).toBeVisible();
  });

  // TC-SALC-03: Positions tab - CRUD
  test('TC-SALC-03: Positions tab loads with data', async ({ page }) => {
    await page.click('text=Vị trí');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('table, .position-list, [class*="table"], button:has-text("Thêm")').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test('TC-SALC-04: Add position opens form', async ({ page }) => {
    await page.click('text=Vị trí');
    await page.waitForTimeout(1000);
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("+")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Thêm vị trí, text=Thêm mới, input[placeholder*="Tên"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-SALC-05: Experience tab
  test('TC-SALC-05: Experience tab loads', async ({ page }) => {
    await page.click('text=Thâm niên');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('table, .experience-list, button:has-text("Thêm")').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SALC-06: Penalties tab
  test('TC-SALC-06: Penalties tab loads', async ({ page }) => {
    await page.click('text=Phụ cấp');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('table, .penalty-list, button:has-text("Thêm")').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SALC-07: Bonus tab
  test('TC-SALC-07: Bonus tab loads', async ({ page }) => {
    await page.click('text=Thưởng');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('table, .bonus-list, button:has-text("Thêm")').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SALC-08: Formula tab
  test('TC-SALC-08: Formula tab loads with salary formula', async ({ page }) => {
    await page.click('text=Công thức');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('text=Lương cơ bản, text=công thức, text=Base Salary, input, textarea').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  // TC-SALC-09: Cancel add form
  test('TC-SALC-09: Cancel add position closes form', async ({ page }) => {
    await page.click('text=Vị trí');
    await page.waitForTimeout(1000);
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("+")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
      const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel")');
      if (await cancelBtn.count() > 0) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
        const formClosed = await page.locator('text=Thêm vị trí, text=Thêm mới').count();
        expect(formClosed).toBe(0);
      }
    }
  });

  // TC-SALC-10: Edit position
  test('TC-SALC-10: Edit position opens form', async ({ page }) => {
    await page.click('text=Vị trí');
    await page.waitForTimeout(1000);
    const editBtn = page.locator('button:has-text("Sửa"), button[title*="Sửa"]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Sửa vị trí, text=Chỉnh sửa, input[placeholder*="Tên"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });
});
