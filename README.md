# Aplikasi Peminjaman Ruangan FT UNSOED

Aplikasi web untuk mengelola peminjaman ruangan di Fakultas Teknik UNSOED dengan sistem approval bertingkat.

## Fitur Utama

### Role Pengguna
- **Applicant (APP)**: Mengajukan peminjaman ruangan
- **Sub Coordinator (SCO)**: Pemeriksa dan approval tahap pertama
- **WD2 (WD)**: Persetujuan final

### Menu Aplikant
1. **Beranda**: Tabel peminjaman dengan tabs untuk view kalender
2. **Peminjaman**: Form pengajuan dengan upload dokumen
3. **Riwayat**: Statistik dan history peminjaman

## Instalasi & Setup

### 1. Install Dependencies

```bash
# PHP Dependencies
composer install

# JavaScript Dependencies
npm install

# Install package tambahan yang diperlukan
npm install @radix-ui/react-tabs @radix-ui/react-select date-fns react-day-picker react-hook-form lucide-react

# Install Laravel Socialite untuk Google OAuth
composer require laravel/socialite
```

### 2. Environment Configuration

Salin `.env.example` ke `.env` dan konfigurasikan:

```env
APP_NAME="PinjamRuang FT UNSOED"
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pinjamruang_ftunsoed
DB_USERNAME=root
DB_PASSWORD=

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback
```

### 3. Database Setup

```bash
# Generate application key
php artisan key:generate

# Create symbolic link for storage
php artisan storage:link

# Run migrations
php artisan migrate

# Seed database dengan data awal
php artisan db:seed
```

### 4. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 5. Run Application

```bash
# Start Laravel development server
php artisan serve

# In another terminal, start Vite
npm run dev
```

## Setup Google OAuth

### 1. Buat Project di Google Cloud Console

1. Kunjungi https://console.cloud.google.com/
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google+ API

### 2. Konfigurasi OAuth Consent Screen

1. Pilih "OAuth consent screen" di menu sidebar
2. Pilih "External" dan klik "Create"
3. Isi informasi aplikasi:
   - App name: PinjamRuang FT UNSOED
   - User support email: email Anda
   - Developer contact: email Anda

### 3. Buat OAuth 2.0 Credentials

1. Pilih "Credentials" di menu sidebar
2. Klik "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Authorized redirect URIs: `http://localhost/auth/google/callback`
5. Salin Client ID dan Client Secret ke `.env`

## Database Structure

### Users
- Menyimpan data user dan role (APP, SCO, WD)

### Gedung (Buildings)
- A, B, C, D, E, F
- Gedung A-D: 2 lantai (4 ruangan)
- Gedung E: 3 lantai (6 ruangan)
- Gedung F: Hanya Aula

### Ruang (Rooms)
- 27 ruangan total
- Format kode: [Gedung][Lantai][Nomor] (contoh: A101, E301)
- Aula hanya di Gedung F

### Organisasi
- BEM, HIMASI, HIMATIF, HIMAKOM, dll.

### ReservationRequests
- Status flow: pending → approved_sco/rejected_sco → pending_wd → approved_wd/rejected_wd
- Upload surat pengajuan (PDF/Word)
- Tracking jumlah orang, waktu, deskripsi acara

## Design System

### Color Theme
- **Primary**: Navy Blue (oklch(0.3 0.08 255))
- **Background**: White (oklch(1 0 0))
- **Clean & Modern**: Tanpa gradasi, fokus pada readability

### UI Components (shadcn/ui)
- Tabs untuk switch view (Table/Calendar)
- Table untuk data display
- Calendar untuk visualisasi jadwal
- Form dengan validation
- Select dropdown untuk pilihan
- File upload untuk dokumen

## Default Users (Seeder)

```
Applicant:
Email: applicant@example.com
Password: password

Sub Coordinator:
Email: sco@example.com
Password: password

WD2:
Email: wd2@example.com
Password: password
```

## API Routes

### Authenticated Routes
- `GET /beranda` - Dashboard dengan tabel & kalender
- `GET /peminjaman` - Form peminjaman
- `POST /peminjaman` - Submit peminjaman baru
- `GET /riwayat` - History peminjaman

### Auth Routes
- `GET /auth/google` - Redirect ke Google OAuth
- `GET /auth/google/callback` - Handle Google callback

## File Storage

Surat pengajuan disimpan di:
```
storage/app/public/surat_pengajuan/
```

Access via:
```
http://localhost/storage/surat_pengajuan/[filename]
```

## Tech Stack

### Backend
- Laravel 11
- Inertia.js
- Laravel Fortify (Authentication)
- Laravel Socialite (Google OAuth)

### Frontend
- React 18 + TypeScript
- TailwindCSS
- shadcn/ui components
- Radix UI primitives
- date-fns (Date formatting)
- react-day-picker (Calendar)
- react-hook-form (Form handling)

## Development Notes

### Add New Navigation Item
Edit `resources/js/components/app-sidebar.tsx`:
```tsx
const mainNavItems: NavItem[] = [
    {
        title: 'Menu Name',
        href: '/route-path',
        icon: IconComponent,
    },
];
```

### Add New Route
Edit `routes/web.php`:
```php
Route::get('path', [Controller::class, 'method'])->name('route.name');
```

### Create New Page
Create file in `resources/js/pages/[name].tsx`:
```tsx
import AppLayout from '@/layouts/app-layout';

export default function PageName() {
    return (
        <AppLayout>
            {/* Your content */}
        </AppLayout>
    );
}
```

## License

This project is created for FT UNSOED internal use.
