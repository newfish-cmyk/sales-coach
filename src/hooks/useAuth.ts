'use client'

import { useState, useEffect } from 'react'
import { IUser } from '@/models/User'

interface AuthState {
  user: IUser | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/session')
      
      if (response.ok) {
        const data = await response.json()
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        })
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Failed to check authentication'
      })
    }
  }

  const login = async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        })
        return { success: true, user: data.user }
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.error
        }))
        return { success: false, error: data.error }
      }
    } catch (error) {
      const errorMessage = 'Login failed'
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const register = async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState(prev => ({ ...prev, loading: false, error: null }))
        return { success: true, user: data.user }
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.error
        }))
        return { success: false, error: data.error }
      }
    } catch (error) {
      const errorMessage = 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      // 调用logout API来清除httpOnly cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 无论API调用成功与否，都清除客户端状态
      setAuthState({
        user: null,
        loading: false,
        error: null
      })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    checkAuth
  }
}