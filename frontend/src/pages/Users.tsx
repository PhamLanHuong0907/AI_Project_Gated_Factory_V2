// @ts-nocheck
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react'
import { Avatar } from '../components'
import { api } from '../services/api'

/**
 * SCR-09 — Quản lý Nhân sự
 * Full CRUD: List, Search, Add, Edit, Delete with API integration
 */

interface UserRecord {
  id: string
  employeeCode: string
  fullName: string
  email: string
  role: string
  phoneNumber: string | null
  department: string | null
  positionId: string | null
  initialExperienceYears: number
  isActive: boolean
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  HR_MANAGER: 'Quản lý HR',
  EMPLOYEE: 'Nhân viên',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-error-light text-error',
  HR_MANAGER: 'bg-warning-light text-warning',
  EMPLOYEE: 'bg-primary-container text-primary',
}

const EMPTY_FORM = {
  employeeCode: '',
  fullName: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
  phoneNumber: '',
  department: '',
  positionId: '',
  initialExperienceYears: 0,
  isActive: true,
}

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [positions, setPositions] = useState<{ id: string; name: string }[]>([])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await api.users.getAll()
      setUsers(data as UserRecord[])
    } catch (err) {
      console.error('Failed to load users:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const loadPositions = async () => {
    try {
      const data = await api.salary.positions()
      setPositions(data)
    } catch (err) {
      console.error('Failed to load positions', err)
    }
  }

  useEffect(() => { loadUsers(); loadPositions() }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (user: UserRecord) => {
    setEditingUser(user)
    setForm({
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      department: user.department || '',
      positionId: user.positionId || '',
      initialExperienceYears: user.initialExperienceYears || 0,
      isActive: user.isActive,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editingUser) {
        await api.users.update(editingUser.id, {
          employeeCode: form.employeeCode,
          fullName: form.fullName,
          phoneNumber: form.phoneNumber || undefined,
          department: form.department || undefined,
          positionId: form.positionId || undefined,
          initialExperienceYears: Number(form.initialExperienceYears) || 0,
          isActive: form.isActive,
        })
      } else {
        await api.users.create({
          employeeCode: form.employeeCode,
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
          phoneNumber: form.phoneNumber || undefined,
          department: form.department || undefined,
          positionId: form.positionId || undefined,
          initialExperienceYears: Number(form.initialExperienceYears) || 0,
          isActive: form.isActive,
        })
      }
      setShowForm(false)
      loadUsers()
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.users.delete(id)
      setShowDeleteConfirm(null)
      loadUsers()
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa')
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-xl font-semibold text-neutral-text-primary">
          Quản lý Nhân sự
        </h2>
        <button onClick={openAdd} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark">
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      {/* Search */}
      <div className="card p-md">
        <input
          type="text"
          placeholder="Tìm theo tên, mã NV hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-xl">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="ml-sm text-body-sm text-neutral-text-muted">Đang tải...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>NHÂN VIÊN</th>
                <th>MÃ NV</th>
                <th>PHÒNG BAN</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <Avatar name={user.fullName} size="sm" />
                      <div>
                        <div className="font-medium text-neutral-text-primary">{user.fullName}</div>
                        <div className="text-label-xs text-neutral-text-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-neutral-text-secondary">{user.employeeCode}</td>
                  <td className="text-neutral-text-secondary">{user.department || '—'}</td>
                  <td>
                    <span className={`badge-status ${ROLE_COLORS[user.role] || ''}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${user.isActive ? 'badge-on-time' : 'badge-absent'}`}>
                      {user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-sm">
                      <button onClick={() => openEdit(user)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface hover:text-primary">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(user.id)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface hover:text-error">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-lg text-neutral-text-muted">
                    Không tìm thấy nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-lg p-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-lg font-semibold text-neutral-text-primary">
                {editingUser ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
              </h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Mã nhân viên *</label>
                <input type="text" value={form.employeeCode} onChange={(e) => updateField('employeeCode', e.target.value)} required placeholder="VD: EMP004"
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Họ và tên *</label>
                <input type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required placeholder="VD: Nguyễn Văn A"
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Email *</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required placeholder="VD: user@pas.vn" disabled={!!editingUser}
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-neutral-surface" />
              </div>
              {!editingUser && (
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Mật khẩu *</label>
                  <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required placeholder="Ít nhất 6 ký tự"
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Vai trò *</label>
                  <select value={form.role} onChange={(e) => updateField('role', e.target.value)}
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="EMPLOYEE">Nhân viên</option>
                    <option value="HR_MANAGER">Quản lý HR</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Số điện thoại</label>
                  <input type="tel" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} placeholder="VD: 0901234567"
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Phòng ban</label>
                  <input type="text" value={form.department} onChange={(e) => updateField('department', e.target.value)} placeholder="VD: Kỹ thuật"
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Chức vụ (Lương vị trí)</label>
                  <select value={form.positionId} onChange={(e) => updateField('positionId', e.target.value)}
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">-- Chọn chức vụ --</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Số năm kinh nghiệm ban đầu</label>
                  <input type="number" step="0.1" value={form.initialExperienceYears} onChange={(e) => updateField('initialExperienceYears', e.target.value)} placeholder="VD: 2.5"
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <p className="text-xs text-neutral-text-muted mt-1">Sẽ dùng để xác định mức lương kinh nghiệm</p>
                </div>
                <div className="space-y-1 flex flex-col justify-center">
                  <label className="text-label-xs font-medium text-neutral-text-secondary mb-2">Trạng thái hoạt động</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={(e) => setForm(prev => ({...prev, isActive: e.target.checked}))} />
                    <div className="w-11 h-6 bg-neutral-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-3 text-sm font-medium text-neutral-text-primary">{form.isActive ? 'Đang làm việc' : 'Đã nghỉ'}</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingUser ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-sm p-lg">
            <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">Xác nhận xóa</h3>
            <p className="text-body-sm text-neutral-text-secondary mb-lg">
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-sm">
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface">
                Hủy
              </button>
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
