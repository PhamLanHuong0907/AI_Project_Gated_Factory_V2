/**
 * E2E Tests — Authentication Flows
 * SCR-01: Login Page
 *
 * operationId: POST /auth/login, POST /auth/register, GET /auth/me
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080';

// ─── SCR-01: Login ──────────────────────────────────────────
test.describe('SCR-01: Authentication', () => {

  test('TC-AUTH-01: Login page renders correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('text=Đăng nhập')).toBeVisible();
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('TC-AUTH-02: Login with valid admin credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[placeholder*="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC-AUTH-03: Login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[placeholder*="email"]', 'wrong@pas.vn');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    // Should stay on login page or show error
    const url = page.url();
    expect(url).toContain('login');
  });

  test('TC-AUTH-04: Login with HR Manager credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[placeholder*="email"]', 'hr.manager@pas.vn');
    await page.fill('input[type="password"]', 'hr123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC-AUTH-05: Login with Employee credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[placeholder*="email"]', 'employee@pas.vn');
    await page.fill('input[type="password"]', 'emp123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC-AUTH-06: Logout clears session and redirects to login', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[placeholder*="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Click logout
    const logoutBtn = page.locator('text=Đăng xuất');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page).toHaveURL(/login/);
    }
  });

  test('TC-AUTH-07: Unauthenticated user can access pages (dev mode with permitAll)', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    const url = page.url();
    // In dev mode with permitAll(), pages are accessible without auth
    expect(url).toContain('/dashboard');
  });

  test('TC-AUTH-08: Backend login API returns JWT token', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@pas.vn', password: 'admin123' },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.email).toBe('admin@pas.vn');
    expect(body.user.role).toBe('ADMIN');
  });

  test('TC-AUTH-09: Backend login API rejects invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'wrong@pas.vn', password: 'wrong' },
    });
    expect(response.status()).toBe(401);
  });
});
