'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ExamCard } from '@/components/exam/ExamCard'
import { Calendar, Bell, TrendingUp, BookOpen } from 'lucide-react'
import { Exam } from '@/types'

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    trackedExams: 0,
    upcomingExams: 0,
    notifications: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Takip edilen sınavları çek
      const trackingsRes = await fetch('/api/exams/track')
      if (trackingsRes.ok) {
        const trackings = await trackingsRes.json()
        const examList = trackings.map((t: any) => t.exam)
        setExams(examList)
        
        // İstatistikleri hesapla
        const now = new Date()
        const upcoming = examList.filter((e: Exam) => new Date(e.examDate) > now).length
        
        setStats({
          trackedExams: examList.length,
          upcomingExams: upcoming,
          notifications: 0, // TODO: Bildirim sayısını çek
        })
      }

      // Bildirim sayısını çek
      const notificationsRes = await fetch('/api/notifications')
      if (notificationsRes.ok) {
        const notifications = await notificationsRes.json()
        const unreadCount = notifications.filter((n: any) => !n.isRead).length
        setStats(prev => ({ ...prev, notifications: unreadCount }))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-dark-muted font-mono text-sm">
          Sınav takibinizi buradan yönetin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 hover:border-primary-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Takip Edilen Sınavlar</p>
              <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                {stats.trackedExams}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <div className="card p-6 hover:border-primary-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Yaklaşan Sınavlar</p>
              <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                {stats.upcomingExams}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <div className="card p-6 hover:border-primary-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Bildirimler</p>
              <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                {stats.notifications}
              </p>
            </div>
            <Bell className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text mb-4">
          Hızlı İşlemler
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/exams">
            <Button>Sınavları Görüntüle</Button>
          </Link>
          <Link href="/exams/track">
            <Button variant="outline">Yeni Sınav Takip Et</Button>
          </Link>
          <Link href="/notifications">
            <Button variant="outline">Bildirimler</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">Abonelik Yönetimi</Button>
          </Link>
        </div>
      </div>

      {/* Tracked Exams */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text">
            Takip Ettiğiniz Sınavlar
          </h2>
          <Link href="/exams">
            <Button variant="ghost" size="sm">Tümünü Gör</Button>
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-dark-muted font-mono">Yükleniyor...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-400 dark:text-dark-muted mx-auto mb-4" />
            <p className="text-slate-600 dark:text-dark-muted mb-4">Henüz takip ettiğiniz sınav yok</p>
            <Link href="/exams">
              <Button>Sınavları Keşfet</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
