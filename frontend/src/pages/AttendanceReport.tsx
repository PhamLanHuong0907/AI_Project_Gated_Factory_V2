import React, { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon, 
  ArrowPathIcon,
  DocumentArrowDownIcon 
} from '@heroicons/react/24/outline'
import { api } from '../services/api'
import { useAuth } from '../services/auth-context'

interface ReportUser {
  id: string
  fullName: string
  employeeCode?: string
  role: string
}

interface ReportShift {
  id: string
  name: string
  startTime: string
  endTime: string
}

export function AttendanceReportPage() {
  const { user } = useAuth()
  const todayStr = new Date().toISOString().split('T')[0]
  
  const [dateFrom, setDateFrom] = useState(todayStr)
  const [dateTo, setDateTo] = useState(todayStr)
  const [activeTab, setActiveTab] = useState<'present' | 'absent' | 'leave'>('present')
  
  const { loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [users, setUsers] = useState<ReportUser[]>([])
  const [shifts, setShifts] = useState<ReportShift[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [usersData, shiftsData] = await Promise.all([
        api.users.getAll(),
        api.shifts.getAll(),
      ])

      let allAtt: any[] = []
      let attPage = 0
      const attSize = 200
      while (true) {
        const attRes = await api.attendance.getAll({
          page: attPage,
          size: attSize,
          dateFrom,
          dateTo,
        })
        allAtt = allAtt.concat(attRes.content)
        if (!attRes.totalPages || attPage >= attRes.totalPages - 1 || attRes.content.length < attSize) break
        attPage++
      }

      let allLeaves: any[] = []
      let leavePage = 0
      const leaveSize = 200
      while (true) {
        const leaveRes = await api.leaveRequests.getAll(leavePage, leaveSize)
        allLeaves = allLeaves.concat(leaveRes.content)
        if (!leaveRes.totalPages || leavePage >= leaveRes.totalPages - 1 || leaveRes.content.length < leaveSize) break
        leavePage++
      }

      let filteredUsers = usersData.filter((u: any) => u.isActive)
      if (user?.role === 'EMPLOYEE') {
        filteredUsers = filteredUsers.filter((u: any) => u.id === user.id)
      }
      setUsers(filteredUsers)
      
      let filteredAtt = allAtt
      if (user?.role === 'EMPLOYEE') {
        filteredAtt = filteredAtt.filter((a: any) => a.userId === user.id)
      }
      setAttendance(filteredAtt)
      
      let filteredLeaves = allLeaves
      if (user?.role === 'EMPLOYEE') {
        filteredLeaves = filteredLeaves.filter((l: any) => l.userId === user.id)
      }
      setLeaveRequests(filteredLeaves)
      setShifts(shiftsData)
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu báo cáo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadData()
    }
  }, [dateFrom, dateTo, authLoading, user])

  // Process data based on date range
  const generateDates = () => {
    const dates = []
    const start = new Date(dateFrom)
    const end = new Date(dateTo)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const dateList = generateDates()

  // Build the Report Data
  const presentData: any[] = []
  const absentData: any[] = []
  const leaveData: any[] = []

  const getAttendanceStatusStr = (att: any) => {
    if (!att.checkInTime) return 'Vắng mặt'
    let checkInStr = 'Check-in: ' + ((!att.lateMinutes || att.lateMinutes === 0) ? 'Đúng giờ' : 'Đi trễ')
    
    if (att.checkOutTime) {
      let checkOutStr = 'Check-out: ' + ((!att.earlyMinutes || att.earlyMinutes === 0) ? 'Đúng giờ' : 'Về sớm')
      return `${checkInStr}, ${checkOutStr}`
    }
    return checkInStr
  }

  dateList.forEach(date => {
    users.forEach(u => {
      // Find attendances for this user on this date
      const userAtts = attendance.filter(a => a.userId === u.id && a.date === date)
      // Find approved leave requests for this user on this date
      const userLeaves = leaveRequests.filter(l => 
        l.userId === u.id && 
        l.status === 'APPROVED' &&
        l.startDate <= date && 
        l.endDate >= date
      )

      const isPresent = userAtts.length > 0 && userAtts.some(a => a.checkInTime)
      const isOnLeave = userLeaves.length > 0

      if (isPresent) {
        // Calculate shifts attended
        let attendedCount = 0
        const shiftDetails: Record<string, string> = {}
        
        shifts.forEach(shift => {
          const shiftAtt = userAtts.find(a => a.shiftId === shift.id)
          if (shiftAtt && shiftAtt.checkInTime) {
            attendedCount++
            shiftDetails[shift.id] = getAttendanceStatusStr(shiftAtt)
          } else {
            shiftDetails[shift.id] = 'Vắng mặt'
          }
        })

        // Check for records without a matching shift
        const otherAtts = userAtts.filter(a => !shifts.some(s => s.id === a.shiftId))
        let otherShiftStr = ''
        if (otherAtts.length > 0) {
          otherShiftStr = otherAtts.map(a => getAttendanceStatusStr(a)).join(' | ')
        }

        presentData.push({
          date,
          user: u,
          attendedCount,
          totalShifts: shifts.length,
          shiftDetails,
          otherShiftStr
        })
      } else if (isOnLeave) {
        leaveData.push({
          date,
          user: u,
          reason: userLeaves[0].reason
        })
      } else {
        absentData.push({
          date,
          user: u
        })
      }
    })
  })

  const exportCSV = () => {
    // Generate CSV based on active tab
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // BOM for UTF-8
    
    if (activeTab === 'present') {
      const headers = ['Ngày', 'Mã nhân viên', 'Tên nhân viên', 'Số ca làm việc']
      shifts.forEach(s => headers.push(`Ca ${s.name}`))
      headers.push('Ca khác')
      csvContent += headers.join(',') + '\n'
      
      presentData.forEach(row => {
        const rowData = [
          row.date,
          row.user.employeeCode,
          `"${row.user.fullName}"`,
          `Đi làm đủ ${row.attendedCount}/${row.totalShifts} ca làm việc`
        ]
        shifts.forEach(s => {
          rowData.push(`"${row.shiftDetails[s.id]}"`)
        })
        rowData.push(`"${row.otherShiftStr}"`)
        csvContent += rowData.join(',') + '\n'
      })
    } else if (activeTab === 'absent') {
      csvContent += 'Ngày,Mã nhân viên,Tên nhân viên\n'
      absentData.forEach(row => {
        csvContent += `${row.date},${row.user.employeeCode},"${row.user.fullName}"\n`
      })
    } else if (activeTab === 'leave') {
      csvContent += 'Ngày,Mã nhân viên,Tên nhân viên,Lý do\n'
      leaveData.forEach(row => {
        csvContent += `${row.date},${row.user.employeeCode},"${row.user.fullName}","${row.reason}"\n`
      })
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `bao_cao_${activeTab}_${dateFrom}_${dateTo}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo chấm công</h1>
          <p className="text-gray-600 mt-1">Tổng hợp dữ liệu chấm công theo thời gian thực</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            <input 
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('present')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'present' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đi làm ({presentData.length})
            </button>
            <button
              onClick={() => setActiveTab('absent')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'absent' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Vắng mặt ({absentData.length})
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'leave' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Nghỉ có lý do ({leaveData.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {activeTab === 'present' && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã NV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nhân viên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số ca làm việc</th>
                    {shifts.map(s => (
                      <th key={s.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ca {s.name}</th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ca khác</th>
                  </tr>
                )}
                {activeTab === 'absent' && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã NV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nhân viên</th>
                  </tr>
                )}
                {activeTab === 'leave' && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã NV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nhân viên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'present' && presentData.length === 0 && (
                  <tr><td colSpan={5 + shifts.length} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                )}
                {activeTab === 'present' && presentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{new Date(row.date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row.user.employeeCode}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{row.user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">Đi làm đủ {row.attendedCount}/{row.totalShifts} ca</td>
                    {shifts.map(s => (
                      <td key={s.id} className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{row.shiftDetails[s.id]}</td>
                    ))}
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{row.otherShiftStr || '-'}</td>
                  </tr>
                ))}

                {activeTab === 'absent' && absentData.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                )}
                {activeTab === 'absent' && absentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{new Date(row.date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row.user.employeeCode}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{row.user.fullName}</td>
                  </tr>
                ))}

                {activeTab === 'leave' && leaveData.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                )}
                {activeTab === 'leave' && leaveData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{new Date(row.date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row.user.employeeCode}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{row.user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
