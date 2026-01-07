# Sorun Giderme Rehberi

## Prisma Generate Hatası (EPERM)

Windows'ta `npm run db:generate` komutu çalıştırırken "EPERM: operation not permitted" hatası alıyorsanız, aşağıdaki çözümleri deneyin:

### Çözüm 1: Yönetici Olarak Çalıştırma

1. PowerShell'i **Yönetici olarak** açın (sağ tık → "Yönetici olarak çalıştır")
2. Proje klasörüne gidin:
   ```powershell
   cd C:\Users\zelih\Desktop\sinav-takip-app
   ```
3. Komutu tekrar çalıştırın:
   ```powershell
   npm run db:generate
   ```

### Çözüm 2: Antivirus/Windows Defender'ı Geçici Olarak Kapatma

1. Windows Defender veya antivirus yazılımınızı geçici olarak kapatın
2. `node_modules\.prisma` klasörünü silin:
   ```powershell
   Remove-Item -Path "node_modules\.prisma" -Recurse -Force
   ```
3. Komutu tekrar çalıştırın:
   ```powershell
   npm run db:generate
   ```

### Çözüm 3: Node Modules'ü Yeniden Yükleme

1. `node_modules` klasörünü silin:
   ```powershell
   Remove-Item -Path "node_modules" -Recurse -Force
   ```
2. `package-lock.json` dosyasını silin (varsa)
3. Bağımlılıkları yeniden yükleyin:
   ```powershell
   npm install
   ```
4. Prisma'yı generate edin:
   ```powershell
   npm run db:generate
   ```

### Çözüm 4: Prisma'yı Global Yükleme

```powershell
npm install -g prisma
npx prisma generate
```

### Çözüm 5: Windows Defender İstisnası Ekleme

1. Windows Güvenlik → Virüs ve tehdit koruması
2. "Virüs ve tehdit koruması ayarlarını yönet"
3. "Dışlamalar" → "Dışlama ekle veya kaldır"
4. Proje klasörünü ekleyin: `C:\Users\zelih\Desktop\sinav-takip-app`

### Çözüm 6: Manuel Dosya Silme

1. Tüm Node.js süreçlerini kapatın
2. `node_modules\.prisma\client` klasöründeki `.tmp` ve `.node` dosyalarını manuel olarak silin
3. Komutu tekrar çalıştırın

## Diğer Yaygın Sorunlar

### Port Zaten Kullanılıyor

```powershell
# Port 3000'i kullanan süreci bul
netstat -ano | findstr :3000

# Süreci sonlandır (PID'yi değiştirin)
taskkill /PID <PID> /F
```

### Database Bağlantı Hatası

`.env` dosyasını kontrol edin ve `DATABASE_URL` değişkeninin doğru olduğundan emin olun.

### Module Bulunamadı

```powershell
npm install
```

## Hala Sorun mu Var?

1. Node.js sürümünüzü kontrol edin: `node --version` (18+ olmalı)
2. npm sürümünüzü kontrol edin: `npm --version`
3. Prisma sürümünüzü kontrol edin: `npx prisma --version`
