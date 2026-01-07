'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type TimerMode = 'work' | 'break'

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const WORK_TIME = 25 // dakika
  const BREAK_TIME = 5 // dakika

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                // Timer bitti
                handleTimerComplete()
                return 0
              }
              return prevMin - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (mode === 'work') {
      setCompletedPomodoros((prev) => prev + 1)
      setMode('break')
      setMinutes(BREAK_TIME)
      setSeconds(0)
      // Bildirim göster (tarayıcı izni varsa)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Tamamlandı! 🎉', {
          body: '5 dakika mola zamanı!',
        })
      }
    } else {
      setMode('work')
      setMinutes(WORK_TIME)
      setSeconds(0)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Mola Bitti! 💪', {
          body: 'Yeni bir pomodoro başlatabilirsiniz.',
        })
      }
    }
  }

  const handleStart = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMinutes(mode === 'work' ? WORK_TIME : BREAK_TIME)
    setSeconds(0)
  }

  const progress = mode === 'work' 
    ? ((WORK_TIME * 60 - (minutes * 60 + seconds)) / (WORK_TIME * 60)) * 100
    : ((BREAK_TIME * 60 - (minutes * 60 + seconds)) / (BREAK_TIME * 60)) * 100

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text">
          Pomodoro Sayacı
        </h3>
        <div className="flex items-center gap-2">
          {mode === 'work' ? (
            <Coffee className="w-5 h-5 text-primary-600" />
          ) : (
            <Coffee className="w-5 h-5 text-green-600" />
          )}
          <span className="text-xs font-mono text-slate-600 dark:text-dark-muted">
            {completedPomodoros} tamamlandı
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-dark-border"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                mode === 'work' ? 'text-primary-600' : 'text-green-600'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold text-slate-900 dark:text-dark-text">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-slate-600 dark:text-dark-muted mt-1 font-mono">
              {mode === 'work' ? 'Çalışma' : 'Mola'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Başlat
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
            <Pause className="w-4 h-4" />
            Duraklat
          </Button>
        )}
        <Button onClick={handleReset} variant="ghost" className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Sıfırla
        </Button>
      </div>
    </div>
  )
}
