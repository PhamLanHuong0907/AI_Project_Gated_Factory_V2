import { useState, useEffect, useRef } from 'react'
import { Camera, MapPin, CheckCircle, XCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useAuth } from '../services/auth-context'
import { api } from '../services/api'
import type { ShiftResponse, AttendanceResponse } from '../services/types'

export function QrScanPage() {
  const { user } = useAuth()
  const [shifts, setShifts] = useState<ShiftResponse[]>([])
  const [selectedShiftId, setSelectedShiftId] = useState<string>('')
  
  const [completedShifts, setCompletedShifts] = useState<string[]>([])
  const [activeRecord, setActiveRecord] = useState<AttendanceResponse | null>(null)
  const [scanMode, setScanMode] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN')
  
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    loadInitialData()
    // Ensure scanner is stopped on unmount
    return () => {
      stopScanner()
    }
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [shiftsData, attendanceData] = await Promise.all([
        api.shifts.getAll(),
        api.attendance.getAll({
          userId: user?.id,
          dateFrom: new Date().toISOString().split('T')[0],
          dateTo: new Date().toISOString().split('T')[0]
        })
      ])
      
      const activeShifts = shiftsData.filter((s: ShiftResponse) => s.active)
      setShifts(activeShifts)
      
      const checkedInShifts = attendanceData.content.map((r: any) => r.shiftId)
      setCompletedShifts(checkedInShifts)

      const availableShifts = activeShifts.filter((s: ShiftResponse) => !checkedInShifts.includes(s.id))
      if (availableShifts.length > 0) {
        setSelectedShiftId(availableShifts[0].id)
      } else if (activeShifts.length > 0) {
        setSelectedShiftId(activeShifts[0].id)
      }

      // Check if user is currently checked in but not checked out
      const checkedInRecord = attendanceData.content.find((r: any) => r.checkInTime && !r.checkOutTime)
      if (checkedInRecord) {
        setActiveRecord(checkedInRecord)
        setScanMode('CHECK_OUT')
      } else {
        setActiveRecord(null)
        setScanMode('CHECK_IN')
      }

    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt không hỗ trợ định vị GPS'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          reject(new Error('Không thể lấy vị trí GPS: ' + err.message))
        }
      )
    })
  }

  const handleGetLocation = async () => {
    try {
      setGpsLoading(true)
      setError(null)
      const coords = await getLocation()
      setLocation(coords)
    } catch (err: any) {
      setError(err.message || 'Không thể lấy vị trí GPS')
    } finally {
      setGpsLoading(false)
    }
  }

  const startScanner = async () => {
    setError(null)
    setSuccess(null)
    
    if (!location) {
      setError('Vui lòng Bật GPS và lấy vị trí hiện tại trước khi quét mã!')
      return
    }
    
    if (scanMode === 'CHECK_OUT' && !activeRecord) {
      setError('Bạn chưa có lượt Check-in nào đang hoạt động, không thể Check-out!')
      return
    }

    setScanning(true)
    try {
      const devices = await Html5Qrcode.getCameras()
      if (!devices || devices.length === 0) {
        throw new Error('Không tìm thấy camera nào trên thiết bị')
      }

      // Ưu tiên camera sau nếu có (dựa vào label)
      let selectedCameraId = devices[0].id
      for (const device of devices) {
        if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('sau')) {
          selectedCameraId = device.id
          break
        }
      }

      scannerRef.current = new Html5Qrcode('qr-reader')
      await scannerRef.current.start(
        selectedCameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {} // ignore scan failures
      )
    } catch (err: any) {
      setError('Không thể mở camera: ' + (typeof err === 'string' ? err : err?.message || 'Lỗi không xác định'))
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch(() => {})
      } catch (e) {}
    }
    setScanning(false)
  }

  const handleScanSuccess = async (decodedText: string) => {
    stopScanner()
    setLoading(true)
    setError(null)

    try {
      // 1. Validate QR Code
      const payload = JSON.parse(decodedText)
      if (payload.type !== 'ATTENDANCE_CHECKIN') {
        throw new Error('Mã QR không hợp lệ')
      }
      if (Date.now() > payload.expiresAt) {
        throw new Error('Mã QR đã hết hạn')
      }

      // 2. We already validated GPS before scanning
      if (!location) {
        throw new Error('Không có thông tin GPS!')
      }

      // 3. Call API
      if (scanMode === 'CHECK_OUT') {
        if (!activeRecord) throw new Error('Không có lượt Check-in để Check-out')
        await api.attendance.checkOut(activeRecord.id, location.lat, location.lng)
        setSuccess('Check-out thành công!')
        setActiveRecord(null)
        setScanMode('CHECK_IN')
      } else {
        // Check In
        if (!selectedShiftId) {
          throw new Error('Vui lòng chọn ca làm việc')
        }
        const res = await api.attendance.checkIn({
          shiftId: selectedShiftId,
          date: new Date().toISOString().split('T')[0],
          checkInLat: location.lat,
          checkInLng: location.lng,
          qrToken: payload.nonce
        })
        setSuccess('Check-in thành công!')
        setActiveRecord(res)
        setScanMode('CHECK_OUT')
      }

    } catch (err: any) {
      setError(err.message || 'Lỗi quét mã')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-md mx-auto pb-24">
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold text-gray-900">Quét mã QR Chấm công</h2>
        <p className="text-gray-500 mt-1">Sử dụng điện thoại để quét mã QR</p>
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 shadow-sm border border-red-100">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="w-full bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3 shadow-sm border border-green-100">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}
      
      {/* Tab Selectors */}
      <div className="w-full bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            scanMode === 'CHECK_IN' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setScanMode('CHECK_IN')}
          disabled={scanning || loading}
        >
          Check-in (Vào làm)
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            scanMode === 'CHECK_OUT' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setScanMode('CHECK_OUT')}
          disabled={scanning || loading}
        >
          Check-out (Tan làm)
        </button>
      </div>

      {/* Action Area */}
      <div className="w-full bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        
        {/* GPS Location Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí hiện tại</label>
          {!location ? (
            <button
              onClick={handleGetLocation}
              disabled={gpsLoading || scanning}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 w-full border border-blue-200"
            >
              {gpsLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              {gpsLoading ? 'Đang lấy vị trí GPS...' : 'Bật GPS & Lấy vị trí'}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="w-full flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="truncate">Đã lấy vị trí: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
                <button onClick={handleGetLocation} disabled={gpsLoading || scanning} className="text-green-700 hover:text-green-900 flex-shrink-0" title="Cập nhật lại vị trí">
                  <RefreshCw className={`w-5 h-5 ${gpsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {scanMode === 'CHECK_IN' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ca làm việc</label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={scanning || loading}
            >
              <option value="">-- Chọn ca làm việc --</option>
              {shifts.map((s: ShiftResponse) => {
                const alreadyCheckedIn = completedShifts.includes(s.id)
                return (
                  <option key={s.id} value={s.id} disabled={alreadyCheckedIn}>
                    {s.name} ({s.startTime} - {s.endTime}) {alreadyCheckedIn ? '(Đã hoàn thành)' : ''}
                  </option>
                )
              })}
            </select>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin ca làm việc</label>
            {activeRecord ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 w-full">
                <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                Đang trong ca: {activeRecord.shiftName}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 w-full text-left">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
                Bạn chưa có lượt Check-in hôm nay
              </div>
            )}
          </div>
        )}

        <div className="w-full relative overflow-hidden rounded-lg mb-6 bg-gray-50 min-h-[250px] border border-gray-200">
          <div id="qr-reader" className="w-full h-full min-h-[250px]"></div>
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gray-50 z-10">
              <Camera className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!scanning ? (
            <button
              onClick={startScanner}
              disabled={loading || !location || (scanMode === 'CHECK_IN' && !selectedShiftId) || (scanMode === 'CHECK_OUT' && !activeRecord)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full justify-center shadow-sm"
            >
              <Camera className="w-5 h-5" />
              {scanMode === 'CHECK_IN' ? 'Quét QR để Vào làm' : 'Quét QR để Tan làm'}
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors w-full justify-center shadow-sm"
            >
              <XCircle className="w-5 h-5" />
              Hủy quét
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
