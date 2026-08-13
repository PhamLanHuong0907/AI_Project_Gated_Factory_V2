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

import { useAuth } from '../services/auth-context'

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [stats, setStats] = useState<AttendanceStatsResponse | null>(null)
  const [recentActivity, setRecentActivity] = useState<AttendanceResponse[]>([])
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [weeklyChartData, setWeeklyChartData] = useState<{ label: string; value: number }[]>([])
  const [avgWorkingHours, setAvgWorkingHours] = useState('0')

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return
      
      try {
        setLoading(true)
        const date = new Date().toISOString().split('T')[0]
        
        let usersData = await api.users.getAll()
        if (user?.role === 'EMPLOYEE') {
          usersData = usersData.filter((u: any) => u.id === user.id)
        }
        
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
        const dateFrom = sevenDaysAgo.toISOString().split('T')[0]

        const [statsData, activityData, leavesData, weeklyAttendanceData] = await Promise.all([
          api.attendance.getStats(date, user?.role === 'EMPLOYEE' ? user.id : undefined),
          api.attendance.getAll({ page: 0, size: 5, sort: 'createdAt,desc', userId: user?.role === 'EMPLOYEE' ? user.id : undefined }),
          user?.role === 'EMPLOYEE' ? api.leaveRequests.getMy(user.id, 0, 1) : api.leaveRequests.getAll(0, 1),
          api.attendance.getAll({ dateFrom, dateTo: date, size: 1000, userId: user?.role === 'EMPLOYEE' ? user.id : undefined })
        ])
        
        setTotalUsers(usersData.length)
        setStats(statsData)
        setRecentActivity(activityData.content)
        setPendingLeaves(leavesData.totalElements)

        // Compute Weekly Chart Data
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        const chartData = []
        let totalHours = 0
        let completedShiftsCount = 0

        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const label = days[d.getDay()]
          
          const recordsForDay = weeklyAttendanceData.content.filter(r => r.date === dateStr)
          let attendanceRate = 0
          if (usersData.length > 0) {
             const presentCount = new Set(recordsForDay.filter(r => r.status !== 'ABSENT' && r.status !== 'ON_LEAVE').map(r => r.userId)).size
             attendanceRate = Math.round((presentCount / usersData.length) * 100)
          }
          chartData.push({ label, value: attendanceRate })

          // Calculate hours for this day
          recordsForDay.forEach(r => {
             if (r.checkInTime && r.checkOutTime) {
                const parseTime = (t: string) => {
                   try {
                     // Check if ISO format
                     if (t.includes('T')) return new Date(t).getTime();
                     // Otherwise try to parse the old HH:mm SA/CH format
                     const parts = t.split(' ');
                     if (parts.length < 2) return 0;
                     const [hm, ampm] = parts;
                     const [h, m] = hm.split(':').map(Number);
                     let hours = h;
                     if (ampm.toUpperCase() === 'CH' && h < 12) hours += 12;
                     if (ampm.toUpperCase() === 'SA' && h === 12) hours = 0;
                     const dateObj = new Date(r.date);
                     dateObj.setHours(hours, m, 0, 0);
                     return dateObj.getTime();
                   } catch { return 0; }
                }
                const inTime = parseTime(r.checkInTime)
                const outTime = parseTime(r.checkOutTime)
                if (inTime && outTime && outTime > inTime) {
                   totalHours += (outTime - inTime) / (1000 * 60 * 60)
                   completedShiftsCount++
                }
             }
          })
        }
        setWeeklyChartData(chartData)
        setAvgWorkingHours(completedShiftsCount > 0 ? (totalHours / completedShiftsCount).toFixed(1) : '0')
        
      } catch (e) {
        console.error('Failed to load dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, authLoading])

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

  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return '--'
    try {
      if (timeStr.includes('T')) {
        return new Date(timeStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
      return timeStr
    } catch {
      return timeStr
    }
  }

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
            {weeklyChartData.map((data, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 transition-all duration-500"
                  style={{ height: `${data.value}%`, minHeight: data.value > 0 ? '4px' : '0' }}
                  title={`${data.value}%`}
                />
                <span className="text-label-xs text-neutral-text-muted">
                  {data.label}
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
                        Check-in • {formatTime(item.checkInTime)}
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
            <div className="text-headline-xl font-bold text-success">{avgWorkingHours}h</div>
            <div className="text-label-xs text-neutral-text-secondary">TB giờ làm/ca</div>
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
