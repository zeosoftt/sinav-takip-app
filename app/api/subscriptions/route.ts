import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  return requireAuth(async (req, user) => {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: {
            in: ['ACTIVE', 'TRIAL'],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(subscription)
    } catch (error) {
      console.error('Get subscription error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request: NextRequest) {
  return requireAuth(async (req, user) => {
    try {
      const body = await request.json()
      const { planType, paymentId } = body

      if (!planType || !paymentId) {
        return NextResponse.json(
          { error: 'Plan tipi ve ödeme ID gereklidir' },
          { status: 400 }
        )
      }

      // Plan fiyatını hesapla
      const price = planType === 'monthly' ? 99 : 999
      const endDate = new Date()
      if (planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1)
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      // Aboneliği oluştur
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          planType,
          price,
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

      return NextResponse.json(subscription, { status: 201 })
    } catch (error) {
      console.error('Create subscription error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}
