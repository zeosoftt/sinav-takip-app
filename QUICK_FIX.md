# Prisma EPERM Hatası - Hızlı Çözüm

## ⚠️ ÖNEMLİ: PowerShell'i YÖNETİCİ OLARAK açın!

### Yöntem 1: Otomatik Script (Önerilen)

1. **PowerShell'i YÖNETİCİ OLARAK açın:**
   - Windows tuşuna basın
   - "PowerShell" yazın
   - Sağ tıklayın → **"Yönetici olarak çalıştır"**

2. Proje klasörüne gidin:
   ```powershell
   cd C:\Users\zelih\Desktop\sinav-takip-app
   ```

3. Script'i çalıştırın:
   ```powershell
   .\fix-prisma.ps1
   ```

### Yöntem 2: Manuel Adımlar

PowerShell'i **YÖNETİCİ OLARAK** açtıktan sonra:

```powershell
# 1. Node süreçlerini kapat
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 2. .prisma klasörünü sil
Remove-Item -Path "node_modules\.prisma" -Recurse -Force

# 3. 2 saniye bekle
Start-Sleep -Seconds 2

# 4. Prisma generate
npm run db:generate
```

### Yöntem 3: Windows Defender İstisnası

1. **Windows Güvenlik** → **Virüs ve tehdit koruması**
2. **"Virüs ve tehdit koruması ayarlarını yönet"**
3. **"Dışlamalar"** → **"Dışlama ekle veya kaldır"**
4. **"Klasör"** seçin ve şu klasörü ekleyin:
   ```
   C:\Users\zelih\Desktop\sinav-takip-app\node_modules\.prisma
   ```

### Yöntem 4: Node Modules'ü Yeniden Yükleme

```powershell
# PowerShell'i YÖNETİCİ OLARAK açın
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install
npm run db:generate
```

## Neden Bu Hata Oluşuyor?

Windows Defender veya antivirus yazılımı, Prisma'nın oluşturduğu `.dll.node` dosyasını tararken kilitleyebilir. Bu yüzden dosya yeniden adlandırılamaz.

## Hala Çalışmıyor mu?

1. ✅ PowerShell'i **YÖNETİCİ OLARAK** açtınız mı?
2. ✅ Windows Defender'ı geçici olarak kapattınız mı?
3. ✅ Tüm Node.js süreçlerini kapattınız mı?
4. ✅ Proje klasörünü antivirus istisnalarına eklediniz mi?

Eğer hala sorun yaşıyorsanız, `TROUBLESHOOTING.md` dosyasına bakın.
