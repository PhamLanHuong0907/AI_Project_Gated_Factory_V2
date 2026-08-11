// @ts-nocheck
import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, Power, Clock, X, Save, Loader2, Play, Pause } from 'lucide-react'
import { api } from '../services/api'

/**
 * SCR-06 — Quản lý Ca làm việc
 * Full CRUD + Real-time status based on current time
 */

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  isActive: boolean
}

function getShiftStatus(startTime: string, endTime: string, isActive: boolean): { label: string; color: string; icon: typeof Clock } {
  if (!isActive) return { label: 'Tạm dừng', color: 'text-neutral-text-muted', icon: Pause }

  const now = new Date()
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = sh * 60 + sm
  const endMinutes = eh * 60 + em

  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
    return { label: 'Đang diễn ra', color: 'text-green-600', icon: Play }
  } else if (nowMinutes < startMinutes) {
    return { label: 'Chưa bắt đầu', color: 'text-blue-500', icon: Clock }
  } else {
    return { label: 'Đã kết thúc', color: 'text-neutral-text-muted', icon: Clock }
  }
}

const EMPTY_FORM = { name: '', startTime: '07:00', endTime: '12:00' }

export function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  // Update current time every minute for real-time status
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  const loadShifts = async () => {
    try {
      setLoading(true)
      const data = await api.shifts.getAll()
      setShifts(data)
    } catch (err: any) {
      alert(err.message || 'Không thể tải danh sách ca làm việc')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadShifts() }, [])

  const openAdd = () => { setEditingShift(null); setForm(EMPTY_FORM); setShowForm(true) }
  const openEdit = (shift: Shift) => {
    setEditingShift(shift)
    setForm({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editingShift) {
        await api.shifts.update(editingShift.id, form)
      } else {
        await api.shifts.create(form)
      }
      setShowForm(false)
      loadShifts()
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (shift: Shift) => {
    try {
      await api.shifts.toggleActive(shift.id)
      loadShifts()
    } catch {
      // Optimistic update
      setShifts((prev) => prev.map((s) => s.id === shift.id ? { ...s, isActive: !s.isActive } : s))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.shifts.delete(id)
      setShowDeleteConfirm(null)
      loadShifts()
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa')
    }
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-xl font-semibold text-neutral-text-primary">
          Quản lý Ca làm việc
        </h2>
        <button onClick={openAdd} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark">
          <Plus size={16} /> Thêm ca mới
        </button>
      </div>

      {/* Shifts Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-xl">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>TÊN CA</th>
                <th>GIỜ BẮT ĐẦU</th>
                <th>GIỜ KẾT THÚC</th>
                <th>TRẠNG THÁI THỜI GIAN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => {
                const timeStatus = getShiftStatus(shift.startTime, shift.endTime, shift.isActive)
                const TimeIcon = timeStatus.icon
                return (
                  <tr key={shift.id}>
                    <td className="font-medium text-neutral-text-primary">{shift.name}</td>
                    <td>
                      <div className="flex items-center gap-sm text-neutral-text-secondary">
                        <Clock size={14} /> {shift.startTime}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-sm text-neutral-text-secondary">
                        <Clock size={14} /> {shift.endTime}
                      </div>
                    </td>
                    <td>
                      <div className={`flex items-center gap-sm ${timeStatus.color}`}>
                        <TimeIcon size={14} />
                        <span className="text-body-sm font-medium">{timeStatus.label}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-status ${shift.isActive ? 'badge-on-time' : 'badge-absent'}`}>
                        {shift.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button onClick={() => openEdit(shift)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface hover:text-primary" title="Sửa">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleToggle(shift)} className={`rounded p-1 text-neutral-text-muted hover:bg-neutral-surface ${shift.isActive ? 'hover:text-warning' : 'hover:text-green-600'}`} title={shift.isActive ? 'Tạm dừng' : 'Kích hoạt'}>
                          <Power size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(shift.id)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface hover:text-error" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md p-lg">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-lg font-semibold text-neutral-text-primary">
                {editingShift ? 'Sửa ca làm việc' : 'Thêm ca mới'}
              </h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface"><X size={20} /></button>
            </div>
            <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Tên ca *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="VD: Ca tối"
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Giờ bắt đầu *</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Giờ kết thúc *</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface">Hủy</button>
                <button type="submit" disabled={saving} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingShift ? 'Cập nhật' : 'Tạo ca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-sm p-lg">
            <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">Xác nhận xóa</h3>
            <p className="text-body-sm text-neutral-text-secondary mb-lg">Bạn có chắc chắn muốn xóa ca làm việc này?</p>
            <div className="flex justify-end gap-sm">
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface">Hủy</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex items-center gap-sm rounded bg-error px-md py-sm text-body-sm font-medium text-white hover:bg-error-dark">
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
