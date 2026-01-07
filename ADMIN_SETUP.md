# Admin Sistemi Kurulumu

## Süper Admin Oluşturma

Süper admin oluşturmak için iki yöntem var:

### Yöntem 1: Script ile (Önerilen)

```bash
npm run make-admin <email> [password]
```

**Örnekler:**
```bash
# Mevcut kullanıcıyı admin yap
npm run make-admin admin@example.com

# Yeni admin kullanıcı oluştur
npm run make-admin admin@example.com admin123
```

### Yöntem 2: API ile

Eğer zaten bir admin hesabınız varsa, başka bir kullanıcıyı admin yapabilirsiniz:

```bash
curl -X POST http://localhost:3000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{"email": "user@example.com"}'
```

## Admin Özellikleri

### Admin Dashboard (`/admin/dashboard`)
- Sistem istatistikleri
- Kullanıcı yönetimi
- Sınav yönetimi
- Kurum yönetimi

### API Endpoints

#### İstatistikler
- `GET /api/admin/stats` - Sistem istatistikleri

#### Kullanıcı Yönetimi
- `GET /api/admin/users` - Tüm kullanıcıları listele
- `PATCH /api/admin/users` - Kullanıcı rolünü güncelle

#### Sınav Yönetimi
- `GET /api/admin/exams` - Tüm sınavları listele
- `POST /api/admin/exams` - Yeni sınav ekle

## Güvenlik

- Tüm admin endpoint'leri `ADMIN` rolü kontrolü yapar
- Middleware ile `/admin/*` rotaları korunur
- JWT token ile kimlik doğrulama yapılır

## İlk Admin Oluşturma

İlk admin'i oluşturmak için:

1. Önce normal bir kullanıcı kaydı yapın (veya mevcut bir kullanıcı kullanın)
2. Script ile admin yapın:
   ```bash
   npm run make-admin your-email@example.com
   ```
3. Giriş yapın ve `/admin/dashboard` sayfasına gidin

## Notlar

- Admin rolü: `ADMIN` (String olarak saklanır, SQLite kullanıldığı için)
- Admin kullanıcılar tüm sistem özelliklerine erişebilir
- Admin paneli sadece admin kullanıcılar için görünür
