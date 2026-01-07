'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { subscriptionPlans } from '@/lib/constants'
import { Lock } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const [planId, setPlanId] = useState('monthly')
  const plan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[0]
  
  // Get plan from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const planParam = params.get('plan')
      if (planParam) {
        setPlanId(planParam)
      }
    }
  }, [])
  
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Stripe ile ödeme işlemi
      // Şimdilik mock implementation
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
          cardData, // Gerçek uygulamada bu client-side'da işlenmemeli
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/subscription?success=true')
      } else {
        alert(data.error || 'Ödeme işlemi başarısız')
      }
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme</h1>
        <p className="text-gray-600">
          {plan.name} planı için ödeme yapın
        </p>
      </div>

      {/* Plan Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Plan</span>
          <span className="font-semibold text-gray-900">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Süre</span>
          <span className="font-semibold text-gray-900">
            {plan.period === 'ay' ? '1 Ay' : '1 Yıl'}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Toplam</span>
            <span className="text-2xl font-bold text-primary-600">{plan.price}₺</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Lock className="w-5 h-5 text-primary-600 mr-2" />
          <span className="text-sm text-gray-600">Güvenli ödeme - SSL şifreleme</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Kart Üzerindeki İsim
            </label>
            <input
              type="text"
              id="name"
              required
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
              Kart Numarası
            </label>
            <input
              type="text"
              id="number"
              required
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\s/g, '') })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Son Kullanma Tarihi
              </label>
              <input
                type="text"
                id="expiry"
                required
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                required
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Not:</strong> Bu bir demo uygulamadır. Gerçek ödeme işlemleri için Stripe 
              veya benzeri bir ödeme sağlayıcısı entegre edilmelidir.
            </p>
            <p>
              Kart bilgileriniz güvenli bir şekilde işlenir ve saklanmaz.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'İşleniyor...' : `${plan.price}₺ Öde`}
          </Button>
        </form>
      </div>
    </div>
  )
}
