'use client'

import { createContext, useContext, useCallback, ReactNode } from 'react'
import useSWR from 'swr'
import { IUser } from '@/models/User'
import axios from 'axios'

interface AuthContextType {
  user: IUser | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; user?: IUser }>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string; user?: IUser }>
  logout: () => Promise<void>
  mutateAuth: () => Promise<unknown>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// SWR fetcher function
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { user: null }
    }
    throw new Error('Failed to fetch')
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // 使用SWR进行认证状态管理，带有缓存和重试机制
  const { data, error, isLoading, mutate: mutateAuth } = useSWR(
    '/api/auth/session',
    fetcher,
    {
      revalidateOnFocus: false, // 减少不必要的重新验证
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10秒内重复请求去重
      errorRetryCount: 2,
      errorRetryInterval: 1000,
      fallbackData: { user: null } // 提供默认值避免初始loading
    }
  )

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      
      // 更新SWR缓存
      await mutateAuth({ user: response.data.user }, false)
      return { success: true, user: response.data.user }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.error || 'Login failed' }
      }
      return { success: false, error: 'Login failed' }
    }
  }, [mutateAuth])

  const register = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', { username, password })
      return { success: true, user: response.data.user }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.error || 'Registration failed' }
      }
      return { success: false, error: 'Registration failed' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 更新SWR缓存
      await mutateAuth({ user: null }, false)
    }
  }, [mutateAuth])

  const value: AuthContextType = {
    user: data?.user || null,
    loading: isLoading,
    error: error?.message || null,
    login,
    register,
    logout,
    mutateAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}