# Prisma Generate Sorun Çözücü Script
# PowerShell'i YÖNETİCİ OLARAK açın ve bu scripti çalıştırın

Write-Host "Prisma Generate Sorun Çözücü" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Tüm Node süreçlerini kontrol et
Write-Host "[1/5] Node.js süreçlerini kontrol ediliyor..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"}
if ($nodeProcesses) {
    Write-Host "   Bulunan Node.js süreçleri kapatılıyor..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 2. .prisma klasörünü temizle
Write-Host "[2/5] .prisma klasörü temizleniyor..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 3. Geçici dosyaları temizle
Write-Host "[3/5] Geçici dosyalar temizleniyor..." -ForegroundColor Yellow
Get-ChildItem -Path "node_modules\.prisma" -Recurse -Filter "*.tmp*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path "node_modules\.prisma" -Recurse -Filter "*.node" -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $_.IsReadOnly = $false
        Remove-Item $_.FullName -Force -ErrorAction Stop
    } catch {
        Write-Host "   Uyarı: $($_.Name) silinemedi (kullanımda olabilir)" -ForegroundColor Red
    }
}

# 4. Prisma cache'i temizle
Write-Host "[4/5] Prisma cache temizleniyor..." -ForegroundColor Yellow
$prismaCache = "$env:APPDATA\Prisma"
if (Test-Path $prismaCache) {
    Remove-Item -Path "$prismaCache\*" -Recurse -Force -ErrorAction SilentlyContinue
}

# 5. Prisma generate
Write-Host "[5/5] Prisma generate çalıştırılıyor..." -ForegroundColor Yellow
Write-Host ""
try {
    npx prisma generate --schema=./prisma/schema.prisma
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Başarılı! Prisma client oluşturuldu." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Hata oluştu. Lütfen şunları deneyin:" -ForegroundColor Red
        Write-Host "  1. Windows Defender'ı geçici olarak kapatın" -ForegroundColor Yellow
        Write-Host "  2. Antivirus yazılımınızı kontrol edin" -ForegroundColor Yellow
        Write-Host "  3. Proje klasörünü antivirus istisnalarına ekleyin" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "✗ Hata: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Script tamamlandı." -ForegroundColor Cyan
