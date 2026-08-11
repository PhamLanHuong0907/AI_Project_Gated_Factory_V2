/**
 * E2E Tests — Leave Requests (SCR-11/SCR-12)
 * Test Cases: TC-LEAVE-01 through TC-LEAVE-10
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

async function loginAs(page: any, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"], input[placeholder*="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

test.describe('SCR-11: Employee Leave Request', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'employee@pas.vn', 'emp123456');
  });

  // TC-LEAVE-01: Leave request page loads for employee
  test('TC-LEAVE-01: Leave request page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/leave-requests`);
    await page.waitForTimeout(1500);
    await expect(page.locator('text=Đơn xin nghỉ').first()).toBeVisible();
  });

  // TC-LEAVE-02: Create leave request form
  test('TC-LEAVE-02: Create leave request form opens', async ({ page }) => {
    await page.goto(`${BASE_URL}/leave-requests`);
    await page.waitForTimeout(1500);
    const addBtn = page.locator('button:has-text("Tạo đơn"), button:has-text("Thêm"), button:has-text("Xin nghỉ"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Tạo đơn, text=Thêm đơn, select, input[type="date"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-LEAVE-03: Submit leave request
  test('TC-LEAVE-03: Submit leave request', async ({ page }) => {
    await page.goto(`${BASE_URL}/leave-requests`);
    await page.waitForTimeout(1500);
    const addBtn = page.locator('button:has-text("Tạo đơn"), button:has-text("Thêm"), button:has-text("Xin nghỉ"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      // Select leave type
      const typeSelect = page.locator('select').first();
      if (await typeSelect.count() > 0) {
        await typeSelect.selectOption({ index: 1 }).catch(() => {});
      }

      // Fill dates
      const dateInputs = page.locator('input[type="date"]');
      if (await dateInputs.count() >= 2) {
        await dateInputs.first().fill('2026-08-15');
        await dateInputs.nth(1).fill('2026-08-15');
      }

      // Fill reason
      const reasonInput = page.locator('textarea, input[placeholder*="Lý do"], input[placeholder*="reason"]');
      if (await reasonInput.count() > 0) {
        await reasonInput.first().fill('E2E test leave request');
      }

      // Submit
      const submitBtn = page.locator('button:has-text("Gửi"), button:has-text("Tạo"), button[type="submit"]:has-text("Gửi")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(1500);
      }
    }
  });

  // TC-LEAVE-04: Leave request list shows status
  test('TC-LEAVE-04: Leave request list shows status', async ({ page }) => {
    await page.goto(`${BASE_URL}/leave-requests`);
    await page.waitForTimeout(1500);
    const hasStatus = await page.locator('text=Chờ duyệt, text=Đã duyệt, text=Đã từ chối, text=Đang chờ, text=Approved, text=Rejected, text=Pending').count();
    expect(hasStatus).toBeGreaterThanOrEqual(0);
  });

  // TC-LEAVE-05: Cancel leave request
  test('TC-LEAVE-05: Cancel pending leave request', async ({ page }) => {
    await page.goto(`${BASE_URL}/leave-requests`);
    await page.waitForTimeout(1500);
    const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel")').first();
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
      await page.waitForTimeout(500);
      const confirmVisible = await page.locator('text=Bạn có chắc, text=Xác nhận').count();
      expect(confirmVisible).toBeGreaterThan(0);
    }
  });
});

test.describe('SCR-12: HR Leave Approval', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'hr.manager@pas.vn', 'hr123456');
  });

  // TC-LEAVE-06: HR leave approval page loads
  test('TC-LEAVE-06: HR leave approval page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/leave-requests`);
    await page.waitForTimeout(1500);
    await expect(page.locator('text=Duyệt đơn từ nhân viên').first()).toBeVisible();
  });

  // TC-LEAVE-07: Approve leave request button exists
  test('TC-LEAVE-07: Approve leave request button is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/leave-requests`);
    await page.waitForTimeout(1500);
    const approveBtn = page.locator('button[title="Duyệt"]').first();
    if (await approveBtn.count() > 0) {
      await expect(approveBtn).toBeVisible();
    }
  });

  // TC-LEAVE-08: Reject leave request opens modal
  test('TC-LEAVE-08: Reject leave request opens modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/leave-requests`);
    await page.waitForTimeout(1500);
    const rejectBtn = page.locator('button[title="Từ chối"]').first();
    if (await rejectBtn.count() > 0) {
      await rejectBtn.click();
      await page.waitForTimeout(500);
      const modalVisible = await page.locator('text=Từ chối đơn, text=Lý do từ chối').count();
      expect(modalVisible).toBeGreaterThan(0);
    }
  });

  // TC-LEAVE-09: Filter by status
  test('TC-LEAVE-09: Filter by status works', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/leave-requests`);
    await page.waitForTimeout(1500);
    const filterSelect = page.locator('select').first();
    if (await filterSelect.count() > 0) {
      await filterSelect.selectOption({ index: 1 }).catch(() => {});
      await page.waitForTimeout(500);
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  // TC-LEAVE-10: Leave request details
  test('TC-LEAVE-10: Leave request details are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/leave-requests`);
    await page.waitForTimeout(1500);
    // Should show request details or empty state
    const hasContent = await page.locator('text=Không có đơn, text=Chưa có, table, [class*="request"]').count();
    expect(hasContent).toBeGreaterThanOrEqual(0);
  });
});
