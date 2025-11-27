# Panduan Testing Notifikasi Email

## ✅ Fitur yang Sudah Diimplementasikan

Sistem akan mengirim email notifikasi ke applicant setiap kali status pengajuan berubah:

### Notifikasi yang Dikirim:
1. **Disetujui SCO** - Ketika SCO approve (untuk ruang non-Aula)
2. **Diteruskan ke WD2** - Ketika SCO forward ke WD (untuk Aula)
3. **Ditolak SCO** - Ketika SCO reject
4. **Disetujui WD2** - Ketika WD approve
5. **Ditolak WD2** - Ketika WD reject

### Email Berisi:
- Subject yang jelas
- Status pengajuan (approved/rejected/forwarded)
- Detail lengkap (ruangan, organisasi, tanggal, waktu, acara)
- Catatan dari SCO/WD (jika ada)
- Link untuk melihat detail di halaman Riwayat

---

## 🧪 Cara Testing

### Opsi 1: Testing dengan LOG (Paling Mudah - RECOMMENDED)

**File `.env` sudah diset ke `log` secara default**, jadi email akan ditulis ke file log.

1. **Cek konfigurasi** di `.env`:
   ```env
   MAIL_MAILER=log
   ```

2. **Buat pengajuan dan approve/reject** sebagai SCO atau WD

3. **Cek log email** di:
   ```
   storage/logs/laravel.log
   ```
   
   Atau gunakan command:
   ```bash
   php artisan tail
   ```

4. Email akan terlihat seperti:
   ```
   [2025-11-26 10:00:00] local.DEBUG: Subject: Pengajuan Peminjaman Ruangan Disetujui
   To: user@example.com
   Body: Halo John Doe, Pengajuan peminjaman ruangan Anda telah disetujui...
   ```

---

### Opsi 2: Testing dengan Mailtrap (Lebih Visual)

1. **Daftar akun gratis** di [Mailtrap.io](https://mailtrap.io)

2. **Update `.env`**:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_username
   MAIL_PASSWORD=your_mailtrap_password
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS="noreply@pinjamft.unsoed.ac.id"
   MAIL_FROM_NAME="PINJAM FT Unsoed"
   ```

3. **Clear config cache**:
   ```bash
   php artisan config:clear
   ```

4. **Testing**: Buat pengajuan dan approve/reject

5. **Lihat email** di inbox Mailtrap Anda (tampilan HTML lengkap)

---

### Opsi 3: Testing dengan Gmail SMTP (Production-like)

⚠️ **Harus setup App Password di Google**

1. **Enable 2FA** di akun Gmail Anda

2. **Buat App Password**:
   - Buka: https://myaccount.google.com/apppasswords
   - Generate password untuk "Mail"

3. **Update `.env`**:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-digit-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="your-email@gmail.com"
   MAIL_FROM_NAME="PINJAM FT Unsoed"
   ```

4. **Clear config cache**:
   ```bash
   php artisan config:clear
   ```

5. **Testing**: Email akan terkirim ke inbox Gmail yang sebenarnya

---

## 🔍 Cara Verifikasi Email Terkirim

### Cek Queue (karena menggunakan ShouldQueue)

Email dikirim secara asynchronous melalui queue system.

1. **Cek konfigurasi queue** di `.env`:
   ```env
   QUEUE_CONNECTION=database
   ```

2. **Jalankan queue worker**:
   ```bash
   php artisan queue:work
   ```
   
   Atau untuk testing sekali jalan:
   ```bash
   php artisan queue:work --once
   ```

3. **Monitor queue**:
   ```bash
   # Lihat jobs yang pending
   SELECT * FROM jobs;
   
   # Lihat jobs yang failed
   php artisan queue:failed
   ```

### Cek Log Laravel

```bash
tail -f storage/logs/laravel.log
```

Atau di Windows PowerShell:
```powershell
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

---

## 📋 Skenario Testing Lengkap

### 1. Test Approval SCO (Non-Aula)
- Login sebagai Applicant → Buat pengajuan ruang non-Aula
- Login sebagai SCO → Approve pengajuan
- **Ekspektasi**: Email "Disetujui" terkirim ke applicant

### 2. Test Forward ke WD (Aula)
- Login sebagai Applicant → Buat pengajuan Aula
- Login sebagai SCO → Forward ke WD
- **Ekspektasi**: Email "Diteruskan ke WD2" terkirim

### 3. Test Approval WD
- Lanjutkan dari skenario 2
- Login sebagai WD → Approve
- **Ekspektasi**: Email "Disetujui WD2" terkirim

### 4. Test Rejection SCO
- Login sebagai Applicant → Buat pengajuan
- Login sebagai SCO → Reject dengan catatan
- **Ekspektasi**: Email "Ditolak" dengan catatan terkirim

### 5. Test Rejection WD
- Login sebagai Applicant → Buat pengajuan Aula
- Login sebagai SCO → Forward
- Login sebagai WD → Reject dengan catatan
- **Ekspektasi**: Email "Ditolak WD2" dengan catatan terkirim

---

## 🚀 Quick Start (RECOMMENDED)

**Untuk testing cepat tanpa setup eksternal:**

1. Pastikan `.env` sudah ada:
   ```env
   MAIL_MAILER=log
   QUEUE_CONNECTION=sync
   ```

2. Jika ingin sync (langsung kirim tanpa queue), ubah:
   ```env
   QUEUE_CONNECTION=sync
   ```

3. Atau tetap pakai queue, jalankan:
   ```bash
   php artisan queue:work --once
   ```

4. Buat pengajuan dan approve/reject

5. Lihat email di `storage/logs/laravel.log`

---

## 🐛 Troubleshooting

### Email tidak terkirim?

1. **Cek queue jobs**:
   ```bash
   php artisan queue:work --once
   ```

2. **Cek failed jobs**:
   ```bash
   php artisan queue:failed
   php artisan queue:retry all
   ```

3. **Cek log error**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Clear cache**:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Email masuk spam?

- Gunakan Mailtrap untuk development
- Untuk production, gunakan email service profesional (SendGrid, Mailgun, SES)

---

## ✅ Checklist Testing

- [ ] Email terkirim saat SCO approve
- [ ] Email terkirim saat SCO forward ke WD
- [ ] Email terkirim saat SCO reject
- [ ] Email terkirim saat WD approve
- [ ] Email terkirim saat WD reject
- [ ] Email berisi detail yang benar
- [ ] Catatan SCO/WD muncul di email (jika ada)
- [ ] Link "Lihat Detail" berfungsi
- [ ] Email dikirim ke applicant yang benar

---

**Status**: ✅ Fitur sudah siap untuk testing!
