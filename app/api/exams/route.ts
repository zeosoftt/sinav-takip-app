import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {
      isActive: true,
    }

    if (type && type !== 'ALL') {
      where.type = type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { institution: { contains: search, mode: 'insensitive' } },
      ]
    }

    const exams = await prisma.exam.findMany({
      where,
      orderBy: {
        examDate: 'asc',
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
    const body = await request.json()
    // TODO: Admin kontrolü ekle

    const exam = await prisma.exam.create({
      data: body,
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('Create exam error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
