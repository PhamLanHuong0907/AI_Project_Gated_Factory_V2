import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * SCR-03 — Tạo mã QR chấm công
 *
 * Generates a time-limited QR code for attendance check-in.
 * QR contains a signed token with timestamp, valid for 5 minutes.
 * Employees scan this QR to check in/out.
 */

function generateQrPayload(): string {
  const now = Date.now()
  const expiresAt = now + 5 * 60 * 1000 // 5 minutes
  const nonce = Math.random().toString(36).substring(2, 10)
  // In production, this would be a signed JWT from the backend
  return JSON.stringify({
    type: 'ATTENDANCE_CHECKIN',
    nonce,
    issuedAt: now,
    expiresAt,
    serverTime: new Date().toISOString(),
  })
}

export function QrCodePage() {
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [qrPayload, setQrPayload] = useState(generateQrPayload)

  const refreshQr = useCallback(() => {
    setQrPayload(generateQrPayload())
    setCountdown(300)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      // Auto-refresh when expired
      refreshQr()
      return
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown, refreshQr])

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg') as SVGElement | null
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = `qr-cham-cong-${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col items-center gap-lg py-xl">
      {/* QR Code Card */}
      <div className="card flex flex-col items-center p-xl">
        <h2 className="text-headline-xl font-semibold text-neutral-text-primary mb-lg">
          Mã QR Chấm công
        </h2>

        {/* QR Code Display */}
        <div className="flex h-[280px] w-[280px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-border bg-white">
          <QRCodeSVG
            id="qr-code-svg"
            value={qrPayload}
            size={240}
            level="H"
            bgColor="#ffffff"
            fgColor="#1e293b"
            includeMargin={false}
          />
        </div>

        {/* Status */}
        <div className="mt-md flex items-center gap-sm">
          <span className={`h-2 w-2 rounded-full ${countdown > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-body-xs text-neutral-text-muted">
            {countdown > 0 ? 'Mã QR còn hiệu lực' : 'Mã QR đã hết hạn'}
          </span>
        </div>

        {/* Countdown */}
        <div className="mt-lg flex items-center gap-md">
          <div className={`text-headline-3xl font-bold ${countdown > 60 ? 'text-primary' : countdown > 0 ? 'text-orange-500' : 'text-red-500'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <span className="text-body-sm text-neutral-text-muted">
            Thời gian còn lại
          </span>
        </div>

        {/* Actions */}
        <div className="mt-lg flex gap-md">
          <button
            onClick={refreshQr}
            className="flex items-center gap-sm rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark"
          >
            <Download size={16} />
            Tải xuống
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card w-full max-w-md p-md">
        <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-sm">
          Hướng dẫn
        </h3>
        <ol className="space-y-sm text-body-sm text-neutral-text-secondary">
          <li>1. Hiển thị mã QR này cho nhân viên</li>
          <li>2. Nhân viên quét mã bằng ứng dụng trên điện thoại</li>
          <li>3. Hệ thống tự động ghi nhận giờ chấm công</li>
          <li>4. Mã QR hết hạn sau 5 phút — nhấn Làm mới để tạo mã mới</li>
        </ol>
      </div>
    </div>
  )
}
