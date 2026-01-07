'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Exam } from '@/types'

export function ExamCountdown() {
  const [upcomingExam, setUpcomingExam] = useState<Exam | null>(null)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingExam()
  }, [])

  useEffect(() => {
    if (upcomingExam) {
      const interval = setInterval(() => {
        updateCountdown()
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [upcomingExam])

  const fetchUpcomingExam = async () => {
    try {
      const res = await fetch('/api/exams/track')
      if (res.ok) {
        const trackings = await res.json()
        const exams = trackings.map((t: any) => t.exam) as Exam[]
        
        const now = new Date()
        const upcoming = exams
          .filter((exam) => new Date(exam.examDate) > now)
          .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0]

        setUpcomingExam(upcoming || null)
        if (upcoming) {
          updateCountdown()
        }
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCountdown = () => {
    if (!upcomingExam) return

    const now = new Date()
    const examDate = new Date(upcomingExam.examDate)
    const diff = examDate.getTime() - now.getTime()

    if (diff <= 0) {
      setTimeLeft(null)
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeLeft({ days, hours, minutes, seconds })
  }

  if (loading) {
    return (
      <div className="card p-6">
        <p className="text-slate-600 dark:text-dark-muted font-mono text-sm">Yükleniyor...</p>
      </div>
    )
  }

  if (!upcomingExam) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text">
            Yaklaşan Sınav
          </h3>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-dark-muted mb-4">
            Takip ettiğiniz yaklaşan sınav bulunmuyor
          </p>
          <Link href="/exams" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Sınavları Keşfet →
          </Link>
        </div>
      </div>
    )
  }

  const examDate = new Date(upcomingExam.examDate)
  const isSoon = timeLeft && timeLeft.days < 7

  return (
    <div className={`card p-6 ${isSoon ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className={`w-5 h-5 ${isSoon ? 'text-red-600' : 'text-primary-600'}`} />
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text">
            Yaklaşan Sınav
          </h3>
        </div>
        {isSoon && (
          <span className="text-xs font-mono text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
            Yakında!
          </span>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-dark-text mb-1">
          {upcomingExam.name}
        </h4>
        <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">
          {upcomingExam.institution}
        </p>
      </div>

      {timeLeft ? (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-3 bg-slate-100 dark:bg-dark-bg rounded-lg">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-dark-text">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 dark:text-dark-muted mt-1">Gün</div>
            </div>
            <div className="text-center p-3 bg-slate-100 dark:bg-dark-bg rounded-lg">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-dark-text">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 dark:text-dark-muted mt-1">Saat</div>
            </div>
            <div className="text-center p-3 bg-slate-100 dark:bg-dark-bg rounded-lg">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-dark-text">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 dark:text-dark-muted mt-1">Dakika</div>
            </div>
            <div className="text-center p-3 bg-slate-100 dark:bg-dark-bg rounded-lg">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-dark-text">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-600 dark:text-dark-muted mt-1">Saniye</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            Sınav zamanı geldi! 🎯
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-dark-muted mb-4">
        <Clock className="w-4 h-4" />
        <span className="font-mono">
          {examDate.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <Link href={`/exams/${upcomingExam.id}`}>
        <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all text-sm font-medium">
          Detayları Gör
        </button>
      </Link>
    </div>
  )
}
