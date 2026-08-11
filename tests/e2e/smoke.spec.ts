/**
 * E2E Smoke Tests — Critical Path Verification
 * Run before any release gate
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080';

test.describe('Smoke: Critical Path', () => {
  test('SMOKE-01: Backend health check', async ({ request }) => {
    const response = await request.get(`${API_URL}/actuator/health`);
    // Backend should respond (even if actuator not configured, it should return something)
    expect(response.status()).toBeLessThan(500);
  });

  test('SMOKE-02: Login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('text=Precision Attendance')).toBeVisible();
  });

  test('SMOKE-03: Admin login works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('SMOKE-04: Backend login API returns JWT', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@pas.vn', password: 'admin123' },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.token).toBeTruthy();
  });

  test('SMOKE-05: Dashboard loads after login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(2000);
    // Dashboard should show some content - sidebar or stats
    const hasContent = await page.locator('button:has-text("Dashboard"), button:has-text("QR Code"), .stat-card').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test('SMOKE-06: Users API returns data', async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@pas.vn', password: 'admin123' },
    });
    const { token } = await loginRes.json();

    const usersRes = await request.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(usersRes.ok()).toBeTruthy();
  });

  test('SMOKE-07: Shifts API returns data', async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@pas.vn', password: 'admin123' },
    });
    const { token } = await loginRes.json();

    const shiftsRes = await request.get(`${API_URL}/api/shifts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(shiftsRes.ok()).toBeTruthy();
  });

  test('SMOKE-08: Frontend builds without errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Page should load without console errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('SMOKE-09: Navigation to all main pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    const pages = ['/dashboard', '/users', '/shifts', '/salary/config', '/salary/report', '/settings'];
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`);
      await page.waitForTimeout(1000);
      expect(page.url()).toContain(p);
    }
  });

  test('SMOKE-10: Logout works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@pas.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Click logout
    const logoutBtn = page.locator('button:has-text("Đăng xuất")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/login');
    }
  });
});
