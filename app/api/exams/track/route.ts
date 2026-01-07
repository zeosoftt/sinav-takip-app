import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  return requireAuth(async (req, user) => {
    try {
      const body = await request.json()
      const { examId, isInterested } = body

      if (!examId) {
        return NextResponse.json(
          { error: 'Sınav ID gereklidir' },
          { status: 400 }
        )
      }

      // Sınavı kontrol et
      const exam = await prisma.exam.findUnique({
        where: { id: examId },
      })

      if (!exam) {
        return NextResponse.json(
          { error: 'Sınav bulunamadı' },
          { status: 404 }
        )
      }

      // Sınav takibini oluştur veya güncelle
      const tracking = await prisma.examTracking.upsert({
        where: {
          userId_examId: {
            userId: user.id,
            examId,
          },
        },
        update: {
          isInterested: isInterested ?? true,
        },
        create: {
          userId: user.id,
          examId,
          isInterested: isInterested ?? true,
          applicationStatus: 'not_applied',
        },
        include: {
          exam: true,
        },
      })

      // Eğer yeni takip oluşturulduysa, bildirimler oluştur
      if (isInterested !== false) {
        const now = new Date()
        
        // Başvuru başlangıç bildirimi (1 gün önce)
        const applicationStartReminder = new Date(exam.applicationStartDate)
        applicationStartReminder.setDate(applicationStartReminder.getDate() - 1)
        if (applicationStartReminder > now) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: `${exam.name} - Başvuru Başlıyor`,
              message: `Başvurular ${new Date(exam.applicationStartDate).toLocaleDateString('tr-TR')} tarihinde başlayacak.`,
              type: 'application_deadline',
              relatedExamId: exam.id,
            },
          })
        }

        // Başvuru bitiş bildirimi (3 gün önce)
        const applicationEndReminder = new Date(exam.applicationEndDate)
        applicationEndReminder.setDate(applicationEndReminder.getDate() - 3)
        if (applicationEndReminder > now) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: `${exam.name} - Başvuru Son Günler`,
              message: `Başvurular ${new Date(exam.applicationEndDate).toLocaleDateString('tr-TR')} tarihinde sona erecek.`,
              type: 'application_deadline',
              relatedExamId: exam.id,
            },
          })
        }

        // Sınav günü hatırlatması (1 gün önce)
        const examReminder = new Date(exam.examDate)
        examReminder.setDate(examReminder.getDate() - 1)
        if (examReminder > now) {
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: `${exam.name} - Yarın Sınav`,
              message: `Sınav ${new Date(exam.examDate).toLocaleDateString('tr-TR')} tarihinde yapılacak.`,
              type: 'exam_reminder',
              relatedExamId: exam.id,
            },
          })
        }

        // Sonuç açıklama bildirimi (eğer tarih belirtilmişse)
        if (exam.resultDate) {
          const resultReminder = new Date(exam.resultDate)
          resultReminder.setDate(resultReminder.getDate() - 1)
          if (resultReminder > now) {
            await prisma.notification.create({
              data: {
                userId: user.id,
                title: `${exam.name} - Sonuç Açıklanıyor`,
                message: `Sonuçlar ${new Date(exam.resultDate).toLocaleDateString('tr-TR')} tarihinde açıklanacak.`,
                type: 'result_announced',
                relatedExamId: exam.id,
              },
            })
          }
        }
      }

      return NextResponse.json({
        tracking,
        message: isInterested !== false ? 'Sınav takibe eklendi. Bildirimler otomatik oluşturuldu.' : 'Sınav takipten çıkarıldı.',
      })
    } catch (error) {
      console.error('Track exam error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}

export async function GET(request: NextRequest) {
  return requireAuth(async (req, user) => {
    try {
      const trackings = await prisma.examTracking.findMany({
        where: {
          userId: user.id,
          isInterested: true,
        },
        include: {
          exam: true,
        },
        orderBy: {
          exam: {
            examDate: 'asc',
          },
        },
      })

      return NextResponse.json(trackings)
    } catch (error) {
      console.error('Get tracked exams error:', error)
      return NextResponse.json(
        { error: 'Bir hata oluştu' },
        { status: 500 }
      )
    }
  })(request)
}
