'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { User, LogOut, Shield } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
}

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Fetch user error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>
          Giriş Yap
        </Button>
        <Button size="sm" onClick={() => router.push('/auth/register')}>
          Kayıt Ol
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <User className="w-5 h-5 text-slate-700 dark:text-dark-text" />
        <span className="text-sm font-medium text-slate-700 dark:text-dark-text">
          {user.name}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-slate-200 dark:border-dark-border">
              <p className="text-sm font-semibold text-slate-900 dark:text-dark-text">
                {user.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-dark-muted">
                {user.email}
              </p>
              <p className="text-xs mt-1">
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded font-mono">
                  {user.role}
                </span>
              </p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  router.push('/dashboard')
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                Dashboard
              </button>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    router.push('/admin/dashboard')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
              <button
                onClick={() => {
                  router.push('/subscription')
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                Abonelik
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
