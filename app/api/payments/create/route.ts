import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { subscriptionPlans } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  return requireAuth(async (req, user) => {
    try {
      const body = await request.json()
      const { planId, amount } = body

      const plan = subscriptionPlans.find((p) => p.id === planId)
      if (!plan) {
        return NextResponse.json(
          { error: 'Geçersiz plan' },
          { status: 400 }
        )
      }

      if (amount !== plan.price) {
        return NextResponse.json(
          { error: 'Fiyat uyuşmazlığı' },
          { status: 400 }
        )
      }

      // TODO: Stripe ile ödeme işlemi
      // Şimdilik mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Aboneliği oluştur
      const endDate = new Date()
      if (planId === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1)
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          planType: planId,
          price: plan.price,
          paymentId,
          endDate,
          status: 'ACTIVE',
        },
      })

      // Kullanıcı rolünü güncelle
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'PREMIUM_USER' },
      })

      return NextResponse.json({
        success: true,
        subscription,
        paymentId,
      })
    } catch (error) {
      console.error('Payment error:', error)
      return NextResponse.json(
        { error: 'Ödeme işlemi başarısız' },
        { status: 500 }
      )
    }
  })(request)
}
