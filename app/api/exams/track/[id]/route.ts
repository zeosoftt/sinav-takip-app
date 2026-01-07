import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// Sınav takibini güncelle (başvuru durumu, notlar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const body = await request.json()
      const { applicationStatus, notes } = body

      const tracking = await prisma.examTracking.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      })

      if (!tracking) {
        return NextResponse.json(
          { error: 'Takip bulunamadı' },
          { status: 404 }
        )
      }

      const updated = await prisma.examTracking.update({
        where: { id: params.id },
        data: {
          applicationStatus: applicationStatus || tracking.applicationStatus,
          notes: notes !== undefined ? notes : tracking.notes,
        },
        include: {
          exam: true,
        },
      })

      return NextResponse.json(updated)
    } catch (error) {
      console.error('Update tracking error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}

// Sınav takibini sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const tracking = await prisma.examTracking.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      })

      if (!tracking) {
        return NextResponse.json(
          { error: 'Takip bulunamadı' },
          { status: 404 }
        )
      }

      await prisma.examTracking.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Takip kaldırıldı' })
    } catch (error) {
      console.error('Delete tracking error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}
