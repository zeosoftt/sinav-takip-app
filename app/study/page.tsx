'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Activity, Clock } from 'lucide-react'

function formatHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function StudyTrackerPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [todaySeconds, setTodaySeconds] = useState(0)
  const tickRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-start session on mount (if logged in)
  useEffect(() => {
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
  }, [])

  const fetchToday = async () => {
    try {
      const res = await fetch('/api/study/sessions?range=today')
      if (res.ok) {
        const data = await res.json()
        setTodaySeconds(data.todayTotalSeconds || 0)
      }
    } catch { /* ignore */ }
  }

  const startSession = async () => {
    if (isRunning) return
    try {
      const res = await fetch('/api/study/sessions', { method: 'POST' })
      if (res.ok) {
        setIsRunning(true)
        if (!tickRef.current) {
          tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
        }
      }
    } catch { /* ignore */ }
  }

  const stopSession = async () => {
    if (!isRunning) return
    try {
      await fetch('/api/study/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' } })
    } finally {
      setIsRunning(false)
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
      setSeconds(0)
      fetchToday()
    }
  }

  const resetTimer = () => {
    setSeconds(0)
  }

  useEffect(() => {
    fetchToday()
  }, [])

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

