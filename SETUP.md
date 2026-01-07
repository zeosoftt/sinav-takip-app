# Kurulum Talimatları

## Gereksinimler

- Node.js 18+ 
- PostgreSQL veritabanı
- npm veya yarn

## Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

## Adım 2: Veritabanı Kurulumu

1. PostgreSQL veritabanı oluşturun:
```sql
CREATE DATABASE sinav_takip;
```

2. `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sinav_takip?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
```

3. Prisma client'ı oluşturun:
```bash
npm run db:generate
```

4. Veritabanı şemasını uygulayın:
```bash
npm run db:push
```

5. (Opsiyonel) Örnek verileri yükleyin:
```bash
npm run db:seed
```

## Adım 3: Uygulamayı Çalıştırın

Geliştirme modu:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Önemli Notlar

### Authentication
- Şu anda authentication sistemi temel seviyede implement edilmiştir
- Production için JWT token yönetimi ve cookie güvenliği eklenmelidir
- NextAuth.js tam entegrasyonu yapılmalıdır

### Ödeme Sistemi
- Stripe entegrasyonu için gerçek API key'ler eklenmelidir
- Test modunda çalışmak için Stripe test key'leri kullanılabilir
- Production'da gerçek kart bilgileri client-side'da işlenmemelidir

### Bildirimler
- Bildirim sistemi için cron job veya scheduled task eklenmelidir
- Email bildirimleri için SMTP yapılandırması gerekir
- Push notification için service worker eklenebilir

### Sınav Verileri
- Sınav verileri manuel olarak eklenebilir veya API ile senkronize edilebilir
- ÖSYM veya diğer kurumların API'leri entegre edilebilir

## Production Deployment

1. Environment variables'ları production değerleriyle güncelleyin
2. Database migration'ları çalıştırın
3. Build alın: `npm run build`
4. Start: `npm start`

## Güvenlik Kontrol Listesi

- [ ] JWT token güvenliği
- [ ] Rate limiting
- [ ] CORS yapılandırması
- [ ] SQL injection koruması (Prisma ile otomatik)
- [ ] XSS koruması
- [ ] HTTPS zorunluluğu
- [ ] Environment variables güvenliği
- [ ] Database backup stratejisi
