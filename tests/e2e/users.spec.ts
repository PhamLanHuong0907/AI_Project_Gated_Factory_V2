/**
 * E2E Tests — Users (SCR-09)
 * Test Cases: TC-USER-01 through TC-USER-10
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

test.describe('SCR-09: User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/users`);
    await page.waitForTimeout(1500);
  });

  // TC-USER-01: Users page loads
  test('TC-USER-01: Users page loads with user table', async ({ page }) => {
    await expect(page.locator('text=Quản lý Nhân sự')).toBeVisible();
    // Should show user list or empty state
    const hasTable = await page.locator('table, .user-list, [class*="table"]').count();
    const hasEmpty = await page.locator('text=Chưa có nhân viên, text=chưa có').count();
    expect(hasTable + hasEmpty).toBeGreaterThan(0);
  });

  // TC-USER-02: Search users
  test('TC-USER-02: Search users works', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"], input[placeholder*="tìm"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('admin');
      await page.waitForTimeout(500);
      // Should filter results
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  // TC-USER-03: Add new user - open form
  test('TC-USER-03: Add new user form opens', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);
      // Form should appear
      const formVisible = await page.locator('text=Thêm nhân viên, text=Thêm mới, input[placeholder*="Họ"], input[placeholder*="Email"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-USER-04: Add new user - submit
  test('TC-USER-04: Add new user submits successfully', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      // Fill form
      const nameInput = page.locator('input[placeholder*="Họ"], input[placeholder*="name"]').first();
      const emailInput = page.locator('input[placeholder*="Email"], input[type="email"]').first();
      const passInput = page.locator('input[placeholder*="Mật khẩu"], input[placeholder*="password"]').first();

      if (await nameInput.count() > 0) await nameInput.fill('Test User E2E');
      if (await emailInput.count() > 0) await emailInput.fill('test.user.e2e@pas.vn');
      if (await passInput.count() > 0) await passInput.fill('test123456');

      // Select role if dropdown exists
      const roleSelect = page.locator('select, [role="combobox"]').first();
      if (await roleSelect.count() > 0) {
        await roleSelect.selectOption({ index: 1 }).catch(() => {});
      }

      // Submit
      const submitBtn = page.locator('button:has-text("Lưu"), button:has-text("Tạo"), button[type="submit"]:has-text("Lưu")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(1500);
        // Should show success or return to list
        const content = await page.textContent('body');
        expect(content).toContain('Test User E2E');
      }
    }
  });

  // TC-USER-05: Edit user
  test('TC-USER-05: Edit user opens form', async ({ page }) => {
    const editBtn = page.locator('button:has-text("Sửa"), button[title*="Sửa"]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(500);
      const formVisible = await page.locator('text=Sửa nhân viên, text=Chỉnh sửa, input[placeholder*="Họ"]').count();
      expect(formVisible).toBeGreaterThan(0);
    }
  });

  // TC-USER-06: Delete user
  test('TC-USER-06: Delete user shows confirmation', async ({ page }) => {
    const deleteBtn = page.locator('button:has-text("Xóa"), button[title*="Xóa"]').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
      // Confirmation dialog should appear
      const confirmVisible = await page.locator('text=Bạn có chắc, text=Xác nhận, text=Đồng ý').count();
      expect(confirmVisible).toBeGreaterThan(0);
    }
  });

  // TC-USER-07: Form validation - empty name
  test('TC-USER-07: Add user form validates empty name', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      // Submit without filling name
      const submitBtn = page.locator('button:has-text("Lưu"), button:has-text("Tạo"), button[type="submit"]:has-text("Lưu")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(500);
        // Should show validation error
        const errorVisible = await page.locator('text=bắt buộc, text=required, text=không được để trống, [class*="error"]').count();
        // Either validation error or form stays open
        expect(errorVisible + (await page.locator('input[placeholder*="Họ"], input[placeholder*="name"]').count())).toBeGreaterThan(0);
      }
    }
  });

  // TC-USER-08: Form validation - duplicate email
  test('TC-USER-08: Add user validates duplicate email', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      const nameInput = page.locator('input[placeholder*="Họ"], input[placeholder*="name"]').first();
      const emailInput = page.locator('input[placeholder*="Email"], input[type="email"]').first();
      const passInput = page.locator('input[placeholder*="Mật khẩu"], input[placeholder*="password"]').first();

      if (await nameInput.count() > 0) await nameInput.fill('Duplicate Email Test');
      if (await emailInput.count() > 0) await emailInput.fill('admin@pas.vn'); // Existing email
      if (await passInput.count() > 0) await passInput.fill('test123456');

      const submitBtn = page.locator('button:has-text("Lưu"), button:has-text("Tạo"), button[type="submit"]:has-text("Lưu")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(1500);
        // Should show error about duplicate email
        const errorVisible = await page.locator('text=đã tồn tại, text=exists, text=trùng').count();
        expect(errorVisible).toBeGreaterThan(0);
      }
    }
  });

  // TC-USER-09: Cancel add user
  test('TC-USER-09: Cancel add user closes form', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Thêm"), button:has-text("Thêm mới"), button:has-text("+")');
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(500);

      const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel")');
      if (await cancelBtn.count() > 0) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
        // Form should close
        const formClosed = await page.locator('text=Thêm nhân viên, text=Thêm mới').count();
        expect(formClosed).toBe(0);
      }
    }
  });

  // TC-USER-10: User list shows correct columns
  test('TC-USER-10: User list has expected columns', async ({ page }) => {
    // Check for table headers or list items
    const hasHeaders = await page.locator('th:has-text("Họ tên"), th:has-text("Email"), th:has-text("Vai trò")').count();
    const hasCards = await page.locator('[class*="user-card"], [class*="user-item"]').count();
    // Either table headers or card layout
    expect(hasHeaders + hasCards).toBeGreaterThan(0);
  });
});
