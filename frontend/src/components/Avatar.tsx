/**
 * Avatar — Colored circle with initials
 *
 * Matches Stitch: rounded-full, colored bg based on name hash, white text
 */

const AVATAR_COLORS = [
  'bg-primary',
  'bg-success',
  'bg-warning',
  'bg-error',
  'bg-secondary',
  'bg-primary-light',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
]

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const colorIndex = hashName(name) % AVATAR_COLORS.length
  const bgColor = AVATAR_COLORS[colorIndex]
  const initials = getInitials(name)

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${bgColor} ${SIZE_CLASSES[size]}`}
    >
      {initials}
    </div>
  )
}
