'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Calendar, CreditCard } from 'lucide-react'

interface Subscription {
  id: string
  status: string
  planType: string
  startDate: Date
  endDate: Date
  price: number
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API'den abonelik bilgisini çek
    setLoading(false)
  }, [])

  const handleCancel = async () => {
    if (confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz?')) {
      // TODO: API'ye iptal isteği gönder
      console.log('Cancel subscription')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Aktif Aboneliğiniz Yok
          </h2>
          <p className="text-gray-600 mb-8">
            Premium özelliklere erişmek için bir abonelik planı seçin
          </p>
          <Link href="/pricing">
            <Button>Plan Seç</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isActive = subscription.status === 'ACTIVE' || subscription.status === 'TRIAL'
  const isExpiringSoon = new Date(subscription.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Abonelik Yönetimi</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {subscription.planType === 'monthly' ? 'Aylık Plan' : 'Yıllık Plan'}
            </h2>
            <div className="flex items-center mt-2">
              {isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Aktif
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <XCircle className="w-4 h-4 mr-1" />
                  {subscription.status === 'EXPIRED' ? 'Süresi Dolmuş' : 'İptal Edilmiş'}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{subscription.price}₺</p>
            <p className="text-gray-600">
              / {subscription.planType === 'monthly' ? 'ay' : 'yıl'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Başlangıç Tarihi</p>
              <p className="font-semibold text-gray-900">{formatDate(subscription.startDate)}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Bitiş Tarihi</p>
              <p className={`font-semibold ${isExpiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                {formatDate(subscription.endDate)}
              </p>
              {isExpiringSoon && isActive && (
                <p className="text-sm text-orange-600 mt-1">Yakında sona erecek</p>
              )}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="border-t border-gray-200 pt-6">
            <Button variant="outline" onClick={handleCancel}>
              Aboneliği İptal Et
            </Button>
          </div>
        )}

        {!isActive && (
          <div className="border-t border-gray-200 pt-6">
            <Link href="/pricing">
              <Button>Yeni Plan Seç</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Premium Özellikler</h3>
        <ul className="space-y-2 text-blue-800">
          <li>✓ Tüm sınav takvimi</li>
          <li>✓ Otomatik bildirimler</li>
          <li>✓ Kişisel sınav takibi</li>
          <li>✓ 7/24 müşteri desteği</li>
        </ul>
      </div>
    </div>
  )
}
