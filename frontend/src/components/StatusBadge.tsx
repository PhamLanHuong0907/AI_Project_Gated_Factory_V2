/**
 * StatusBadge — Pill-shaped attendance status indicator
 *
 * Matches Stitch: rounded-full, light bg, colored text
 * Variants: ON_TIME (green), LATE (orange), ABSENT (red), ON_LEAVE (blue)
 */

export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'ABSENT' | 'ON_LEAVE' | 'EARLY_LEAVE'

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; className: string }> = {
  ON_TIME: { label: 'Hợp lệ', className: 'badge-on-time' },
  LATE: { label: 'Đi muộn', className: 'badge-late' },
  ABSENT: { label: 'Vắng mặt', className: 'badge-absent' },
  ON_LEAVE: { label: 'Nghỉ có lý do', className: 'badge-leave' },
  EARLY_LEAVE: { label: 'Về sớm', className: 'badge-early-leave' },
}

interface StatusBadgeProps {
  status: AttendanceStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`badge-status ${config.className}`}>
      {config.label}
    </span>
  )
}
