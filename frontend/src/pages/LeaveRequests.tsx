import { useState, useEffect } from 'react'
import { Plus, Eye, Edit2, Trash2, FileText, Upload, Loader2 } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../services/auth-context'
import type { LeaveRequestResponse } from '../services/types'

/**
 * SCR-11 — Đơn xin nghỉ (Employee)
 *
 * Route: /leave-requests
 */

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
  ANNUAL_LEAVE: 'Phép năm',
  SICK_LEAVE: 'Ốm đau',
  PERSONAL_LEAVE: 'Việc cá nhân',
  LATE: 'Đi muộn',
  OVERTIME: 'Làm thêm giờ',
}

export function LeaveRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<LeaveRequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [createForm, setCreateForm] = useState({
    leaveType: 'ANNUAL_LEAVE',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ duyệt' },
    { key: 'APPROVED', label: 'Đã duyệt' },
    { key: 'REJECTED', label: 'Từ chối' },
  ]

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      if (!user) return
      const response = await api.leaveRequests.getMy(user.id, 0, 100)
      setRequests(response.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.startDate || !createForm.endDate || !createForm.reason) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      setSubmitting(true)
      await api.leaveRequests.create({
        leaveType: createForm.leaveType,
        startDate: createForm.startDate,
        endDate: createForm.endDate,
        reason: createForm.reason,
      })
      setShowCreateModal(false)
      setCreateForm({ leaveType: 'ANNUAL_LEAVE', startDate: '', endDate: '', reason: '' })
      loadRequests()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tạo đơn')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn này?')) return
    try {
      await api.leaveRequests.delete(id)
      loadRequests()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa đơn')
    }
  }

  const filtered = activeTab === 'all' ? requests : requests.filter((r) => r.status === activeTab)

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
          <div className="h-6 w-6 text-red-600">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold">Lỗi tải dữ liệu</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={loadRequests}
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
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-xl font-semibold text-neutral-text-primary">
          Đơn xin nghỉ
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Tạo đơn mới
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-sm border-b border-neutral-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-md py-sm text-body-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-text-muted hover:text-neutral-text-primary'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-gray-200">
                {requests.filter((r) => r.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium text-gray-900">Không có đơn từ</p>
          <p className="text-sm text-gray-500 mt-1">Chưa có đơn xin nghỉ phép nào</p>
        </div>
      ) : (
        <div className="space-y-md">
          {filtered.map((req) => (
            <div key={req.id} className="card p-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-body-base font-medium text-neutral-text-primary">
                      {LEAVE_TYPE_LABELS[req.leaveType] || req.leaveType}
                    </div>
                    <div className="text-body-sm text-neutral-text-secondary">{req.reason}</div>
                    <div className="text-label-xs text-neutral-text-muted">
                      Thời gian: {new Date(req.startDate).toLocaleDateString('vi-VN')} - {new Date(req.endDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-label-xs text-neutral-text-muted">
                      Ngày tạo: {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    {req.rejectReason && (
                      <div className="mt-1 text-label-xs text-error">
                        Lý do từ chối: {req.rejectReason}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <span className={`badge-status ${STATUS_COLORS[req.status]}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                  {req.status === 'PENDING' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="rounded p-1 text-neutral-text-muted hover:bg-neutral-surface hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md p-lg">
            <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">
              Tạo đơn xin nghỉ
            </h3>
            <form className="space-y-md" onSubmit={handleCreate}>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">
                  Loại đơn *
                </label>
                <select
                  value={createForm.leaveType}
                  onChange={(e) => setCreateForm({ ...createForm, leaveType: e.target.value })}
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none bg-white"
                >
                  {Object.entries(LEAVE_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">
                    Từ ngày *
                  </label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    required
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">
                    Đến ngày *
                  </label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    required
                    className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">
                  Lý do *
                </label>
                <textarea
                  value={createForm.reason}
                  onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
                  rows={3}
                  placeholder="Nhập lý do xin nghỉ..."
                  required
                  className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded border border-neutral-border px-md py-sm text-body-sm font-medium text-neutral-text-secondary hover:bg-neutral-surface"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Gửi đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
