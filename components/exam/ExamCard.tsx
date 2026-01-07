'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Exam } from '@/types'
import { formatDate } from '@/lib/utils'
import { Calendar, Building2, DollarSign, Bell, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ExamCardProps {
  exam: Exam
  showTrackButton?: boolean
}

export function ExamCard({ exam, showTrackButton = true }: ExamCardProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingLoading, setTrackingLoading] = useState(false)

  useEffect(() => {
    if (showTrackButton) {
      checkTracking()
    }
  }, [exam.id, showTrackButton])

  const checkTracking = async () => {
    try {
      const res = await fetch('/api/exams/track')
      if (res.ok) {
        const trackings = await res.json()
        const currentTracking = trackings.find((t: any) => t.examId === exam.id)
        setIsTracking(!!currentTracking)
      }
    } catch (error) {
      // Kullanıcı giriş yapmamış olabilir
    }
  }

  const handleTrack = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setTrackingLoading(true)
    try {
      const res = await fetch('/api/exams/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          isInterested: !isTracking,
        }),
      })

      if (res.ok) {
        setIsTracking(!isTracking)
      } else {
        const data = await res.json()
        if (data.error?.includes('Unauthorized')) {
          // Giriş yapmamış, login sayfasına yönlendir
          window.location.href = `/auth/login?redirect=/exams/${exam.id}`
        }
      }
    } catch (error) {
      console.error('Track error:', error)
    } finally {
      setTrackingLoading(false)
    }
  }

  const isApplicationOpen = 
    new Date(exam.applicationStartDate) <= new Date() && 
    new Date(exam.applicationEndDate) >= new Date()

  return (
    <div className="card p-6 group hover:border-primary-500/50 hover:shadow-glow transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {exam.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
          isApplicationOpen 
            ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' 
            : 'bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-dark-muted border border-slate-300 dark:border-dark-border'
        }`}>
          {isApplicationOpen ? 'ACTIVE' : 'CLOSED'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600 dark:text-dark-muted">
          <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
          <code className="text-xs">{exam.institution}</code>
        </div>
        <div className="flex items-center text-sm text-slate-600 dark:text-dark-muted">
          <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
          <span className="font-mono text-xs">Sınav: {formatDate(exam.examDate)}</span>
        </div>
        {exam.fee && (
          <div className="flex items-center text-sm text-slate-600 dark:text-dark-muted">
            <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="font-mono">{exam.fee} TL</span>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500 dark:text-dark-muted mb-4 font-mono bg-slate-50 dark:bg-dark-bg p-2 rounded border border-slate-200 dark:border-dark-border">
        <p>Başvuru: {formatDate(exam.applicationStartDate)} - {formatDate(exam.applicationEndDate)}</p>
      </div>

      <div className="flex gap-2">
        <Link href={`/exams/${exam.id}`} className="flex-1">
          <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-glow active:scale-95 font-medium text-sm">
            Detaylar
          </button>
        </Link>
        {showTrackButton && (
          <Button
            variant={isTracking ? 'default' : 'outline'}
            size="sm"
            onClick={handleTrack}
            disabled={trackingLoading}
            className="px-3"
            title={isTracking ? 'Takibi kaldır' : 'Takip et'}
          >
            {isTracking ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
