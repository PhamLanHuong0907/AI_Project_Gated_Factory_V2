import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Clock, AlertCircle } from 'lucide-react'

/**
 * SCR-01 — Login (Standalone, no App Shell)
 *
 * Stitch ref: ng_nh_p_h_th_ng
 * Route: /login
 */

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Sai email hoặc mật khẩu')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Không thể kết nối server. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-md">
      <div className="w-full max-w-md space-y-lg rounded-lg bg-white p-xl shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center gap-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
            <Clock size={28} />
          </div>
          <h1 className="text-headline-2xl font-bold text-neutral-text-primary">
            Precision Attendance
          </h1>
          <p className="text-body-sm text-neutral-text-muted">HR Management System</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-sm rounded bg-red-50 p-sm text-body-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-md" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-label-xs font-medium text-neutral-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pas.vn"
              className="w-full rounded border border-neutral-border px-md py-sm text-body-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-medium text-neutral-text-secondary">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded border border-neutral-border px-md py-sm pr-10 text-body-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-text-muted hover:text-neutral-text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary py-sm text-body-base font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="rounded bg-neutral-bg-secondary p-sm text-body-xs text-neutral-text-muted">
          <p className="font-medium mb-1">Tài khoản demo:</p>
          <p>Admin: admin@pas.vn / admin123</p>
          <p>HR: hr.manager@pas.vn / hr123456</p>
          <p>Nhân viên: employee@pas.vn / emp123456</p>
        </div>
      </div>
    </div>
  )
}
