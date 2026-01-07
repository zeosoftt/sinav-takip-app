import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, type, description, website, phone, address } = body

    // Validasyon
    if (!name || !email || !password || !type) {
      return NextResponse.json(
        { error: 'Kurum adı, e-posta, şifre ve kurum tipi zorunludur' },
        { status: 400 }
      )
    }

    // Email kontrolü
    const existingInstitution = await prisma.institution.findUnique({
      where: { email },
    })

    if (existingInstitution) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Kullanıcı oluştur (kurum sahibi)
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'INSTITUTION_ADMIN',
      },
    })

    // Kurum oluştur
    const institution = await prisma.institution.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        type,
        description,
        website,
        phone,
        address,
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
      },
    })

    // JWT token oluştur
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json(
      { message: 'Kurum kaydı başarılı', institution, user },
      { status: 201 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Institution register error:', error)
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
