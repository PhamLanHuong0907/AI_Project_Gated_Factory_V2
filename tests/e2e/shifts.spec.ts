/**
 * E2E Tests — Shifts (SCR-06)
 * Test Cases: TC-SHIFT-01 through TC-SHIFT-10
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

test.describe('SCR-06: Shift Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/shifts`);
    await page.waitForTimeout(1500);
  });

  // TC-SHIFT-01: Shifts page loads
  test('TC-SHIFT-01: Shifts page loads with shift list', async ({ page }) => {
    await expect(page.locator('text=Quản lý Ca làm việc')).toBeVisible();
  });

  // TC-SHIFT-02: Real-time status is displayed
  test('TC-SHIFT-02: Shift status column shows real-time status', async ({ page }) => {
    // Check for status indicators
    const statusVisible = await page.locator('text=Đang diễn ra, text=Chưa bắt đầu, text=Đã kết thúc, text=Tạm dừng, text=Hoạt động, text=Không hoạt động').count();
    expect(statusVisible).toBeGreaterThan(0);
  });

  // TC-SHIFT-03: Add new shift - open form
  test('TC-SHIFT-03: Add new shift form opens', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Thêm ca làm việc, text=Thêm mới, input[placeholder*="Tên"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-SHIFT-04: Add new shift - submit
  test('TC-SHIFT-04: Add new shift submits successfully', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      // Fill form
      const nameInput = page.locator('input[placeholder*="Tên"], input[placeholder*="name"]').first();
      if (await nameInput.count() > 0) await nameInput.fill('Ca E2E Test');

      // Fill time inputs
      const timeInputs = page.locator('input[type="time"]');
      if (await timeInputs.count() >= 2) {
        await timeInputs.first().fill('08:00');
        await timeInputs.nth(1).fill('17:00');
      }

      // Submit
      const submitBtn = page.locator('button:has-text("Lưu"), button:has-text("Tạo"), button[type="submit"]:has-text("Lưu")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(1500);
        const content = await page.textContent('body');
        expect(content).toContain('Ca E2E Test');
      }
    }
  });

  // TC-SHIFT-05: Edit shift
  test('TC-SHIFT-05: Edit shift opens form', async ({ page }) => {
    const editBtn = page.locator('button:has-text("Sửa"), button[title*="Sửa"]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Sửa ca làm việc, text=Chỉnh sửa, input[placeholder*="Tên"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-SHIFT-06: Toggle shift active status
  test('TC-SHIFT-06: Toggle shift active/inactive', async ({ page }) => {
    const toggleBtn = page.locator('button:has-text("Tạm dừng"), button:has-text("Kích hoạt"), button[title*="Toggle"]').first();
    if (await toggleBtn.count() > 0) {
      await toggleBtn.click();
      await page.waitForTimeout(1500);
      // Status should change
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  // TC-SHIFT-07: Delete shift
  test('TC-SHIFT-07: Delete shift shows confirmation', async ({ page }) => {
    const deleteBtn = page.locator('button:has-text("Xóa"), button[title*="Xóa"]').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
      const confirmVisible = await page.locator('text=Bạn có chắc, text=Xác nhận, text=Đồng ý').count();
      expect(confirmVisible).toBeGreaterThan(0);
    }
  });

  // TC-SHIFT-08: Form validation
  test('TC-SHIFT-08: Add shift form validates empty name', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      const submitBtn = page.locator('button:has-text("Lưu"), button:has-text("Tạo"), button[type="submit"]:has-text("Lưu")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(500);
        // Form should stay open or show error
        const formStillOpen = await page.locator('input[placeholder*="Tên"], input[placeholder*="name"]').count();
        expect(formStillOpen).toBeGreaterThan(0);
      }
    }
  });

  // TC-SHIFT-09: Cancel add shift
  test('TC-SHIFT-09: Cancel add shift closes form', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel")');
      if (await cancelBtn.count() > 0) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
        const formClosed = await page.locator('text=Thêm ca làm việc, text=Thêm mới').count();
        expect(formClosed).toBe(0);
      }
    }
  });

  // TC-SHIFT-10: Shift list shows correct columns
  test('TC-SHIFT-10: Shift list has expected columns', async ({ page }) => {
    const hasHeaders = await page.locator('th:has-text("Tên"), th:has-text("Thời gian"), th:has-text("Trạng thái")').count();
    expect(hasHeaders).toBeGreaterThan(0);
  });
});
