// ============================================================
// Precision Attendance System — TypeScript DTOs (OpenAPI-aligned)
// ============================================================

// ─── Enums ──────────────────────────────────────────────────

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
}

export enum AttendanceStatus {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  ON_LEAVE = 'ON_LEAVE',
  EARLY_LEAVE = 'EARLY_LEAVE',
}

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// ─── Common ─────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface FileUploadResponse {
  fileName: string
  fileUrl: string
  fileSize: number
  contentType: string
}

// ─── Auth ───────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role?: UserRole
}

export interface AuthResponse {
  token: string
  user: UserResponse
}

// ─── User ───────────────────────────────────────────────────

export interface UserResponse {
  id: string
  fullName: string
  email: string
  role: UserRole
  employeeCode?: string
  phoneNumber?: string
  department?: string
  position?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface UserCreateRequest {
  employeeCode: string
  fullName: string
  email: string
  password: string
  role: UserRole
  phoneNumber?: string
  department?: string
  position?: string
  positionId?: number
  initialExperienceYears?: number
  isActive?: boolean
}

export interface UserUpdateRequest {
  employeeCode?: string
  fullName?: string
  email?: string
  phoneNumber?: string
  department?: string
  position?: string
  positionId?: number
  initialExperienceYears?: number
  isActive?: boolean
  avatarUrl?: string
  role?: UserRole
}

// ─── Shift ──────────────────────────────────────────────────

export interface ShiftResponse {
  id: string
  name: string
  startTime: string
  endTime: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ShiftCreateRequest {
  name: string
  startTime: string
  endTime: string
  active?: boolean
}

export interface ShiftUpdateRequest {
  name?: string
  startTime?: string
  endTime?: string
  active?: boolean
}

// ─── Attendance ─────────────────────────────────────────────

export interface AttendanceResponse {
  id: string
  userId: string
  userName: string
  shiftId: string
  shiftName: string
  date: string
  checkInTime: string | null
  checkOutTime: string | null
  status: AttendanceStatus
  checkInLat: number | null
  checkInLng: number | null
  checkOutLat: number | null
  checkOutLng: number | null
  lateMinutes: number | null
  earlyMinutes: number | null
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface AttendanceCheckInRequest {
  userId?: string
  shiftId: string
  date: string
  checkInLat?: number
  checkInLng?: number
  qrToken?: string
  note?: string
}

export interface AttendanceManualCreateRequest {
  userId: string
  shiftId?: string
  date: string
  checkInTime?: string
  checkOutTime?: string
  status: AttendanceStatus
  lateMinutes?: number
  earlyMinutes?: number
  note?: string
}

export interface AttendanceFilterRequest {
  userId?: string
  shiftId?: string
  dateFrom?: string
  dateTo?: string
  status?: AttendanceStatus
  page?: number
  size?: number
  sort?: string
}

export interface AttendancePageResponse extends PageResponse<AttendanceResponse> {}

export interface AttendanceStatsResponse {
  totalDays: number
  onTimeCheckIn: number
  late: number
  onTimeCheckOut: number
  earlyLeave: number
  absent: number
  leave: number
  attendanceRate: number
}

// ─── Leave Request ──────────────────────────────────────────

export interface LeaveRequestResponse {
  id: string
  userId: string
  userName: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  attachmentUrls: string
  status: LeaveRequestStatus
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: string
  rejectReason?: string
  createdAt: string
  updatedAt: string
}

export interface LeaveRequestCreateRequest {
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  attachmentUrls?: string
}

export interface LeaveRequestUpdateRequest {
  leaveType?: string
  reason?: string
  startDate?: string
  endDate?: string
  attachmentUrl?: string
}

export interface LeaveRequestRejectRequest {
  rejectReason: string
}

export interface LeaveRequestPageResponse extends PageResponse<LeaveRequestResponse> {}

// ─── Salary ─────────────────────────────────────────────────

export interface SalaryPositionResponse {
  id: string
  positionName: string
  baseSalary: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface SalaryExperienceResponse {
  id: string
  minYears: number
  maxYears: number | null
  multiplier: number
  label: string
  createdAt: string
  updatedAt: string
}

export interface SalaryPenaltyResponse {
  id: string
  name: string
  amount: number
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SalaryBonusResponse {
  id: string
  name: string
  amount: number
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SalaryAssignRequest {
  userId: string
  configId: string
}

export interface SalaryEmployeeResponse {
  userId: string
  userName: string
  positionId: string
  positionName: string
  baseSalary: number
  experienceId: string | null
  experienceLabel: string | null
  multiplier: number
  finalSalary: number
  effectiveDate: string
}

// ─── Config ─────────────────────────────────────────────────

export interface GpsConfigResponse {
  id: string
  latitude: number
  longitude: number
  radius: number
  address: string
  active: boolean
  updatedAt: string
}

export interface GpsConfigUpdateRequest {
  latitude: number
  longitude: number
  radius: number
  address: string
  active?: boolean
}

export interface QrConfigResponse {
  id: string
  expiryMinutes: number
  refreshIntervalMinutes: number
  active: boolean
  updatedAt: string
}

export interface QrConfigUpdateRequest {
  expiryMinutes: number
  refreshIntervalMinutes: number
  active?: boolean
}

export interface AttendanceConfigResponse {
  id: string
  lateThresholdMinutes: number
  absentThresholdMinutes: number
  earlyLeaveMinutes: number
  allowRemoteCheckIn: boolean
  requireLocation: boolean
  updatedAt: string
}

export interface AttendanceConfigUpdateRequest {
  lateThresholdMinutes?: number
  absentThresholdMinutes?: number
  earlyLeaveMinutes?: number
  allowRemoteCheckIn?: boolean
  requireLocation?: boolean
}
