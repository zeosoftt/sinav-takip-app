import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email) {
    console.error('Kullanım: npm run make-admin <email> [password]')
    console.error('Örnek: npm run make-admin admin@example.com admin123')
    process.exit(1)
  }

  try {
    // Kullanıcıyı bul
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Mevcut kullanıcıyı admin yap
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'ADMIN',
            password: hashedPassword,
          },
        })
        console.log(`✓ Kullanıcı admin yapıldı ve şifre güncellendi: ${email}`)
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        })
        console.log(`✓ Kullanıcı admin yapıldı: ${email}`)
      }
    } else {
      // Yeni admin kullanıcı oluştur
      if (!password) {
        console.error('Yeni kullanıcı için şifre gereklidir!')
        process.exit(1)
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          role: 'ADMIN',
        },
      })
      console.log(`✓ Yeni admin kullanıcı oluşturuldu: ${email}`)
    }

    console.log(`\nAdmin bilgileri:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  ID: ${user.id}\n`)
  } catch (error: any) {
    console.error('Hata:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
