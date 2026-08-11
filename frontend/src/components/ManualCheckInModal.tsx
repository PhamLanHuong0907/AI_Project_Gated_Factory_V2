import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { api } from '../services/api'
import type { ShiftResponse } from '../services/types'

interface ManualCheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  users: any[]
  shifts: ShiftResponse[]
}

export function ManualCheckInModal({
  isOpen,
  onClose,
  onSuccess,
  users,
  shifts,
}: ManualCheckInModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedShiftId, setSelectedShiftId] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString('vi-VN', { hour12: false }).substring(0, 5))
  const [scanType, setScanType] = useState<string>('Check in')
  const [status, setStatus] = useState<string>('ON_TIME')
  const [calculatedLateMinutes, setCalculatedLateMinutes] = useState<number>(0)
  const [calculatedEarlyMinutes, setCalculatedEarlyMinutes] = useState<number>(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    api.config.attendance().then(res => setConfig(res)).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedShiftId && time && scanType && config) {
      const shift = shifts.find(s => s.id === selectedShiftId)
      if (shift) {
        // Parse shift times
        const [sHour, sMin] = shift.startTime.split(':').map(Number)
        const [eHour, eMin] = shift.endTime.split(':').map(Number)
        const shiftStartMins = sHour * 60 + sMin
        const shiftEndMins = eHour * 60 + eMin
        
        // Parse selected time
        const [tHour, tMin] = time.split(':').map(Number)
        const currentMins = tHour * 60 + tMin

        if (scanType === 'Check in') {
          const threshold = config.lateThresholdMinutes || 0
          if (currentMins > shiftStartMins + threshold) {
            setStatus('LATE')
            setCalculatedLateMinutes(currentMins - shiftStartMins)
            setCalculatedEarlyMinutes(0)
          } else {
            setStatus('ON_TIME')
            setCalculatedLateMinutes(0)
            setCalculatedEarlyMinutes(0)
          }
        } else if (scanType === 'Check out') {
          const threshold = config.earlyLeaveMinutes || 0
          if (currentMins < shiftEndMins - threshold) {
            setStatus('EARLY_LEAVE')
            setCalculatedEarlyMinutes(shiftEndMins - currentMins)
            setCalculatedLateMinutes(0)
          } else {
            setStatus('ON_TIME')
            setCalculatedEarlyMinutes(0)
            setCalculatedLateMinutes(0)
          }
        }
      }
    }
  }, [time, selectedShiftId, scanType, shifts, config])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !date) {
      setError('Vui lòng chọn nhân viên và ngày')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await api.attendance.manualCreate({
        userId: selectedUserId,
        shiftId: selectedShiftId || undefined,
        date: date,
        checkInTime: scanType === 'Check in' ? time : undefined,
        checkOutTime: scanType === 'Check out' ? time : undefined,
        status: status as any,
        lateMinutes: calculatedLateMinutes,
        earlyMinutes: calculatedEarlyMinutes,
        note: 'Chấm công thủ công (Admin)'
      })
      setSelectedUserId('')
      setSelectedShiftId('')
      setDate(new Date().toISOString().split('T')[0])
      setTime(new Date().toLocaleTimeString('vi-VN', { hour12: false }).substring(0, 5))
      setScanType('Check in')
      setStatus('ON_TIME')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể chấm công')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Chấm công thủ công
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhân viên
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Chọn nhân viên</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.employeeCode || `EMP${String(user.id).padStart(3, '0')}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian
                  </label>
                  <input
                    type="time"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dạng quét
                  </label>
                  <select
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Check in">Check in</option>
                    <option value="Check out">Check out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ca làm việc
                  </label>
                  <select
                    value={selectedShiftId}
                    onChange={(e) => setSelectedShiftId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">(Không chọn)</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="ON_TIME">Đúng giờ</option>
                    <option value="LATE">Đi trễ</option>
                    <option value="EARLY_LEAVE">Về sớm</option>
                    <option value="ABSENT">Vắng mặt</option>
                    <option value="ON_LEAVE">Nghỉ phép</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí GPS
                  </label>
                  <input
                    type="text"
                    value="Văn phòng công ty"
                    disabled
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedUserId || !date}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Chấm công'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
