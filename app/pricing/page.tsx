'use client'

import { Button } from '@/components/ui/Button'
import { subscriptionPlans } from '@/lib/constants'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const handleSubscribe = (planId: string) => {
    window.location.href = `/payment?plan=${planId}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Fiyatlandırma</h1>
        <p className="text-xl text-gray-600">
          Size uygun planı seçin ve tüm özelliklere erişin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg border-2 p-8 ${
              plan.popular
                ? 'border-primary-600 shadow-xl scale-105'
                : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                En Popüler
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{plan.price}₺</span>
              <span className="text-gray-600"> / {plan.period}</span>
              {plan.originalPrice && (
                <div className="mt-2">
                  <span className="text-gray-400 line-through">{plan.originalPrice}₺</span>
                  <span className="ml-2 text-green-600 font-semibold">%{plan.discount} indirim</span>
                </div>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              onClick={() => handleSubscribe(plan.id)}
            >
              {plan.id === 'monthly' ? 'Aylık Planı Seç' : 'Yıllık Planı Seç'}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Tüm planlar 7 gün ücretsiz deneme içerir. İstediğiniz zaman iptal edebilirsiniz.
        </p>
        <p className="text-sm text-gray-500">
          Ödeme güvenli bir şekilde işlenir. Kredi kartı bilgileriniz saklanmaz.
        </p>
      </div>
    </div>
  )
}
