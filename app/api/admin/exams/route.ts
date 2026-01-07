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

    const exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: {
            trackings: true,
            studentTrackings: true,
          },
        },
      },
      orderBy: {
        examDate: 'desc',
      },
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('Get exams error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      description,
      institution,
      applicationStartDate,
      applicationEndDate,
      examDate,
      resultDate,
      fee,
      website,
    } = body

    if (!name || !type || !institution || !applicationStartDate || !applicationEndDate || !examDate) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanlar doldurulmalıdır' },
        { status: 400 }
      )
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        type,
        description,
        institution,
        applicationStartDate: new Date(applicationStartDate),
        applicationEndDate: new Date(applicationEndDate),
        examDate: new Date(examDate),
        resultDate: resultDate ? new Date(resultDate) : null,
        fee: fee ? parseFloat(fee) : null,
        website,
        isActive: true,
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error: any) {
    console.error('Create exam error:', error)
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
