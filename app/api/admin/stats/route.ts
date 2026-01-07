import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Tüm istatistikleri topla
    const [
      totalUsers,
      totalInstitutions,
      totalExams,
      totalStudents,
      premiumUsers,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.institution.count({ where: { isActive: true } }),
      prisma.exam.count({ where: { isActive: true } }),
      prisma.student.count(),
      prisma.user.count({ where: { role: 'PREMIUM_USER' } }),
      prisma.subscription.count({ 
        where: { 
          status: { in: ['ACTIVE', 'TRIAL'] } 
        } 
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalInstitutions,
      totalExams,
      totalStudents,
      premiumUsers,
      activeSubscriptions,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
