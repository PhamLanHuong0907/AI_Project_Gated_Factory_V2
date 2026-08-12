import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { api } from '../services/api'
import type { AttendanceResponse, ShiftResponse } from '../services/types'
import { AttendanceStatus } from '../services/types'
import { ManualCheckInModal } from '../components/ManualCheckInModal'
import { useAuth } from '../services/auth-context'

interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  employeeCode: string
  date: string
  time: string
  scanType: 'Check in' | 'Check out' | '-'
  shiftName: string
  gpsLocation: string
  status: AttendanceStatus
  lateMinutes?: number
  earlyMinutes?: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  [AttendanceStatus.ON_TIME]: {
    label: 'Đúng giờ',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircleIcon,
  },
  [AttendanceStatus.LATE]: {
    label: 'Đi trễ',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: ExclamationTriangleIcon,
  },
  [AttendanceStatus.ABSENT]: {
    label: 'Vắng mặt',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: XCircleIcon,
  },
  [AttendanceStatus.EARLY_LEAVE]: {
    label: 'Về sớm',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: ArrowPathIcon,
  },
  [AttendanceStatus.ON_LEAVE]: {
    label: 'Nghỉ có lý do',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: CheckCircleIcon,
  },
}

const STATUS_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'onTimeCheckIn', label: 'Check-in đúng giờ' },
  { key: 'late', label: 'Đi trễ' },
  { key: 'onTimeCheckOut', label: 'Checkout đúng giờ' },
  { key: 'earlyLeave', label: 'Về sớm' },
]

