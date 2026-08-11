import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { QrCodePage } from './pages/QrCode'
import { QrScanPage } from './pages/QrScan'
import { AttendanceHistory as AttendanceHistoryPage } from './pages/AttendanceHistory'
import { AttendanceReportPage } from './pages/AttendanceReport'
import { ShiftsPage } from './pages/Shifts'
import { SalaryConfigPage } from './pages/SalaryConfig'
import { SalaryReportPage } from './pages/SalaryReport'
import { UsersPage } from './pages/Users'
import { SettingsPage } from './pages/Settings'
import { LeaveRequestsPage } from './pages/LeaveRequests'
import { LeaveApproval as LeaveApprovalPage } from './pages/LeaveApproval'

/**
 * App Root — 12 Routes per 12 SCR screens
 *
 * Public:  SCR-01 (Login)
 * Employee: SCR-02 (Dashboard), SCR-03 (QrCode), SCR-04 (QrScan), SCR-05 (Attendance), SCR-07 (SalaryReport), SCR-11 (LeaveRequests)
 * Admin/HR: SCR-06 (Shifts), SCR-08 (LeaveApproval), SCR-09 (Users), SCR-10 (Settings), SCR-12 (SalaryConfig)
 *
 * RBAC enforcement: backend SecurityConfig + frontend role-based rendering
 */
export default function App() {
  return (
    <Routes>
      {/* SCR-01: Login — standalone, no App Shell */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated routes with App Shell */}
      <Route element={<AppShell />}>
        {/* Employee routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/qr-code" element={<QrCodePage />} />
        <Route path="/qr-scan" element={<QrScanPage />} />
        <Route path="/attendance" element={<AttendanceHistoryPage />} />
        <Route path="/salary/report" element={<SalaryReportPage />} />
        <Route path="/leave-requests" element={<LeaveRequestsPage />} />

        {/* Admin/HR routes */}
        <Route path="/attendance/report" element={<AttendanceReportPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/salary/config" element={<SalaryConfigPage />} />
        <Route path="/admin/leave-requests" element={<LeaveApprovalPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
