import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { api } from './api'
import type { UserResponse, LoginRequest, RegisterRequest } from './types'

// ─── Types ──────────────────────────────────────────────────

interface AuthState {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (req: LoginRequest) => Promise<void>
  register: (req: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

// ─── Context ────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
  })

  // Load user on mount if token exists
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setState({ user: null, token: null, isAuthenticated: false, loading: false })
      return
    }

    try {
      const user = await api.auth.me()
      setState({ user, token, isAuthenticated: true, loading: false })
    } catch {
      localStorage.removeItem('token')
      setState({ user: null, token: null, isAuthenticated: false, loading: false })
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Login
  const login = useCallback(async (req: LoginRequest) => {
    const res = await api.auth.login(req)
    localStorage.setItem('token', res.token)
    setState({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      loading: false,
    })
  }, [])

  // Register
  const register = useCallback(async (req: RegisterRequest) => {
    const res = await api.auth.register(req)
    localStorage.setItem('token', res.token)
    setState({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      loading: false,
    })
  }, [])

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setState({ user: null, token: null, isAuthenticated: false, loading: false })
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const user = await api.auth.me()
      setState((prev) => ({ ...prev, user }))
    } catch {
      logout()
    }
  }, [logout])

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ───────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
