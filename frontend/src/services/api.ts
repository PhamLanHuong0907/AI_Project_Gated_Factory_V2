/**
 * API client — real backend only
 * Types are aligned with OpenAPI; null vs undefined handled at service boundary.
 */
import {
  AttendanceStatus,
  UserRole,
} from './types'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  ShiftResponse,
  ShiftCreateRequest,
  ShiftUpdateRequest,
  AttendanceResponse,
  AttendanceFilterRequest,
  AttendanceStatsResponse,
  AttendanceCheckInRequest,
  LeaveRequestResponse,
  LeaveRequestCreateRequest,
  LeaveRequestUpdateRequest,
  LeaveRequestRejectRequest,
  SalaryPositionResponse,
  SalaryExperienceResponse,
  SalaryPenaltyResponse,
  SalaryBonusResponse,
  SalaryAssignRequest,
  SalaryEmployeeResponse,
  GpsConfigResponse,
  GpsConfigUpdateRequest,
  QrConfigResponse,
  QrConfigUpdateRequest,
  AttendanceConfigResponse,
  AttendanceConfigUpdateRequest,
  PageResponse,
} from './types'

// ─── Config ─────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || ''

// ─── Generic fetch wrapper ──────────────────────────────────

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const text = await res.text().catch(() => '')
    let body: any = {}
    if (text) {
      try { body = JSON.parse(text) } catch (e) {}
    }
    throw new Error(body.message || `API error ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return text ? JSON.parse(text) : undefined as T
}

// ─── Auth ───────────────────────────────────────────────────

const auth = {
  async login(req: LoginRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async register(req: RegisterRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async me(): Promise<UserResponse> {
    return apiFetch<UserResponse>('/api/auth/me')
  },
}

// ─── Users ──────────────────────────────────────────────────

const users = {
  async getAll(): Promise<UserResponse[]> {
    const res = await apiFetch<any>('/api/users?size=1000')
    return Array.isArray(res) ? res : (res.content || [])
  },

  async getById(id: string): Promise<UserResponse> {
    return apiFetch<UserResponse>(`/api/users/${id}`)
  },

  async create(req: UserCreateRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>('/api/users', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async update(id: string, req: UserUpdateRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/api/users/${id}`, { method: 'DELETE' })
  },
}

// ─── Shifts ─────────────────────────────────────────────────

