'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ExamCard } from '@/components/exam/ExamCard'
import { features } from '@/lib/constants'
import { Users, TrendingUp, BookOpen, Star, Building2 } from 'lucide-react'

interface Stats {
  totalUsers: number
  premiumUsers: number
  totalExams: number
  totalTrackings: number
  recentUsers: number
  totalInstitutions?: number
  totalStudents?: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+'
    }
    return num.toString()
  }
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptLTI0IDBjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0yOC0xMmMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6bS0yNCAwYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-500/20 backdrop-blur-sm rounded-full border border-primary-400/30">
            <code className="text-sm font-mono text-primary-100">v1.0.0</code>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Tüm Devlet Sınavlarını<br />
            <span className="gradient-text bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Tek Yerden Takip Edin
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            KPSS, ALES, YDS, YKS ve daha fazlası için bildirimler alın, başvuru tarihlerini kaçırmayın
          </p>
          
          {/* Dinamik İstatistikler */}
          {stats && (
            <div className="mb-8 flex flex-wrap justify-center gap-6 text-primary-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatNumber(stats.totalUsers)}+</span>
                <span className="text-sm opacity-80">Kayıtlı Kullanıcı</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatNumber(stats.premiumUsers)}+</span>
                <span className="text-sm opacity-80">Premium Üye</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatNumber(stats.totalExams)}+</span>
                <span className="text-sm opacity-80">Aktif Sınav</span>
              </div>
              {stats.totalInstitutions && stats.totalInstitutions > 0 && (
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span className="text-lg font-semibold">{formatNumber(stats.totalInstitutions)}+</span>
                  <span className="text-sm opacity-80">Kurum</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 shadow-glow">
                Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* İstatistikler Bölümü */}
      {stats && (
        <section className="py-12 px-4 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-dark-bg dark:to-dark-surface border-y border-primary-100 dark:border-dark-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-1">
                  {loading ? '...' : formatNumber(stats.totalUsers)}+
                </div>
                <div className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                  Kayıtlı Kullanıcı
                </div>
                {stats.recentUsers > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Son 30 günde {stats.recentUsers} yeni üye
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-1">
                  {loading ? '...' : formatNumber(stats.premiumUsers)}+
                </div>
                <div className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                  Premium Üye
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                  %{stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0} memnuniyet
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-1">
                  {loading ? '...' : formatNumber(stats.totalExams)}+
                </div>
                <div className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                  Aktif Sınav
                </div>
                <div className="text-xs text-slate-500 dark:text-dark-muted mt-1">
                  Güncel takvim
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-1">
                  {loading ? '...' : formatNumber(stats.totalTrackings)}+
                </div>
                <div className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                  Sınav Takibi
                </div>
                <div className="text-xs text-slate-500 dark:text-dark-muted mt-1">
                  Aktif takipler
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-slate-900 dark:text-dark-text">
            Neden Sınav Takip?
          </h2>
          <p className="text-center text-slate-600 dark:text-dark-muted mb-12 max-w-2xl mx-auto">
            Modern teknoloji ile geliştirilmiş, güvenilir sınav takip platformu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 group hover:border-primary-500/50 transition-all">
                <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-slate-900 dark:text-dark-text">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-dark-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-slate-900 dark:text-dark-text">
            Takip Edebileceğiniz Sınavlar
          </h2>
          <p className="text-center text-slate-600 dark:text-dark-muted mb-12 max-w-2xl mx-auto">
            Türkiye'de yapılan tüm devlet sınavlarını takip edin
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['KPSS', 'ALES', 'YDS', 'YKS', 'DGS', 'TUS', 'STS', 'EKPSS', 'Memur Sınavları', 'Diğer'].map((exam) => (
              <div key={exam} className="card p-4 text-center hover:border-primary-500/50 transition-all group">
                <span className="font-display font-semibold text-slate-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {exam}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal Özellikler Bölümü */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-dark-bg dark:to-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
              <code className="text-sm font-mono text-indigo-700 dark:text-indigo-400">KURUMSAL ÇÖZÜMLER</code>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-slate-900 dark:text-dark-text">
              Eğitim Kurumları ve Eğitmenler İçin
            </h2>
            <p className="text-lg text-slate-600 dark:text-dark-muted max-w-3xl mx-auto">
              Öğrencilerinizi ekleyin, sınav takiplerini yönetin ve detaylı istatistiklere ulaşın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-display font-semibold mb-2 text-slate-900 dark:text-dark-text">
                Öğrenci Yönetimi
              </h3>
              <p className="text-slate-600 dark:text-dark-muted text-sm">
                Öğrencilerinizi kolayca ekleyin ve yönetin. Toplu import desteği ile hızlı başlayın.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-display font-semibold mb-2 text-slate-900 dark:text-dark-text">
                Detaylı İstatistikler
              </h3>
              <p className="text-slate-600 dark:text-dark-muted text-sm">
                Öğrenci başarı oranları, sınav takip durumları ve performans analizleri.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-display font-semibold mb-2 text-slate-900 dark:text-dark-text">
                Sınav Takibi
              </h3>
              <p className="text-slate-600 dark:text-dark-muted text-sm">
                Her öğrencinin sınav durumunu takip edin, başvuru ve sonuç bilgilerini görüntüleyin.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/institutions/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-glow">
                Kurum Olarak Kayıt Ol
              </Button>
            </Link>
            <p className="text-sm text-slate-500 dark:text-dark-muted mt-4">
              Zaten kurum hesabınız var mı?{' '}
              <Link href="/institutions/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptLTI0IDBjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0yOC0xMmMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6bS0yNCAwYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Sınav Fırsatlarını Kaçırmayın
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Premium üyelik ile tüm özelliklere erişin ve sınav takibinizi kolaylaştırın
          </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 shadow-glow">
              Fiyatları Görüntüle
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
