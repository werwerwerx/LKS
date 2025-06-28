'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: number
  login: string
}

interface LoginResponse {
  success: boolean
  token: string
  admin: Admin
}

interface AuthState {
  isAuthenticated: boolean
  admin: Admin | null
  loading: boolean
}

const TOKEN_KEY = 'admin_token'

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    loading: true
  })

  const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
  }

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
  }

  const login = async (login: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToken(data.token)
        setAuthState({
          isAuthenticated: true,
          admin: data.admin,
          loading: false
        })
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Ошибка входа' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Ошибка сети' }
    }
  }

  const logout = () => {
    removeToken()
    setAuthState({
      isAuthenticated: false,
      admin: null,
      loading: false
    })
    router.push('/login')
  }

  const checkAuth = async () => {
    const token = getToken()
    
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false
      })
      return false
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuthState({
          isAuthenticated: true,
          admin: data.admin,
          loading: false
        })
        return true
      } else {
        removeToken()
        setAuthState({
          isAuthenticated: false,
          admin: null,
          loading: false
        })
        return false
      }
    } catch (error) {
      console.error('Auth check error:', error)
      removeToken()
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false
      })
      return false
    }
  }

  const initAdmin = async (login: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Ошибка создания администратора' }
      }
    } catch (error) {
      console.error('Admin init error:', error)
      return { success: false, error: 'Ошибка сети' }
    }
  }

  const checkAdminExists = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/init')
      const data = await response.json()
      return data.hasAdmin
    } catch (error) {
      console.error('Admin check error:', error)
      return false
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    initAdmin,
    checkAdminExists
  }
} 