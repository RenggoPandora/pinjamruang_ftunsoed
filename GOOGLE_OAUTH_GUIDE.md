# Panduan Google OAuth Login

## ✅ Fitur yang Sudah Diimplementasikan

Sistem sudah mendukung login menggunakan akun Google tanpa perlu registrasi manual!

### Yang Sudah Ada:
1. ✅ **Backend Controller** - `GoogleAuthController.php`
2. ✅ **Routes** - `/auth/google` dan `/auth/google/callback`
3. ✅ **Laravel Socialite** - Package sudah terinstall
4. ✅ **Config** - `config/services.php` sudah dikonfigurasi
5. ✅ **UI Buttons** - Tombol "Masuk dengan Google" di halaman Login & Register
6. ✅ **Auto Create User** - User otomatis dibuat jika belum ada
7. ✅ **Default Role** - User baru dari Google otomatis role 'APP' (Applicant)

---

## 🔧 Konfigurasi Google OAuth (Sudah Ada)

File `.env` sudah memiliki konfigurasi:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback
```

⚠️ **PENTING**: Pastikan URL di Google Console sama dengan yang di `.env`

---

## 🚀 Cara Testing

### 1. Verifikasi Google Console Settings

Pastikan di [Google Cloud Console](https://console.cloud.google.com/):

1. **Authorized JavaScript origins**:
   ```
   http://localhost
   ```

2. **Authorized redirect URIs**:
   ```
   http://localhost/auth/google/callback
   ```

### 2. Testing Flow

#### A. Testing Login dengan Google

1. Buka halaman **Login**: `http://localhost/login`
2. Klik tombol **"Masuk dengan Google"**
3. Pilih akun Google Anda
4. Sistem akan:
   - Cek apakah email sudah terdaftar
   - Jika **sudah**: Login langsung
   - Jika **belum**: Buat user baru otomatis dengan:
     - Name dari Google
     - Email dari Google
     - Password random (tidak digunakan)
     - Role: APP (Applicant)
     - Email verified: ✅ Auto verified
5. Redirect ke `/beranda`

#### B. Testing Register dengan Google

1. Buka halaman **Register**: `http://localhost/register`
2. Klik tombol **"Daftar dengan Google"**
3. Flow sama seperti login (auto create jika belum ada)

### 3. Verifikasi User di Database

Setelah login dengan Google, cek database:

```sql
SELECT id, name, email, role, email_verified_at, created_at 
FROM users 
WHERE email = 'your-google-email@gmail.com';
```

Harusnya ada user baru dengan:
- ✅ `name` dari Google account
- ✅ `email` dari Google
- ✅ `role` = 'APP'
- ✅ `email_verified_at` tidak null (otomatis verified)

---

## 🎨 UI yang Ditambahkan

### Halaman Login (`/login`)
```
┌─────────────────────────────────────┐
│  [Email Input]                      │
│  [Password Input]                   │
│  [x] Ingat saya                     │
│  [MASUK Button]                     │
│                                     │
│  ─── Atau lanjutkan dengan ───     │
│                                     │
│  [🔵 Masuk dengan Google]          │
│                                     │
│  Belum punya akun? Daftar sekarang │
└─────────────────────────────────────┘
```

### Halaman Register (`/register`)
```
┌─────────────────────────────────────┐
│  [Nama Lengkap]                     │
│  [Email Input]                      │
│  [Password Input]                   │
│  [Konfirmasi Password]              │
│  [BUAT AKUN Button]                 │
│                                     │
│  ─── Atau lanjutkan dengan ───     │
│                                     │
│  [🔵 Daftar dengan Google]         │
│                                     │
│  Sudah punya akun? Masuk di sini   │
└─────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"

**Penyebab**: URL di Google Console tidak sesuai dengan `.env`

**Solusi**:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda
3. Credentials → OAuth 2.0 Client IDs
4. Edit client dan pastikan **Authorized redirect URIs** berisi:
   ```
   http://localhost/auth/google/callback
   ```

### Error: "Gagal login dengan Google"

**Penyebab**: Exception di controller (misal database error)

**Solusi**:
```bash
# Cek log error
tail -f storage/logs/laravel.log
```

### User tidak dibuat otomatis

**Penyebab**: Database migration belum jalan atau error

**Solusi**:
```bash
php artisan migrate:fresh --seed
```

### Email sudah terdaftar tapi tidak bisa login

**Penyebab**: Email sudah ada di database dengan cara register manual

**Solusi**: Ini normal! Google OAuth akan login ke akun yang sudah ada.

---

## 📋 Alur Kerja Google OAuth

```
User Klik "Masuk dengan Google"
         ↓
Route: /auth/google (GoogleAuthController@redirectToGoogle)
         ↓
Redirect ke Google Login Page
         ↓
User pilih akun & authorize
         ↓
Google redirect ke: /auth/google/callback
         ↓
Route: /auth/google/callback (GoogleAuthController@handleGoogleCallback)
         ↓
Ambil data user dari Google (name, email)
         ↓
Cek email di database
         ↓
    ┌───────┴──────┐
    │              │
  Sudah ada     Belum ada
    │              │
    ↓              ↓
  Login       Buat user baru
    │          - name dari Google
    │          - email dari Google
    │          - password random
    │          - role: APP
    │          - email_verified_at: now()
    │              │
    └──────┬───────┘
           ↓
    Auth::login($user)
           ↓
    Redirect ke /beranda
```

---

## 🔐 Keamanan

### Password untuk Google Users
- User yang login via Google memiliki password **random** yang di-hash
- Password ini **tidak bisa digunakan** untuk login manual
- User hanya bisa login via Google

### Jika User Ingin Login Manual Juga
User perlu:
1. Klik "Lupa Password" di halaman login
2. Reset password via email
3. Setelah itu bisa login dengan email & password

---

## 🎯 Testing Checklist

- [ ] Tombol Google muncul di halaman Login
- [ ] Tombol Google muncul di halaman Register
- [ ] Klik tombol redirect ke Google login page
- [ ] Pilih akun Google dan authorize
- [ ] Redirect kembali ke aplikasi
- [ ] User otomatis login
- [ ] Cek user baru di database (jika pertama kali)
- [ ] User memiliki role 'APP'
- [ ] Email otomatis verified
- [ ] User bisa akses halaman `/beranda`
- [ ] User bisa submit pengajuan peminjaman ruangan

---

## 📝 Catatan Penting

1. **Production**: Jangan lupa update `GOOGLE_REDIRECT_URI` di `.env` dan Google Console dengan domain production Anda

2. **Multiple Roles**: Jika user Google perlu role selain 'APP', admin harus update manual di database:
   ```sql
   UPDATE users SET role = 'SCO' WHERE email = 'user@example.com';
   ```

3. **Email Verification**: User dari Google otomatis verified, tidak perlu verifikasi email

4. **Security**: Client Secret di `.env` harus **RAHASIA** dan tidak boleh di-commit ke Git

---

**Status**: ✅ Fitur Google OAuth sudah siap digunakan!

**Testing**: Silakan buka `http://localhost/login` dan klik "Masuk dengan Google"
