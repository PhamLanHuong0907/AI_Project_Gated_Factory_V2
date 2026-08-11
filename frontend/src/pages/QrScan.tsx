import { useState, useEffect, useRef } from 'react'
import { Camera, MapPin, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useAuth } from '../services/auth-context'
import { api } from '../services/api'
import type { ShiftResponse, AttendanceResponse } from '../services/types'

export function QrScanPage() {
  const { user } = useAuth()
  const [shifts, setShifts] = useState<ShiftResponse[]>([])
  const [selectedShiftId, setSelectedShiftId] = useState<string>('')
  
  const [activeRecord, setActiveRecord] = useState<AttendanceResponse | null>(null)
  
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
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
      if (activeShifts.length > 0) {
        setSelectedShiftId(activeShifts[0].id)
      }

      // Check if user is currently checked in but not checked out
      const checkedInRecord = attendanceData.content.find((r: any) => r.checkInTime && !r.checkOutTime)
      setActiveRecord(checkedInRecord || null)

    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const startScanner = async () => {
    setError(null)
    setSuccess(null)
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

      // 2. Get GPS Location
      let coords = null
      try {
        coords = await getLocation()
        setLocation(coords)
      } catch (gpsErr: any) {
        throw new Error('Yêu cầu bật GPS để chấm công! ' + gpsErr.message)
      }

      // 3. Call API
      if (activeRecord) {
        // Check Out
        await api.attendance.checkOut(activeRecord.id, coords?.lat, coords?.lng)
        setSuccess('Check-out thành công!')
        setActiveRecord(null)
      } else {
        // Check In
        if (!selectedShiftId) {
          throw new Error('Vui lòng chọn ca làm việc')
        }
        const res = await api.attendance.checkIn({
          shiftId: selectedShiftId,
          date: new Date().toISOString().split('T')[0],
          checkInLat: coords.lat,
          checkInLng: coords.lng,
          qrToken: payload.nonce
        })
        setSuccess('Check-in thành công!')
        setActiveRecord(res)
      }

    } catch (err: any) {
      setError(err.message || 'Lỗi quét mã')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-md mx-auto">
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold text-gray-900">Quét mã QR Chấm công</h2>
        <p className="text-gray-500 mt-1">Sử dụng điện thoại để quét mã QR</p>
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="w-full bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Action Area */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {!activeRecord ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ca làm việc</label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={scanning || loading}
            >
              <option value="">-- Chọn ca làm việc --</option>
              {shifts.map((s: ShiftResponse) => (
                <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              <CheckCircle className="w-4 h-4" />
              Đang trong ca làm việc ({activeRecord.shiftName})
            </span>
          </div>
        )}

        <div className="w-full relative overflow-hidden rounded-lg mb-4 bg-gray-50 min-h-[250px]">
          <div id="qr-reader" className="w-full h-full"></div>
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
              disabled={loading || (!activeRecord && !selectedShiftId)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              {activeRecord ? 'Quét để Tan làm' : 'Quét để Vào làm'}
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              Hủy quét
            </button>
          )}
        </div>
      </div>
      
      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
          <MapPin className="w-4 h-4" />
          Vị trí: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      )}
    </div>
  )
}
