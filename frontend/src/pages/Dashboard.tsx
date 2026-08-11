import { useState, useEffect } from 'react'
import { Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity, Loader2 } from 'lucide-react'
import { api } from '../services/api'
import type { AttendanceResponse, AttendanceStatsResponse } from '../services/types'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  ON_TIME: { label: 'Đúng giờ', className: 'badge-on-time' },
  LATE: { label: 'Đi muộn', className: 'badge-late' },
  ABSENT: { label: 'Vắng mặt', className: 'badge-absent' },
  ON_LEAVE: { label: 'Xin nghỉ', className: 'badge-leave' },
  EARLY_LEAVE: { label: 'Về sớm', className: 'badge-early-leave' },
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [stats, setStats] = useState<AttendanceStatsResponse | null>(null)
  const [recentActivity, setRecentActivity] = useState<AttendanceResponse[]>([])
  const [pendingLeaves, setPendingLeaves] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const date = new Date().toISOString().split('T')[0]
        
        const [usersData, statsData, activityData, leavesData] = await Promise.all([
          api.users.getAll(),
          api.attendance.getStats(date),
          api.attendance.getAll({ page: 0, size: 5, sort: 'createdAt,desc' }),
          api.leaveRequests.getAll(0, 1)
        ])
        
        setTotalUsers(usersData.length)
        setStats(statsData)
        setRecentActivity(activityData.content)
        setPendingLeaves(leavesData.totalElements)
      } catch (e) {
        console.error('Failed to load dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const STATS = [
    { icon: Users, label: 'Tổng nhân viên', value: totalUsers.toString(), color: 'text-primary', bg: 'bg-primary-container' },
    { icon: CheckCircle, label: 'Đúng giờ hôm nay', value: stats?.onTimeCheckIn?.toString() || '0', color: 'text-success', bg: 'bg-success-light' },
    { icon: AlertTriangle, label: 'Đi trễ', value: stats?.late?.toString() || '0', color: 'text-warning', bg: 'bg-warning-light' },
    { icon: Clock, label: 'Xin nghỉ', value: stats?.leave?.toString() || '0', color: 'text-error', bg: 'bg-error-light' },
  ]

  return (
    <div className="space-y-lg">
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="text-headline-2xl font-bold text-neutral-text-primary">
                {stat.value}
              </div>
              <div className="text-label-xs text-neutral-text-secondary">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        <div className="card p-lg">
          <h2 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">
            Biểu đồ chấm công tuần
          </h2>
          <div className="flex h-[200px] items-end gap-2">
            {[65, 80, 72, 90, 85, 60, 45].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-label-xs text-neutral-text-muted">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-lg">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-headline-lg font-semibold text-neutral-text-primary">
              Hoạt động gần đây
            </h2>
            <Activity size={20} className="text-neutral-text-muted" />
          </div>
          <div className="space-y-sm">
            {recentActivity.length === 0 ? (
              <div className="text-center text-neutral-text-muted py-sm">Không có hoạt động nào</div>
            ) : (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border border-neutral-border p-sm"
                >
                  <div className="flex items-center gap-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {item.userName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-body-sm font-medium text-neutral-text-primary">
                        {item.userName}
                      </div>
                      <div className="text-label-xs text-neutral-text-muted">
                        Check-in • {item.checkInTime || '--'}
                      </div>
                    </div>
                  </div>
                  <span className={`badge-status ${STATUS_MAP[item.status]?.className || 'badge-on-time'}`}>
                    {STATUS_MAP[item.status]?.label || item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card p-lg">
        <div className="flex items-center gap-sm mb-md">
          <TrendingUp size={20} className="text-primary" />
          <h2 className="text-headline-lg font-semibold text-neutral-text-primary">
            Thống kê nhanh
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
          <div className="text-center">
            <div className="text-headline-xl font-bold text-primary">{stats?.attendanceRate || 0}%</div>
            <div className="text-label-xs text-neutral-text-secondary">Tỷ lệ đúng giờ</div>
          </div>
          <div className="text-center">
            <div className="text-headline-xl font-bold text-success">8.5h</div>
            <div className="text-label-xs text-neutral-text-secondary">TB giờ làm/ngày</div>
          </div>
          <div className="text-center">
            <div className="text-headline-xl font-bold text-warning">{pendingLeaves}</div>
            <div className="text-label-xs text-neutral-text-secondary">Tổng đơn xin nghỉ</div>
          </div>
          <div className="text-center">
            <div className="text-headline-xl font-bold text-error">{stats?.absent || 0}</div>
            <div className="text-label-xs text-neutral-text-secondary">Vắng mặt hôm nay</div>
          </div>
        </div>
      </div>
    </div>
  )
}
