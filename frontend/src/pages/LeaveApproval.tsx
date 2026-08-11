import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  PaperClipIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { api } from '../services/api'
import type { LeaveRequestResponse } from '../services/types'

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface LeaveRequest {
  id: string
  userId: string
  userName: string
  employeeCode: string
  leaveType: string
  reason: string
  startDate: string
  endDate: string
  status: LeaveStatus
  rejectReason?: string
  attachmentUrl?: string
  createdAt: string
}

const STATUS_CONFIG: Record<LeaveStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING: {
    label: 'Chờ duyệt',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: ClockIcon,
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircleIcon,
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircleIcon,
  },
}

const LEAVE_TYPE_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  ANNUAL_LEAVE: { label: 'Phép năm', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '🏖️' },
  SICK_LEAVE: { label: 'Ốm đau', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: '🤒' },
  PERSONAL_LEAVE: { label: 'Việc cá nhân', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: '📋' },
  LATE: { label: 'Đi muộn', color: 'text-red-700', bgColor: 'bg-red-100', icon: '⏰' },
  OVERTIME: { label: 'Làm thêm giờ', color: 'text-green-700', bgColor: 'bg-green-100', icon: '💼' },
}

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ duyệt' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'REJECTED', label: 'Từ chối' },
]

export function LeaveApproval() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<LeaveStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showDetailModal, setShowDetailModal] = useState<LeaveRequest | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.leaveRequests.getAll(0, 100)
      const records: LeaveRequest[] = response.content.map((lr: any) => ({
        id: lr.id,
        userId: lr.userId,
        userName: lr.userName || 'N/A',
        employeeCode: lr.employeeCode || '-',
        leaveType: lr.leaveType || 'ANNUAL_LEAVE',
        reason: lr.reason || '',
        startDate: lr.startDate,
        endDate: lr.endDate,
        status: lr.status as LeaveStatus,
        rejectReason: lr.rejectReason,
        attachmentUrl: lr.attachmentUrl,
        createdAt: lr.createdAt,
      }))
      setRequests(records)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id)
      await api.leaveRequests.approve(id)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' as const } : r))
      )
    } catch (err) {
      console.error('Approve error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!showRejectModal || !rejectReason.trim()) return
    try {
      setActionLoading(showRejectModal)
      await api.leaveRequests.reject(showRejectModal, { rejectReason })
      setRequests((prev) =>
        prev.map((r) =>
          r.id === showRejectModal
            ? { ...r, status: 'REJECTED' as const, rejectReason }
            : r
        )
      )
      setShowRejectModal(null)
      setRejectReason('')
    } catch (err) {
      console.error('Reject error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesTab = activeTab === 'all' || request.status === activeTab
    const matchesSearch =
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'PENDING').length,
    approved: requests.filter((r) => r.status === 'APPROVED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Duyệt đơn từ</h1>
        <p className="text-gray-600 mt-1">Quản lý đơn xin nghỉ phép của nhân viên</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng đơn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as LeaveStatus | 'all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                      {tab.key === 'PENDING' ? stats.pending : tab.key === 'APPROVED' ? stats.approved : stats.rejected}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ClockIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">Không có đơn từ</p>
            <p className="text-sm text-gray-500 mt-1">Chưa có đơn xin nghỉ phép nào cần duyệt</p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const statusConfig = STATUS_CONFIG[request.status]
            const leaveTypeConfig = LEAVE_TYPE_CONFIG[request.leaveType] || LEAVE_TYPE_CONFIG.ANNUAL_LEAVE
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${leaveTypeConfig.bgColor}`}>
                      <span className="text-xl">{leaveTypeConfig.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                        <span className="text-sm text-gray-500">({request.employeeCode})</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {request.leaveType === 'ANNUAL_LEAVE' ? 'Phép năm' :
                           request.leaveType === 'SICK_LEAVE' ? 'Ốm đau' :
                           request.leaveType === 'PERSONAL_LEAVE' ? 'Việc cá nhân' :
                           request.leaveType === 'LATE' ? 'Đi muộn' :
                           request.leaveType === 'OVERTIME' ? 'Làm thêm giờ' : request.leaveType}
                        </span>
                        <span>
                          Thời gian: {new Date(request.startDate).toLocaleDateString('vi-VN')} - {new Date(request.endDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {request.reason && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{request.reason}</p>
                      )}
                      {request.attachmentUrl && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-indigo-600">
                          <PaperClipIcon className="h-4 w-4" />
                          <span>{request.attachmentUrl}</span>
                        </div>
                      )}
                      {request.status === 'REJECTED' && request.rejectReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Lý do từ chối:</span> {request.rejectReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDetailModal(request)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => setShowRejectModal(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowRejectModal(null)}
            />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Từ chối đơn</h3>
                    <div className="mt-4">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || actionLoading === showRejectModal}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  {actionLoading === showRejectModal ? 'Đang xử lý...' : 'Từ chối'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(null)
                    setRejectReason('')
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetailModal(null)}
            />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">Chi tiết đơn từ</h3>
                  <button
                    onClick={() => setShowDetailModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nhân viên</p>
                    <p className="font-medium">{showDetailModal.userName} ({showDetailModal.employeeCode})</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm text-gray-500">Loại đơn</div>
                      <div className="col-span-2 text-sm font-medium text-gray-900">
                        {showDetailModal.leaveType === 'ANNUAL_LEAVE' ? 'Phép năm' :
                         showDetailModal.leaveType === 'SICK_LEAVE' ? 'Ốm đau' :
                         showDetailModal.leaveType === 'PERSONAL_LEAVE' ? 'Việc cá nhân' :
                         showDetailModal.leaveType === 'LATE' ? 'Đi muộn' :
                         showDetailModal.leaveType === 'OVERTIME' ? 'Làm thêm giờ' : showDetailModal.leaveType}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm text-gray-500">Thời gian</div>
                      <div className="col-span-2 text-sm font-medium text-gray-900">
                        {new Date(showDetailModal.startDate).toLocaleDateString('vi-VN')} - {new Date(showDetailModal.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lý do</p>
                    <p className="font-medium">{showDetailModal.reason || 'Không có'}</p>
                  </div>
                  {showDetailModal.attachmentUrl && (
                    <div>
                      <p className="text-sm text-gray-500">Đính kèm</p>
                      <p className="font-medium text-indigo-600">{showDetailModal.attachmentUrl}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {showDetailModal.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleApprove(showDetailModal.id)
                        setShowDetailModal(null)
                      }}
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    >
                      Duyệt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectModal(showDetailModal.id)
                        setShowDetailModal(null)
                      }}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowDetailModal(null)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
