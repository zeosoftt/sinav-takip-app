'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { formatDate, formatDateTime } from '@/lib/utils'
import { Calendar, Building2, DollarSign, ExternalLink, BookOpen, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { Exam } from '@/types'

interface Tracking {
  id: string
  applicationStatus: string | null
  notes: string | null
}

export default function ExamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false)
  const [tracking, setTracking] = useState<Tracking | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchExam()
    checkTracking()
  }, [params.id])

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exams/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setExam(data)
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkTracking = async () => {
    try {
      const res = await fetch('/api/exams/track')
      if (res.ok) {
        const trackings = await res.json()
        const currentTracking = trackings.find((t: any) => t.examId === params.id)
        if (currentTracking) {
          setIsTracking(true)
          setTracking(currentTracking)
        }
      }
    } catch (error) {
      console.error('Failed to check tracking:', error)
    }
  }

  const handleTrack = async () => {
    if (!exam) return

    setTrackingLoading(true)
    setSuccessMessage('')

    try {
      const res = await fetch('/api/exams/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          isInterested: !isTracking,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Bir hata oluştu')
        return
      }

      setIsTracking(!isTracking)
      setSuccessMessage(data.message || (isTracking ? 'Takip kaldırıldı' : 'Sınav takibe eklendi'))
      
      if (!isTracking) {
        setTracking(data.tracking)
      } else {
        setTracking(null)
      }

      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setTrackingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Sınav bulunamadı</p>
      </div>
    )
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return null
    
    const statusMap: Record<string, { label: string; color: string }> = {
      'not_applied': { label: 'Başvuru Yapılmadı', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
      'applied': { label: 'Başvuru Yapıldı', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      'completed': { label: 'Sınav Tamamlandı', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
    }
    
    const statusInfo = statusMap[status]
    if (!statusInfo) return null
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-mono ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const isApplicationOpen = exam && 
    new Date(exam.applicationStartDate) <= new Date() && 
    new Date(exam.applicationEndDate) >= new Date()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        ← Geri
      </Button>

      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg font-mono text-sm">
          {successMessage}
        </div>
      )}

      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-2">
              {exam.name}
            </h1>
            <p className="text-slate-600 dark:text-dark-muted">{exam.description || 'Sınav detayları'}</p>
            {isTracking && tracking && (
              <div className="mt-3">
                {getStatusBadge(tracking.applicationStatus)}
              </div>
            )}
          </div>
          <div className="ml-4">
            <Button 
              onClick={handleTrack} 
              variant={isTracking ? 'default' : 'outline'}
              disabled={trackingLoading}
              className="min-w-[140px]"
            >
              {trackingLoading ? (
                'İşleniyor...'
              ) : isTracking ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Takip Ediliyor
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Takip Et
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Kurum</p>
              <p className="font-semibold text-slate-900 dark:text-dark-text">{exam.institution}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Sınav Tarihi</p>
              <p className="font-semibold text-slate-900 dark:text-dark-text">{formatDate(exam.examDate)}</p>
            </div>
          </div>
          {exam.fee && (
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Sınav Ücreti</p>
                <p className="font-semibold text-slate-900 dark:text-dark-text">{exam.fee} TL</p>
              </div>
            </div>
          )}
          {exam.website && (
            <div className="flex items-start">
              <ExternalLink className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">Resmi Web Sitesi</p>
                <a
                  href={exam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Siteyi Ziyaret Et
                </a>
              </div>
            </div>
          )}
        </div>

        {isTracking && (
          <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div className="flex items-start">
              <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-dark-text mb-2">
                  Bu sınavı takip ediyorsunuz
                </h3>
                <p className="text-sm text-slate-600 dark:text-dark-muted mb-3">
                  Önemli tarihler için otomatik bildirimler alacaksınız:
                </p>
                <ul className="text-sm text-slate-600 dark:text-dark-muted space-y-1 ml-4 list-disc">
                  <li>Başvuru başlangıç tarihi (1 gün önce)</li>
                  <li>Başvuru bitiş tarihi (3 gün önce)</li>
                  <li>Sınav günü (1 gün önce)</li>
                  {exam.resultDate && <li>Sonuç açıklama tarihi (1 gün önce)</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-dark-text mb-4">
            Önemli Tarihler
          </h2>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-4 rounded-lg ${
              isApplicationOpen 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border'
            }`}>
              <div className="flex items-center">
                <Calendar className={`w-5 h-5 mr-3 ${
                  isApplicationOpen 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-slate-400 dark:text-dark-muted'
                }`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-dark-text">
                    Başvuru Başlangıç
                    {isApplicationOpen && (
                      <span className="ml-2 text-xs font-mono text-green-600 dark:text-green-400">
                        (AÇIK)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                    {formatDate(exam.applicationStartDate)}
                  </p>
                </div>
              </div>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-lg ${
              isApplicationOpen 
                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' 
                : 'bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border'
            }`}>
              <div className="flex items-center">
                <AlertCircle className={`w-5 h-5 mr-3 ${
                  isApplicationOpen 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-slate-400 dark:text-dark-muted'
                }`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-dark-text">
                    Başvuru Bitiş
                    {isApplicationOpen && (
                      <span className="ml-2 text-xs font-mono text-orange-600 dark:text-orange-400">
                        (YAKINDA KAPANACAK)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                    {formatDate(exam.applicationEndDate)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-dark-text">Sınav Tarihi</p>
                  <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                    {formatDate(exam.examDate)}
                  </p>
                </div>
              </div>
            </div>
            {exam.resultDate && (
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-slate-400 dark:text-dark-muted mr-3" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-dark-text">Sonuç Açıklama Tarihi</p>
                    <p className="text-sm text-slate-600 dark:text-dark-muted font-mono">
                      {formatDate(exam.resultDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isTracking && (
          <div className="border-t border-slate-200 dark:border-dark-border pt-6 mt-6">
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-dark-text mb-4">
              Başvuru Durumunuzu Güncelleyin
            </h3>
            <div className="flex gap-3">
              <Button
                variant={tracking?.applicationStatus === 'applied' ? 'default' : 'outline'}
                size="sm"
                onClick={async () => {
                  if (!tracking) return
                  try {
                    await fetch(`/api/exams/track/${tracking.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ applicationStatus: 'applied' }),
                    })
                    setTracking({ ...tracking, applicationStatus: 'applied' })
                  } catch (error) {
                    console.error('Failed to update status:', error)
                  }
                }}
              >
                Başvuru Yaptım
              </Button>
              <Button
                variant={tracking?.applicationStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={async () => {
                  if (!tracking) return
                  try {
                    await fetch(`/api/exams/track/${tracking.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ applicationStatus: 'completed' }),
                    })
                    setTracking({ ...tracking, applicationStatus: 'completed' })
                  } catch (error) {
                    console.error('Failed to update status:', error)
                  }
                }}
              >
                Sınavı Tamamladım
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