export function AttendanceHistory() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showManualCheckIn, setShowManualCheckIn] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [shifts, setShifts] = useState<ShiftResponse[]>([])
  const todayStr = new Date().toISOString().split('T')[0]
  const [dateFrom, setDateFrom] = useState(todayStr)
  const [dateTo, setDateTo] = useState(todayStr)
  const [selectedShiftId, setSelectedShiftId] = useState('all')
  const itemsPerPage = 10

  useEffect(() => {
    if (!authLoading) {
      loadData()
    }
  }, [dateFrom, dateTo, selectedShiftId, user, authLoading])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [attendanceRes, usersData, shiftsData] = await Promise.all([
        api.attendance.getAll({ 
          page: 0, 
          size: 1000,
          userId: user?.role === 'EMPLOYEE' ? user.id : undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          shiftId: selectedShiftId !== 'all' ? selectedShiftId : undefined
        }),
        api.users.getAll(),
        api.shifts.getAll(),
      ])

      let filteredUsers = usersData
      if (user?.role === 'EMPLOYEE') {
        filteredUsers = usersData.filter((u: any) => u.id === user.id)
      }
      setUsers(filteredUsers.filter((u: any) => u.role !== 'ADMIN'))
      setShifts(shiftsData)

      const records: AttendanceRecord[] = attendanceRes.content.flatMap((att: any) => {
        const user = usersData.find((u: any) => u.id === att.userId)
        const shift = shiftsData.find((s: any) => s.id === att.shiftId)

        const baseRecord = {
          userId: att.userId,
          userName: att.userName || user?.fullName || 'N/A',
          employeeCode: att.employeeCode || user?.employeeCode || '-',
          date: att.date,
          shiftName: att.shiftName || shift?.name || '-',
          lateMinutes: att.lateMinutes,
          earlyMinutes: att.earlyMinutes,
        }

        const rows: AttendanceRecord[] = []

        if (att.checkInTime) {
          rows.push({
            ...baseRecord,
            id: att.id + '-in',
            time: new Date(att.checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            scanType: 'Check in',
            gpsLocation: att.checkInLat && att.checkInLng ? `${parseFloat(att.checkInLat).toFixed(4)}, ${parseFloat(att.checkInLng).toFixed(4)}` : 'Văn phòng công ty',
            status: att.status || AttendanceStatus.ON_TIME,
          })
        }

        if (att.checkOutTime) {
          rows.push({
            ...baseRecord,
            id: att.id + '-out',
            time: new Date(att.checkOutTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            scanType: 'Check out',
            gpsLocation: att.checkOutLat && att.checkOutLng ? `${parseFloat(att.checkOutLat).toFixed(4)}, ${parseFloat(att.checkOutLng).toFixed(4)}` : 'Văn phòng công ty',
            status: (att.earlyMinutes && att.earlyMinutes > 0) ? AttendanceStatus.EARLY_LEAVE : AttendanceStatus.ON_TIME,
          })
        }

        if (!att.checkInTime && !att.checkOutTime) {
          rows.push({
            ...baseRecord,
            id: att.id,
            time: '--:--',
            scanType: '-',
            gpsLocation: '-',
            status: att.status || AttendanceStatus.ABSENT,
          })
        }

        return rows
      })

      setRecords(records)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter((record) => {
    let matchesFilter = false;
    if (activeFilter === 'all') matchesFilter = true;
    else if (activeFilter === 'onTimeCheckIn') matchesFilter = record.status !== AttendanceStatus.ABSENT && record.status !== AttendanceStatus.ON_LEAVE && record.time !== '--:--' && (!record.lateMinutes || record.lateMinutes === 0) && record.scanType !== 'Check out';
    else if (activeFilter === 'late') matchesFilter = record.lateMinutes !== undefined && record.lateMinutes > 0;
    else if (activeFilter === 'onTimeCheckOut') matchesFilter = record.status !== AttendanceStatus.ABSENT && record.status !== AttendanceStatus.ON_LEAVE && record.scanType === 'Check out' && (!record.earlyMinutes || record.earlyMinutes === 0);
    else if (activeFilter === 'earlyLeave') matchesFilter = record.earlyMinutes !== undefined && record.earlyMinutes > 0;

    const matchesSearch =
      record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  }).sort((a, b) => {
    // Sort by date desc
    if (a.date !== b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    // Sort by time desc
    if (a.time === '--:--' && b.time !== '--:--') return 1;
    if (b.time === '--:--' && a.time !== '--:--') return -1;
    if (a.time === '--:--' && b.time === '--:--') return 0;
    
    // Parse time like '11:57 SA'
    const parseTime = (t: string) => {
      if (!t) return 0;
      const parts = t.split(' ');
      if (parts.length < 2) return 0;
      const [hm, ampm] = parts;
      const [h, m] = hm.split(':').map(Number);
      let hours = h;
      if (ampm.toUpperCase() === 'CH' && h < 12) hours += 12;
      if (ampm.toUpperCase() === 'SA' && h === 12) hours = 0;
      return hours * 60 + m;
    }
    return parseTime(b.time) - parseTime(a.time)
  })

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage)

  // Calculate Absents dynamically
  let calculatedAbsents = 0;
  const now = new Date();
  
  if (dateFrom && dateTo && shifts.length > 0 && users.length > 0) {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    
    // Only process up to 31 days to avoid performance issues
    const daysDiff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    if (daysDiff >= 0 && daysDiff <= 31) {
      const targetUsers = users.filter(u => u.role !== 'ADMIN');
      const activeShifts = selectedShiftId === 'all' ? shifts : shifts.filter(s => s.id === selectedShiftId);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        activeShifts.forEach(shift => {
          const [hours, minutes, seconds] = shift.endTime.split(':');
          const shiftEnd = new Date(dateStr);
          shiftEnd.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds || '0', 10));
          
          if (shiftEnd < now) {
            // Shift has ended
            targetUsers.forEach(u => {
              const record = records.find(r => r.userId === u.id && r.date === dateStr && r.shiftName === shift.name);
              if (!record || record.status === AttendanceStatus.ABSENT) {
                calculatedAbsents++;
              }
            });
          }
        });
      }
    }
  }

  const stats = {
    onTimeCheckIn: records.filter((r) => r.status !== AttendanceStatus.ABSENT && r.status !== AttendanceStatus.ON_LEAVE && r.time !== '-' && (!r.lateMinutes || r.lateMinutes === 0)).length,
    late: records.filter((r) => r.lateMinutes && r.lateMinutes > 0).length,
    onTimeCheckOut: records.filter((r) => r.status !== AttendanceStatus.ABSENT && r.status !== AttendanceStatus.ON_LEAVE && r.scanType === 'Check out' && (!r.earlyMinutes || r.earlyMinutes === 0)).length,
    earlyLeave: records.filter((r) => r.earlyMinutes && r.earlyMinutes > 0).length,
    absent: calculatedAbsents,
    leave: records.filter((r) => r.status === AttendanceStatus.ON_LEAVE).length,
  }

  const handleManualCheckInSuccess = () => {
    setShowManualCheckIn(false)
    loadData()
  }

  const handleExport = async () => {
    try {
      const blob = await api.attendance.exportCsv()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-export-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-semibold">Lỗi tải dữ liệu</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử chấm công</h1>
          <p className="text-gray-600 mt-1">Theo dõi thông tin chấm công của nhân viên</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManualCheckIn(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ClockIcon className="h-5 w-5" />
            Chấm công thủ công
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-in đúng giờ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onTimeCheckIn}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đi trễ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checkout đúng giờ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onTimeCheckOut}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Về sớm</p>
              <p className="text-2xl font-bold text-gray-900">{stats.earlyLeave}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          {user?.role !== 'EMPLOYEE' && (
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã nhân viên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={dateFrom}
              onChange={e => {
                setDateFrom(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="date"
              value={dateTo}
              onChange={e => {
                setDateTo(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedShiftId}
              onChange={e => {
                setSelectedShiftId(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả ca làm việc</option>
              {shifts.map(shift => (
                <option key={shift.id} value={shift.id}>{shift.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.key} value={filter.key}>{filter.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dạng quét
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ca làm việc
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí GPS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã nhân viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên nhân viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <ClockIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium">Không có dữ liệu</p>
                    <p className="text-sm mt-1">Chưa có bản ghi chấm công nào</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const statusConfig = STATUS_CONFIG[record.status]
                  const StatusIcon = statusConfig?.icon || CheckCircleIcon

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.time}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.scanType === 'Check in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.scanType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.shiftName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{record.gpsLocation}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.employeeCode}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.userName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.bgColor || 'bg-gray-100'} ${statusConfig?.color || 'text-gray-700'}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig?.label || record.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRecords.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredRecords.length)}
              </span>{' '}
              trong <span className="font-medium">{filteredRecords.length}</span> kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Check-in Modal */}
      <ManualCheckInModal
        isOpen={showManualCheckIn}
        onClose={() => setShowManualCheckIn(false)}
        onSuccess={handleManualCheckInSuccess}
        users={users}
        shifts={shifts}
      />
    </div>
  )
}
