'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Users, Building2, BookOpen, BarChart3, Settings, Shield } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalInstitutions: number
  totalExams: number
  totalStudents: number
  premiumUsers: number
  activeSubscriptions: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/auth/login?redirect=/admin/dashboard'
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-slate-600 dark:text-dark-muted">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2" />
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-dark-muted font-mono text-sm">
            Sistem yönetimi ve istatistikler
          </p>
        </div>
        <Link href="/admin/settings">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Ayarlar
          </Button>
        </Link>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Toplam Kullanıcı</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Kurumlar</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.totalInstitutions}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Sınavlar</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.totalExams}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Öğrenciler</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Premium Üyeler</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.premiumUsers}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Aktif Abonelikler</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      )}

      {/* Hızlı İşlemler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <div className="card p-6 hover:border-primary-500/50 transition-all cursor-pointer">
            <Users className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text mb-2">
              Kullanıcı Yönetimi
            </h3>
            <p className="text-sm text-slate-600 dark:text-dark-muted">
              Tüm kullanıcıları görüntüle, düzenle ve yönet
            </p>
          </div>
        </Link>
        <Link href="/admin/exams">
          <div className="card p-6 hover:border-primary-500/50 transition-all cursor-pointer">
            <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text mb-2">
              Sınav Yönetimi
            </h3>
            <p className="text-sm text-slate-600 dark:text-dark-muted">
              Sınavları ekle, düzenle ve yönet
            </p>
          </div>
        </Link>
        <Link href="/admin/institutions">
          <div className="card p-6 hover:border-primary-500/50 transition-all cursor-pointer">
            <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text mb-2">
              Kurum Yönetimi
            </h3>
            <p className="text-sm text-slate-600 dark:text-dark-muted">
              Kurumları görüntüle ve yönet
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
