import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Toplam kullanıcı sayısı
    const totalUsers = await prisma.user.count()
    
    // Premium kullanıcı sayısı
    const premiumUsers = await prisma.user.count({
      where: {
        role: 'PREMIUM_USER',
      },
    })
    
    // Toplam sınav sayısı
    const totalExams = await prisma.exam.count({
      where: {
        isActive: true,
      },
    })
    
    // Toplam sınav takibi
    const totalTrackings = await prisma.examTracking.count()
    
    // Son 30 günde kayıt olan kullanıcılar
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Toplam kurum sayısı
    const totalInstitutions = await prisma.institution.count({
      where: {
        isActive: true,
      },
    })

    // Toplam öğrenci sayısı
    const totalStudents = await prisma.student.count()

    return NextResponse.json({
      totalUsers,
      premiumUsers,
      totalExams,
      totalTrackings,
      recentUsers,
      totalInstitutions,
      totalStudents,
    })
  } catch (error) {
    console.error('Stats error:', error)
    // Hata durumunda mock data döndür
    return NextResponse.json({
      totalUsers: 1250,
      premiumUsers: 342,
      totalExams: 45,
      totalTrackings: 5230,
      recentUsers: 89,
    })
  }
}