const shifts = {
  async getAll(): Promise<ShiftResponse[]> {
    const res = await apiFetch<any>('/api/shifts?size=1000')
    return Array.isArray(res) ? res : (res.content || [])
  },

  async getById(id: string): Promise<ShiftResponse> {
    return apiFetch<ShiftResponse>(`/api/shifts/${id}`)
  },

  async create(req: ShiftCreateRequest): Promise<ShiftResponse> {
    return apiFetch<ShiftResponse>('/api/shifts', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async update(id: string, req: ShiftUpdateRequest): Promise<ShiftResponse> {
    return apiFetch<ShiftResponse>(`/api/shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/api/shifts/${id}`, { method: 'DELETE' })
  },

  async toggleActive(id: string): Promise<ShiftResponse> {
    return apiFetch<ShiftResponse>(`/api/shifts/${id}/toggle`, { method: 'PATCH' })
  },
}

// ─── Attendance ─────────────────────────────────────────────

const attendance = {
  async getAll(filter?: AttendanceFilterRequest): Promise<PageResponse<AttendanceResponse>> {
    const params = new URLSearchParams()
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.set(k, String(v))
      })
    }
    const qs = params.toString()
    return apiFetch(`/api/attendance${qs ? `?${qs}` : ''}`)
  },

  async getById(id: string): Promise<AttendanceResponse> {
    return apiFetch<AttendanceResponse>(`/api/attendance/${id}`)
  },

  async checkIn(req: AttendanceCheckInRequest): Promise<AttendanceResponse> {
    return apiFetch<AttendanceResponse>('/api/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async manualCreate(req: import('./types').AttendanceManualCreateRequest): Promise<AttendanceResponse> {
    return apiFetch<AttendanceResponse>('/api/attendance/manual', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async checkOut(id: string, lat?: number, lng?: number): Promise<AttendanceResponse> {
    const body = (lat !== undefined && lng !== undefined) ? JSON.stringify({ checkOutLat: lat, checkOutLng: lng }) : undefined
    return apiFetch<AttendanceResponse>(`/api/attendance/${id}/check-out`, {
      method: 'POST',
      body,
    })
  },

  async getStats(date: string, userId?: string): Promise<AttendanceStatsResponse> {
    const params = new URLSearchParams({ date })
    if (userId) params.set('userId', userId)
    return apiFetch(`/api/attendance/stats?${params.toString()}`)
  },

  async exportCsv(filter?: AttendanceFilterRequest): Promise<Blob> {
    return apiFetch<Blob>('/api/attendance/export', { method: 'GET' })
  },
}

// ─── Leave Requests ─────────────────────────────────────────

const leaveRequests = {
  async getAll(
    page = 0,
    size = 10,
  ): Promise<PageResponse<LeaveRequestResponse>> {
    return apiFetch(`/api/leave-requests?page=${page}&size=${size}`)
  },

  async getById(id: string): Promise<LeaveRequestResponse> {
    return apiFetch<LeaveRequestResponse>(`/api/leave-requests/${id}`)
  },

  async getMy(
    userId: string,
    page = 0,
    size = 10,
  ): Promise<PageResponse<LeaveRequestResponse>> {
    return apiFetch(`/api/leave-requests/my?userId=${userId}&page=${page}&size=${size}`)
  },

  async create(req: LeaveRequestCreateRequest): Promise<LeaveRequestResponse> {
    return apiFetch<LeaveRequestResponse>('/api/leave-requests', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async update(id: string, req: LeaveRequestUpdateRequest): Promise<LeaveRequestResponse> {
    return apiFetch<LeaveRequestResponse>(`/api/leave-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/api/leave-requests/${id}`, { method: 'DELETE' })
  },

  async approve(id: string): Promise<LeaveRequestResponse> {
    return apiFetch<LeaveRequestResponse>(`/api/leave-requests/${id}/approve`, {
      method: 'POST',
    })
  },

  async reject(id: string, req: LeaveRequestRejectRequest): Promise<LeaveRequestResponse> {
    return apiFetch<LeaveRequestResponse>(`/api/leave-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },

  async upload(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/api/leave-requests/upload`, {
      method: 'POST',
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    const data = await res.json()
    return data.fileUrl
  },
}

// ─── Salary ─────────────────────────────────────────────────

const salary = {
  // ── Positions ──
  async positions(): Promise<SalaryPositionResponse[]> {
    return apiFetch('/api/salary/positions')
  },
  async createPosition(data: { name: string; baseSalary: number; description?: string; experiences?: any[] }) {
    return apiFetch('/api/salary/positions', { method: 'POST', body: JSON.stringify(data) })
  },
  async updatePosition(id: string, data: { name?: string; baseSalary?: number; description?: string; experiences?: any[] }) {
    return apiFetch(`/api/salary/positions/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  async deletePosition(id: string) {
    return apiFetch(`/api/salary/positions/${id}`, { method: 'DELETE' })
  },

  // ── Experience ──
  async experience(): Promise<SalaryExperienceResponse[]> {
    return apiFetch('/api/salary/experience')
  },
  async createExperience(data: { name: string; percentage: number; minYears: number; maxYears?: number | null }) {
    return apiFetch('/api/salary/experience', { method: 'POST', body: JSON.stringify(data) })
  },
  async updateExperience(id: string, data: { name?: string; percentage?: number; minYears?: number; maxYears?: number | null }) {
    return apiFetch(`/api/salary/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  async deleteExperience(id: string) {
    return apiFetch(`/api/salary/experience/${id}`, { method: 'DELETE' })
  },

  // ── Penalties ──
  async penalties(): Promise<SalaryPenaltyResponse[]> {
    return apiFetch('/api/salary/penalties')
  },
  async createPenalty(data: { name: string; penaltyType: string; amount: number; description?: string }) {
    return apiFetch('/api/salary/penalties', { method: 'POST', body: JSON.stringify(data) })
  },
  async updatePenalty(id: string, data: { name?: string; penaltyType?: string; amount?: number; description?: string }) {
    return apiFetch(`/api/salary/penalties/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  async deletePenalty(id: string) {
    return apiFetch(`/api/salary/penalties/${id}`, { method: 'DELETE' })
  },

  // ── Bonus ──
  async bonus(): Promise<SalaryBonusResponse[]> {
    return apiFetch('/api/salary/bonus')
  },
  async createBonus(data: { name: string; bonusType: string; amount: number; description?: string }) {
    return apiFetch('/api/salary/bonus', { method: 'POST', body: JSON.stringify(data) })
  },
  async updateBonus(id: string, data: { name?: string; bonusType?: string; amount?: number; description?: string }) {
    return apiFetch(`/api/salary/bonus/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  async deleteBonus(id: string) {
    return apiFetch(`/api/salary/bonus/${id}`, { method: 'DELETE' })
  },

  // ── Report ──
  async report(month: string) {
    return apiFetch(`/api/salary/report?month=${month}`)
  },

  async assign(req: SalaryAssignRequest): Promise<SalaryEmployeeResponse> {
    return apiFetch('/api/salary/assign', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
  async assignBonus(req: SalaryAssignRequest) {
    return apiFetch('/api/salary/assign/bonus', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
  async unassignBonus(req: SalaryAssignRequest) {
    return apiFetch('/api/salary/unassign/bonus', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
  async assignPenalty(req: SalaryAssignRequest) {
    return apiFetch('/api/salary/assign/penalty', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
  async unassignPenalty(req: SalaryAssignRequest) {
    return apiFetch('/api/salary/unassign/penalty', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
  async getFormula(): Promise<{ formula: string }> {
    return apiFetch('/api/salary/formula')
  },
  async updateFormula(formula: string): Promise<void> {
    return apiFetch('/api/salary/formula', {
      method: 'PUT',
      body: JSON.stringify({ formula }),
    })
  },

  async employeeDetail(userId: string): Promise<SalaryEmployeeResponse> {
    return apiFetch(`/api/salary/employee/${userId}`)
  },
}

// ─── Config ─────────────────────────────────────────────────

const config = {
  async gps(): Promise<GpsConfigResponse> {
    return apiFetch('/api/config/gps')
  },

  async updateGps(req: GpsConfigUpdateRequest): Promise<GpsConfigResponse> {
    return apiFetch('/api/config/gps', {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },

  async qr(): Promise<QrConfigResponse> {
    return apiFetch('/api/config/qr')
  },

  async updateQr(req: QrConfigUpdateRequest): Promise<QrConfigResponse> {
    return apiFetch('/api/config/qr', {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },

  async attendance(): Promise<AttendanceConfigResponse> {
    return apiFetch('/api/config/attendance')
  },

  async updateAttendance(
    req: AttendanceConfigUpdateRequest,
  ): Promise<AttendanceConfigResponse> {
    return apiFetch('/api/config/attendance', {
      method: 'PUT',
      body: JSON.stringify(req),
    })
  },
}

// ─── Exported API object ────────────────────────────────────

export const api = {
  auth,
  users,
  shifts,
  attendance,
  leaveRequests,
  salary,
  config,
}
