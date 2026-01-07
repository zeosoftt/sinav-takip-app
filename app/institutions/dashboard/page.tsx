'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Users, TrendingUp, BookOpen, Plus, BarChart3 } from 'lucide-react'

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  studentNumber?: string
  createdAt: string
  examTrackings: any[]
}

interface Stats {
  institution: {
    id: string
    name: string
    type: string
  }
  stats: {
    totalStudents: number
    totalTrackings: number
    appliedCount: number
    passedCount: number
    failedCount: number
    recentStudents: number
    successRate: number
  }
}

export default function InstitutionDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch('/api/institutions/stats'),
        fetch('/api/institutions/students'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData.students || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
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
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-2">
          Kurum Dashboard
        </h1>
        {stats && (
          <p className="text-slate-600 dark:text-dark-muted font-mono text-sm">
            {stats.institution.name} - {stats.institution.type}
          </p>
        )}
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Toplam Öğrenci</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.stats.totalStudents}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Sınav Takibi</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.stats.totalTrackings}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Başarı Oranı</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  %{stats.stats.successRate}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Geçen Öğrenci</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text mt-2">
                  {stats.stats.passedCount}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      )}

      {/* Öğrenci Listesi */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text">
            Öğrenciler
          </h2>
          <Link href="/institutions/students/add">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Öğrenci Ekle
            </Button>
          </Link>
        </div>
        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 dark:text-dark-muted mx-auto mb-4" />
            <p className="text-slate-600 dark:text-dark-muted mb-4">Henüz öğrenci eklenmemiş</p>
            <Link href="/institutions/students/add">
              <Button>İlk Öğrenciyi Ekle</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-dark-text">Ad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-dark-text">Öğrenci No</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-dark-text">E-posta</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-dark-text">Sınav Takibi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-dark-text">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-bg">
                    <td className="py-3 px-4 text-sm text-slate-900 dark:text-dark-text font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-dark-muted font-mono">{student.studentNumber || '-'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-dark-muted">{student.email || '-'}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-dark-muted">{student.examTrackings?.length || 0}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-dark-muted font-mono">
                      {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
