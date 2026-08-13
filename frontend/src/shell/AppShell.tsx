import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  QrCode,
  Clock,
  Users,
  CalendarClock,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  User,
  ClipboardList,
  ClipboardCheck,
} from 'lucide-react'
import { useAuth } from '../services/auth-context'

/**
 * App Shell — Global Layout
 *
 * Employee: NO sidebar, only bottom nav (mobile style)
 * Admin/HR: Sidebar on desktop, topbar on mobile
 */

// ── Employee Bottom Nav (always visible) ──
const EMPLOYEE_BOTTOM_NAV = [
  { icon: QrCode, label: 'Chấm công', path: '/qr-scan' },
  { icon: Clock, label: 'Lịch sử', path: '/attendance' },
  { icon: ClipboardList, label: 'Đơn từ', path: '/leave-requests' },
  { icon: User, label: 'Cá nhân', path: '/salary/report' },
]

// ── Admin/HR Sidebar Nav ──
const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: QrCode, label: 'QR Code', path: '/qr-code' },
  { icon: Clock, label: 'Lịch sử', path: '/attendance' },
  { icon: ClipboardCheck, label: 'Báo cáo chấm công', path: '/attendance/report' },
  { icon: Users, label: 'Nhân viên', path: '/users' },
  { icon: CalendarClock, label: 'Ca làm việc', path: '/shifts' },
  { icon: Wallet, label: 'Cấu hình lương', path: '/salary/config' },
  { icon: BarChart3, label: 'Báo cáo lương', path: '/salary/report' },
  { icon: ClipboardList, label: 'Duyệt đơn', path: '/admin/leave-requests' },
  { icon: Settings, label: 'Cài đặt', path: '/settings' },
]

// ── Page Titles ──
const PAGE_TITLES: Record<string, string> = {
  '/attendance': 'Lịch sử chấm công',
  '/attendance/report': 'Báo cáo chấm công',
  '/dashboard': 'Dashboard',
  '/qr-code': 'Tạo mã QR',
  '/qr-scan': 'Chấm công',
  '/users': 'Quản lý Nhân sự',
  '/shifts': 'Quản lý Ca làm việc',
  '/salary/config': 'Cấu hình lương',
  '/salary/report': 'Báo cáo lương',
  '/leave-requests': 'Đơn từ',
  '/admin/leave-requests': 'Duyệt đơn từ',
  '/settings': 'Cài đặt hệ thống',
}

// ── Get user role from localStorage ──
function getUserRole(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role || 'EMPLOYEE'
  } catch {
    return 'EMPLOYEE'
  }
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard'
  const { user, logout } = useAuth()
  const userRole = user?.role || getUserRole()
  const isAdmin = userRole === 'ADMIN' || userRole === 'HR_MANAGER'

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-background">
      {/* ── Sidebar (Admin/HR ONLY) ── */}
      {isAdmin && (
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-neutral-border bg-neutral-background md:flex">
          {/* Brand */}
          <div className="px-lg py-lg">
            <div className="text-headline-lg font-bold text-primary">Precision Attendance</div>
            <div className="text-label-xs text-neutral-text-muted">HR Management</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-sm overflow-y-auto">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-sm rounded px-md py-sm text-body-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-text-secondary hover:bg-neutral-surface hover:text-neutral-text-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-sm pb-lg">
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="flex w-full items-center gap-sm rounded px-md py-sm text-body-base font-medium text-neutral-text-secondary hover:bg-neutral-surface hover:text-neutral-text-primary"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-border bg-neutral-background px-md md:h-[64px] md:px-lg">
          <div className="flex items-center gap-sm">
            <h1 className="text-headline-lg font-semibold text-neutral-text-primary md:text-headline-xl">
              {currentTitle}
            </h1>
          </div>
          <div className="flex items-center gap-sm md:gap-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white md:h-9 md:w-9 md:text-sm" title={user?.fullName || ''}>
              {isAdmin ? 'A' : 'NV'}
            </div>
            {!isAdmin && (
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-text-secondary hover:bg-neutral-surface hover:text-error transition-colors md:h-9 md:w-9"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-auto bg-neutral-surface p-md md:p-lg ${!isAdmin ? 'pb-24' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* ── Bottom Nav (Employee ONLY - always visible) ── */}
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-neutral-border bg-white">
          {EMPLOYEE_BOTTOM_NAV.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-1 flex-col items-center gap-1 py-2 ${
                  isActive ? 'text-primary' : 'text-neutral-text-muted'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon size={22} />
                </div>
                <span className="text-label-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
