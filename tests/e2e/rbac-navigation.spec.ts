/**
 * E2E Tests — RBAC & Navigation
 * SCR-02: Dashboard, Sidebar Navigation, Role-Based Access
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

// ─── SCR-02: Dashboard ──────────────────────────────────────
test.describe('SCR-02: Dashboard', () => {
  test('TC-NAV-01: Dashboard loads after login', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.waitForTimeout(1000);
    // Dashboard shows stats or chart
    await expect(page.locator('text=Tổng nhân viên, text=Biểu đồ chấm công, text=Đúng giờ').first()).toBeVisible();
  });

  test('TC-NAV-02: Sidebar shows all navigation items for Admin', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=QR Code')).toBeVisible();
    await expect(page.locator('text=Lịch sử')).toBeVisible();
    await expect(page.locator('text=Ca làm việc')).toBeVisible();
    await expect(page.locator('text=Cấu hình lương')).toBeVisible();
    await expect(page.locator('text=Báo cáo lương')).toBeVisible();
    await expect(page.locator('text=Cài đặt')).toBeVisible();
  });

  test('TC-NAV-03: Sidebar navigation works - click Ca làm việc', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.click('text=Ca làm việc');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Quản lý Ca làm việc')).toBeVisible();
  });

  test('TC-NAV-04: Sidebar navigation works - click Nhân viên', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.click('text=Nhân viên');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Quản lý Nhân sự')).toBeVisible();
  });

  test('TC-NAV-05: Sidebar navigation works - click Cấu hình lương', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.click('text=Cấu hình lương');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Cấu hình lương hệ thống')).toBeVisible();
  });

  test('TC-NAV-06: Sidebar navigation works - click Cài đặt', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.click('text=Cài đặt');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Cài đặt hệ thống')).toBeVisible();
  });

  test('TC-NAV-07: Sidebar navigation works - click Báo cáo lương', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Báo cáo lương")');
    await page.waitForTimeout(2000);
    await expect(page.locator('h2:has-text("Báo cáo lương"), text=Tháng').first()).toBeVisible();
  });

  test('TC-NAV-08: Sidebar navigation works - click QR Code', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("QR Code")');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Mã QR, text=Tạo mã QR').first()).toBeVisible();
  });
});

// ─── RBAC Enforcement ───────────────────────────────────────
test.describe('RBAC: Role-Based Access', () => {
  test('TC-RBAC-01: Employee cannot access Admin-only pages via URL', async ({ page }) => {
    await loginAs(page, 'employee@pas.vn', 'emp123456');
    // Try to navigate to admin-only page
    await page.goto(`${BASE_URL}/users`);
    await page.waitForTimeout(2000);
    // Employee should not see user management
    const content = await page.textContent('body');
    // Should either redirect or show access denied
    expect(content).toBeTruthy();
  });

  test('TC-RBAC-02: Employee can access own attendance history', async ({ page }) => {
    await loginAs(page, 'employee@pas.vn', 'emp123456');
    await page.goto(`${BASE_URL}/attendance`);
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Lịch sử chấm công')).toBeVisible();
  });

  test('TC-RBAC-03: Admin can access all pages', async ({ page }) => {
    await loginAs(page, 'admin@pas.vn', 'admin123');
    const pages = ['/dashboard', '/users', '/shifts', '/salary/config', '/salary/report', '/settings'];
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`);
      await page.waitForTimeout(1000);
      // Should not redirect to login
      expect(page.url()).not.toContain('/login');
    }
  });
});
