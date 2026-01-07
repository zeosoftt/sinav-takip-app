import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Örnek sınavlar ekle
  const exams = [
    {
      name: '2024 KPSS Lisans Genel Yetenek - Genel Kültür',
      type: 'KPSS',
      institution: 'ÖSYM',
      description: 'Kamu Personeli Seçme Sınavı Lisans Genel Yetenek - Genel Kültür',
      applicationStartDate: new Date('2024-01-15'),
      applicationEndDate: new Date('2024-02-15'),
      examDate: new Date('2024-07-07'),
      resultDate: new Date('2024-08-15'),
      fee: 150,
      website: 'https://www.osym.gov.tr',
      isActive: true,
    },
    {
      name: '2024 ALES İlkbahar Dönemi',
      type: 'ALES',
      institution: 'ÖSYM',
      description: 'Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı',
      applicationStartDate: new Date('2024-02-01'),
      applicationEndDate: new Date('2024-02-28'),
      examDate: new Date('2024-05-05'),
      resultDate: new Date('2024-06-01'),
      fee: 200,
      website: 'https://www.osym.gov.tr',
      isActive: true,
    },
    {
      name: '2024 YDS İlkbahar Dönemi',
      type: 'YDS',
      institution: 'ÖSYM',
      description: 'Yabancı Dil Bilgisi Seviye Tespit Sınavı',
      applicationStartDate: new Date('2024-01-20'),
      applicationEndDate: new Date('2024-02-20'),
      examDate: new Date('2024-04-14'),
      resultDate: new Date('2024-05-01'),
      fee: 180,
      website: 'https://www.osym.gov.tr',
      isActive: true,
    },
  ]

  for (const exam of exams) {
    await prisma.exam.upsert({
      where: {
        name_institution: {
          name: exam.name,
          institution: exam.institution,
        },
      },
      update: exam,
      create: exam,
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
