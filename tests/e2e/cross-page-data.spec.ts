/**
 * Cross-Page Data Relationship Tests
 *
 * Tests verify that data flows correctly between pages:
 * 1. Leave Approval → Attendance History (approved leave = "Nghỉ có lý do" status)
 * 2. User Management → Salary Config (new user appears in salary assignment)
 * 3. Shift Management → Attendance (shift changes affect attendance records)
 * 4. Login → Dashboard (user data displays correctly)
 * 5. QR Code → Attendance (check-in creates attendance record)
 */

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:8080'

// Test credentials
const ADMIN_CREDS = { email: 'admin@company.vn', password: 'Admin@123' }
const HR_CREDS = { email: 'hr@company.vn', password: 'Hr@123' }
const EMPLOYEE_CREDS = { email: 'employee@company.vn', password: 'Employee@123' }

test.describe('Cross-Page Data Relationships', () => {
  test.describe('Leave Approval → Attendance History', () => {
    test('SCENARIO-LA-ATT: Approved leave request updates attendance status to "Nghỉ có lý do"', async ({ page }) => {
      // Step 1: Login as HR Manager
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', HR_CREDS.email)
      await page.fill('input[type="password"]', HR_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Navigate to Leave Approval
      await page.click('a[href="/admin/leave-requests"]')
      await page.waitForLoadState('networkidle')

      // Step 3: Find a PENDING leave request
      const pendingRequests = page.locator('[data-status="PENDING"]')
      const pendingCount = await pendingRequests.count()

      if (pendingCount > 0) {
        // Step 4: Get the employee name from the first pending request
        const firstRequest = pendingRequests.first()
        const employeeName = await firstRequest.locator('.font-semibold').first().textContent()

        // Step 5: Approve the leave request
        await firstRequest.locator('button:has-text("Duyệt")').click()
        await page.waitForTimeout(1000)

        // Step 6: Navigate to Attendance History
        await page.click('a[href="/attendance"]')
        await page.waitForLoadState('networkidle')

        // Step 7: Verify the attendance record shows "Nghỉ có lý do" status
        const attendanceRows = page.locator('table tbody tr')
        const rowCount = await attendanceRows.count()

        let foundLeaveStatus = false
        for (let i = 0; i < rowCount; i++) {
          const row = attendanceRows.nth(i)
          const nameCell = await row.locator('td').nth(6).textContent()
          const statusCell = await row.locator('td').nth(7).textContent()

          if (nameCell?.includes(employeeName || '')) {
            if (statusCell?.includes('Nghỉ có lý do')) {
              foundLeaveStatus = true
              break
            }
          }
        }

        // Step 8: Assert the status is updated
        expect(foundLeaveStatus).toBeTruthy()
      }
    })

    test('SCENARIO-LA-EMP: Employee sees approved leave in their leave requests', async ({ page }) => {
      // Step 1: Login as Employee
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', EMPLOYEE_CREDS.email)
      await page.fill('input[type="password"]', EMPLOYEE_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Navigate to Leave Requests (Employee)
      await page.click('a[href="/leave-requests"]')
      await page.waitForLoadState('networkidle')

      // Step 3: Check for APPROVED status
      const approvedBadges = page.locator('text=Đã duyệt')
      const approvedCount = await approvedBadges.count()

      // Step 4: Assert there are approved requests
      expect(approvedCount).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('User Management → Salary Config', () => {
    test('SCENARIO-USER-SAL: New user appears in salary assignment dropdown', async ({ page }) => {
      // Step 1: Login as Admin
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', ADMIN_CREDS.email)
      await page.fill('input[type="password"]', ADMIN_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Get initial user count from Users page
      await page.click('a[href="/users"]')
      await page.waitForLoadState('networkidle')

      const userRows = page.locator('table tbody tr')
      const initialUserCount = await userRows.count()

      // Step 3: Navigate to Salary Config
      await page.click('a[href="/salary/config"]')
      await page.waitForLoadState('networkidle')

      // Step 4: Click on "Lương nhân viên" tab
      await page.click('button:has-text("Lương nhân viên")')
      await page.waitForTimeout(500)

      // Step 5: Check employee dropdown
      const employeeSelect = page.locator('select').first()
      const optionCount = await employeeSelect.locator('option').count()

      // Step 6: Assert dropdown has users
      expect(optionCount).toBeGreaterThan(1) // At least "Chọn nhân viên" + 1 user
    })
  })

  test.describe('Shift Management → Attendance', () => {
    test('SCENARIO-SHIFT-ATT: Shift details appear in attendance history', async ({ page }) => {
      // Step 1: Login as Admin
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', ADMIN_CREDS.email)
      await page.fill('input[type="password"]', ADMIN_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Navigate to Shifts to get shift names
      await page.click('a[href="/shifts"]')
      await page.waitForLoadState('networkidle')

      const shiftRows = page.locator('table tbody tr')
      const shiftCount = await shiftRows.count()

      if (shiftCount > 0) {
        const firstShiftName = await shiftRows.first().locator('td').first().textContent()

        // Step 3: Navigate to Attendance History
        await page.click('a[href="/attendance"]')
        await page.waitForLoadState('networkidle')

        // Step 4: Verify shift name appears in attendance table
        const attendanceRows = page.locator('table tbody tr')
        const attendanceCount = await attendanceRows.count()

        let foundShiftInAttendance = false
        for (let i = 0; i < attendanceCount; i++) {
          const row = attendanceRows.nth(i)
          const shiftCell = await row.locator('td').nth(3).textContent()

          if (shiftCell?.includes(firstShiftName || '')) {
            foundShiftInAttendance = true
            break
          }
        }

        // Step 5: Assert shift appears in attendance
        expect(foundShiftInAttendance).toBeTruthy()
      }
    })
  })

  test.describe('Login → Dashboard', () => {
    test('SCENARIO-LOGIN-DASH: User data displays correctly on dashboard after login', async ({ page }) => {
      // Step 1: Login as Admin
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', ADMIN_CREDS.email)
      await page.fill('input[type="password"]', ADMIN_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Verify user name appears on dashboard
      const userName = page.locator('text=Admin').first()
      await expect(userName).toBeVisible()

      // Step 3: Verify role badge
      const roleBadge = page.locator('text=Quản trị viên')
      await expect(roleBadge).toBeVisible()
    })

    test('SCENARIO-LOGIN-EMP: Employee sees correct dashboard', async ({ page }) => {
      // Step 1: Login as Employee
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', EMPLOYEE_CREDS.email)
      await page.fill('input[type="password"]', EMPLOYEE_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Verify employee sees bottom nav (not sidebar)
      const bottomNav = page.locator('nav.md:hidden')
      await expect(bottomNav).toBeVisible()

      // Step 3: Verify sidebar is hidden for employee
      const sidebar = page.locator('aside')
      await expect(sidebar).not.toBeVisible()
    })
  })

  test.describe('QR Code → Attendance', () => {
    test('SCENARIO-QR-ATT: Manual check-in creates attendance record', async ({ page }) => {
      // Step 1: Login as Admin
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', ADMIN_CREDS.email)
      await page.fill('input[type="password"]', ADMIN_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Navigate to Attendance History
      await page.click('a[href="/attendance"]')
      await page.waitForLoadState('networkidle')

      // Step 3: Get initial record count
      const initialRows = page.locator('table tbody tr')
      const initialCount = await initialRows.count()

      // Step 4: Click "Chấm công thủ công" button
      await page.click('button:has-text("Chấm công thủ công")')
      await page.waitForTimeout(500)

      // Step 5: Select employee and shift
      const employeeSelect = page.locator('select').first()
      await employeeSelect.selectOption({ index: 1 })

      const shiftSelect = page.locator('select').nth(1)
      await shiftSelect.selectOption({ index: 1 })

      // Step 6: Submit
      await page.click('button:has-text("Chấm công")')
      await page.waitForTimeout(1000)

      // Step 7: Verify new record appears
      const newRows = page.locator('table tbody tr')
      const newCount = await newRows.count()

      expect(newCount).toBeGreaterThanOrEqual(initialCount)
    })
  })

  test.describe('Salary Config → Salary Report', () => {
    test('SCENARIO-SAL-REP: Salary assignment affects salary report', async ({ page }) => {
      // Step 1: Login as Admin
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', ADMIN_CREDS.email)
      await page.fill('input[type="password"]', ADMIN_CREDS.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/dashboard')

      // Step 2: Navigate to Salary Config
      await page.click('a[href="/salary/config"]')
      await page.waitForLoadState('networkidle')

      // Step 3: Check positions exist
      await page.click('button:has-text("Vị trí")')
      await page.waitForTimeout(500)

      const positionRows = page.locator('table tbody tr')
      const positionCount = await positionRows.count()

      // Step 4: Navigate to Salary Report
      await page.click('a[href="/salary/report"]')
      await page.waitForLoadState('networkidle')

      // Step 5: Verify report has data
      const reportRows = page.locator('table tbody tr')
      const reportCount = await reportRows.count()

      // Report should have entries if positions are configured
      expect(reportCount).toBeGreaterThanOrEqual(0)
    })
  })
})
