import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'INSTITUTION_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Kullanıcının kurumunu bul
    const institution = await prisma.institution.findFirst({
      where: { ownerId: user.id },
      include: {
        students: {
          include: {
            examTrackings: {
              include: {
                exam: true,
              },
            },
          },
        },
      },
    })

    if (!institution) {
      return NextResponse.json(
        { error: 'Kurum bulunamadı' },
        { status: 404 }
      )
    }

    const students = institution.students
    const totalStudents = students.length
    const totalTrackings = students.reduce((sum, s) => sum + s.examTrackings.length, 0)
    
    // Sınav başarı istatistikleri
    const appliedCount = students.reduce((sum, s) => 
      sum + s.examTrackings.filter(t => t.applicationStatus === 'applied' || t.applicationStatus === 'completed').length, 0
    )
    const passedCount = students.reduce((sum, s) => 
      sum + s.examTrackings.filter(t => t.applicationStatus === 'passed').length, 0
    )
    const failedCount = students.reduce((sum, s) => 
      sum + s.examTrackings.filter(t => t.applicationStatus === 'failed').length, 0
    )

    // Son 30 günde eklenen öğrenciler
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentStudents = students.filter(s => s.createdAt >= thirtyDaysAgo).length

    return NextResponse.json({
      institution: {
        id: institution.id,
        name: institution.name,
        type: institution.type,
      },
      stats: {
        totalStudents,
        totalTrackings,
        appliedCount,
        passedCount,
        failedCount,
        recentStudents,
        successRate: appliedCount > 0 ? Math.round((passedCount / appliedCount) * 100) : 0,
      },
    })
  } catch (error) {
    console.error('Get institution stats error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
