// @ts-nocheck
import { useState, useEffect } from 'react'
import { MapPin, QrCode, Clock, Save, Loader2, CheckCircle } from 'lucide-react'
import { api } from '../services/api'

/**
 * SCR-10 — Cài đặt hệ thống
 * Full CRUD for GPS, QR, Attendance config with save functionality
 */

type SettingsTab = 'gps' | 'qr' | 'attendance'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('gps')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const tabs: { key: SettingsTab; label: string; icon: typeof MapPin }[] = [
    { key: 'gps', label: 'GPS', icon: MapPin },
    { key: 'qr', label: 'Mã QR', icon: QrCode },
    { key: 'attendance', label: 'Chấm công', icon: Clock },
  ]

  return (
    <div className="space-y-lg">
      <h2 className="text-headline-xl font-semibold text-neutral-text-primary">
        Cài đặt hệ thống
      </h2>

      {/* Tabs */}
      <div className="flex gap-sm border-b border-neutral-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-sm border-b-2 px-md py-sm text-body-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-text-muted hover:text-neutral-text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="card p-lg">
        {activeTab === 'gps' && <GpsSettings />}
        {activeTab === 'qr' && <QrSettings />}
        {activeTab === 'attendance' && <AttendanceSettings />}
      </div>
    </div>
  )
}

// ─── GPS Settings ────────────────────────────────────────────
function GpsSettings() {
  const [form, setForm] = useState({ latitude: '10.762622', longitude: '106.660172', radius: '100', locationName: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.config.gps()
        setForm({
          latitude: String(data.latitude ?? 10.762622),
          longitude: String(data.longitude ?? 106.660172),
          radius: String(data.radius ?? 100),
          locationName: data.address ?? '',
        })
      } catch (e) { console.warn('Using default config:', e) } finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.config.updateGps({
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius: Number(form.radius),
        address: form.locationName,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  const handleMapLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Tìm mẫu @lat,lng (URL dài)
    const atMatch = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (atMatch) {
      setForm(f => ({ ...f, latitude: atMatch[1], longitude: atMatch[2] }))
      return
    }
    // Tìm mẫu lat, lng (copy trực tiếp tọa độ)
    const coordMatch = val.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/)
    if (coordMatch) {
      setForm(f => ({ ...f, latitude: coordMatch[1], longitude: coordMatch[2] }))
      return
    }
  }

  return (
    <div className="space-y-md">
      <h3 className="text-headline-lg font-semibold text-neutral-text-primary">Cài đặt GPS</h3>
      <p className="text-body-sm text-neutral-text-muted">Xác định vị trí chấm công của nhân viên. Chỉ nhân viên trong bán kính này mới có thể check-in.</p>
      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <label className="text-label-xs font-medium text-neutral-text-secondary">Link Google Map hoặc Tọa độ (Tự động trích xuất)</label>
          <input type="text" onChange={handleMapLinkChange} placeholder="VD: https://www.google.com/maps/@10.762622,106.660172,15z hoặc 10.762, 106.660"
            className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
          <p className="text-xs text-gray-500 mt-1">Dán link từ thanh địa chỉ trình duyệt có chứa @vĩđộ,kinhđộ hoặc dán trực tiếp tọa độ.</p>
        </div>
        <div className="space-y-1">
          <label className="text-label-xs font-medium text-neutral-text-secondary">Vĩ độ (Latitude) *</label>
          <input type="number" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} step="0.0000001"
            className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-label-xs font-medium text-neutral-text-secondary">Kinh độ (Longitude) *</label>
          <input type="number" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} step="0.0000001"
            className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-label-xs font-medium text-neutral-text-secondary">Bán kính (mét) *</label>
          <input type="number" value={form.radius} onChange={(e) => setForm({ ...form, radius: e.target.value })} min="10" max="1000"
            className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-label-xs font-medium text-neutral-text-secondary">Địa chỉ</label>
          <input type="text" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} placeholder="VD: Tầng 10, Tòa ABC"
            className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

// ─── QR Settings ─────────────────────────────────────────────
function QrSettings() {
  const [expiryMinutes, setExpiryMinutes] = useState('5')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.config.qr()
        setExpiryMinutes(String(data.expiryMinutes ?? 5))
      } catch (e) { console.warn('Using default config:', e) } finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.config.updateQr({ expiryMinutes: Number(expiryMinutes), refreshIntervalMinutes: 5 })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-md">
      <h3 className="text-headline-lg font-semibold text-neutral-text-primary">Cài đặt Mã QR</h3>
      <div className="space-y-1">
        <label className="text-label-xs font-medium text-neutral-text-secondary">Thời gian hết hạn (phút) *</label>
        <input type="number" value={expiryMinutes} onChange={(e) => setExpiryMinutes(e.target.value)} min="1" max="30"
          className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        <p className="text-label-xs text-neutral-text-muted">Mã QR sẽ tự động hết hạn sau khoảng thời gian này. Khuyến nghị: 5 phút.</p>
      </div>
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

// ─── Attendance Settings ─────────────────────────────────────
function AttendanceSettings() {
  const [lateThreshold, setLateThreshold] = useState('15')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.config.attendance()
        setLateThreshold(String(data.lateThresholdMinutes ?? 15))
      } catch (e) { console.warn('Using default config:', e) } finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.config.updateAttendance({ lateThresholdMinutes: Number(lateThreshold) })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-md">
      <h3 className="text-headline-lg font-semibold text-neutral-text-primary">Cài đặt Chấm công</h3>
      <div className="space-y-1">
        <label className="text-label-xs font-medium text-neutral-text-secondary">Ngưỡng đi trễ (phút) *</label>
        <input type="number" value={lateThreshold} onChange={(e) => setLateThreshold(e.target.value)} min="1" max="60"
          className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
        <p className="text-label-xs text-neutral-text-muted">Nhân viên đến sau giờ bắt đầu ca làm việc quá thời gian này sẽ bị đánh dấu "Đi trễ".</p>
      </div>
      <SaveButton saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

// ─── Shared Save Button ──────────────────────────────────────
function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <div className="mt-lg flex justify-end">
      <button onClick={onClick} disabled={saving}
        className={`flex items-center gap-sm rounded px-md py-sm text-body-sm font-medium text-white transition-colors ${
          saved ? 'bg-green-600' : 'bg-primary hover:bg-primary-dark'
        } disabled:opacity-50`}>
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
      </button>
    </div>
  )
}
