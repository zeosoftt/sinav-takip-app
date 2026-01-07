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
          orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ students: institution.students })
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'INSTITUTION_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, studentNumber, notes } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Öğrenci adı zorunludur' },
        { status: 400 }
      )
    }

    // Kullanıcının kurumunu bul
    const institution = await prisma.institution.findFirst({
      where: { ownerId: user.id },
    })

    if (!institution) {
      return NextResponse.json(
        { error: 'Kurum bulunamadı' },
        { status: 404 }
      )
    }

    // Öğrenci oluştur
    const student = await prisma.student.create({
      data: {
        institutionId: institution.id,
        name: name.trim(),
        email: email?.toLowerCase().trim(),
        phone,
        studentNumber,
        notes,
      },
    })

    return NextResponse.json({ student }, { status: 201 })
  } catch (error: any) {
    console.error('Create student error:', error)
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
