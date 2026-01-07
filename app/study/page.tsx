'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Activity, Clock, AlertCircle, LogIn } from 'lucide-react'

function formatHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function StudyTrackerPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [todaySeconds, setTodaySeconds] = useState(0)
  const [error, setError] = useState<string>('')
  const tickRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Auto-start session on mount (if logged in)
  useEffect(() => {
    if (!isAuthenticated) return

    startSession()
    const onVisibility = () => {
      if (document.hidden) {
        stopSession()
      } else {
        startSession()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', stopSession)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', stopSession)
      stopSession()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        setIsAuthenticated(true)
        fetchToday()
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    }
  }

  const fetchToday = async () => {
    try {
      const res = await fetch('/api/study/sessions?range=today')
      if (res.ok) {
        const data = await res.json()
        setTodaySeconds(data.todayTotalSeconds || 0)
      } else if (res.status === 401) {
        setIsAuthenticated(false)
      }
    } catch {
      // Ignore
    }
  }

  const startSession = async () => {
    if (isRunning || !isAuthenticated) return
    
    try {
      const res = await fetch('/api/study/sessions', { method: 'POST' })
      if (res.ok) {
        setIsRunning(true)
        setError('')
        if (!tickRef.current) {
          tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
        }
      } else if (res.status === 401) {
        setIsAuthenticated(false)
        setError('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.')
        stopSession()
      } else {
        const data = await res.json()
        setError(data.error || 'Oturum başlatılamadı')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const stopSession = async () => {
    if (!isRunning) return
    
    try {
      const res = await fetch('/api/study/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.status === 401) {
        setIsAuthenticated(false)
      }
    } catch {
      // Ignore
    } finally {
      setIsRunning(false)
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
      setSeconds(0)
      if (isAuthenticated) {
        fetchToday()
      }
    }
  }

  const resetTimer = () => {
    setSeconds(0)
  }

  const handleLogin = () => {
    const currentPath = window.location.pathname
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card p-12 text-center">
          <p className="text-slate-600 dark:text-dark-muted font-mono">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Show login required message
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
            Çalışma Takipçisi
          </h1>
          <p className="mt-2 text-slate-600 dark:text-dark-muted font-mono text-sm">
            Bu özelliği kullanmak için giriş yapmanız gerekiyor.
          </p>
        </div>

        <div className="card p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text mb-2">
            Giriş Gerekli
          </h2>
          <p className="text-slate-600 dark:text-dark-muted mb-6">
            Çalışma sürenizi takip edebilmek için lütfen hesabınıza giriş yapın veya yeni bir hesap oluşturun.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleLogin} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </Button>
            <Link href="/auth/register">
              <Button variant="outline">Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
          Çalışma Takipçisi
        </h1>
        <p className="mt-2 text-slate-600 dark:text-dark-muted font-mono text-sm">
          Bu sayfada çalışma süreniz otomatik olarak kaydedilir. Sekmeden ayrıldığınızda durur, geri döndüğünüzde devam eder.
        </p>
      </div>

      {error && (
        <div className="mb-6 card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200 font-mono">{error}</p>
          </div>
        </div>
      )}

      <div className="card p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-slate-900 dark:text-dark-text">
            {formatHMS(seconds)}
          </div>
          <div className="text-sm text-slate-600 dark:text-dark-muted mt-2">
            Anlık Oturum
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <Button onClick={startSession} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Başlat
            </Button>
          ) : (
            <Button onClick={stopSession} variant="outline" className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Durdur
            </Button>
          )}
          <Button onClick={resetTimer} variant="ghost" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text">
                Bugünkü Toplam
              </h3>
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900 dark:text-dark-text">
            {formatHMS(todaySeconds)}
          </div>
          <p className="text-sm text-slate-600 dark:text-dark-muted mt-2">
            Tüm oturumlarınızın toplamı
          </p>
        </div>
      </div>
    </div>
  )
}
