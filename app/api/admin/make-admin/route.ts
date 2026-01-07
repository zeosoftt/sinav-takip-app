import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Süper admin oluşturma endpoint'i
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    // İlk admin oluşturulurken veya mevcut admin tarafından
    const body = await request.json()
    const { email, password } = body

    // Eğer kullanıcı zaten admin ise, başka birini admin yapabilir
    if (user && user.role === 'ADMIN') {
      if (!email) {
        return NextResponse.json(
          { error: 'E-posta gereklidir' },
          { status: 400 }
        )
      }

      const targetUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Kullanıcı bulunamadı' },
          { status: 404 }
        )
      }

      await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'ADMIN' },
      })

      return NextResponse.json({ 
        message: `${email} kullanıcısı admin yapıldı`,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          role: 'ADMIN',
        },
      })
    }

    // İlk admin oluşturma (şifre ile)
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Mevcut kullanıcıyı admin yap
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'ADMIN' },
      })

      return NextResponse.json({
        message: 'Kullanıcı admin yapıldı',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: 'ADMIN',
        },
      })
    }

    // Yeni admin kullanıcı oluştur
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0],
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({
      message: 'Admin kullanıcı oluşturuldu',
      user: newAdmin,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Make admin error:', error)
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
