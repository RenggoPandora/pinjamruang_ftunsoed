<?php

namespace App\Notifications;

use App\Models\ReservationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public ReservationRequest $reservationRequest,
        public string $action, // 'approved_sco', 'approved_wd', 'rejected_sco', 'rejected_wd', 'forwarded_wd'
        public ?string $notes = null
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->getSubject();
        $greeting = "Halo {$notifiable->name},";
        $message = $this->getMessage();
        
        $mailMessage = (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($message)
            ->line('**Detail Pengajuan:**')
            ->line("Ruangan: {$this->reservationRequest->ruang->name} - {$this->reservationRequest->ruang->gedung->name}")
            ->line("Organisasi: {$this->reservationRequest->organisasi->name}")
            ->line("Tanggal: " . $this->reservationRequest->tanggal->format('d F Y'))
            ->line("Waktu: {$this->reservationRequest->start_time} - {$this->reservationRequest->end_time}")
            ->line("Acara: {$this->reservationRequest->deskripsi_acara}");

        if ($this->notes) {
            $mailMessage->line('')
                ->line("**Catatan:**")
                ->line($this->notes);
        }

        $mailMessage->line('')
            ->line('Terima kasih telah menggunakan sistem Peminjaman Ruang FT Unsoed.')
            ->action('Lihat Detail', url('/riwayat'));

        return $mailMessage;
    }

    /**
     * Get the subject based on action.
     */
    private function getSubject(): string
    {
        return match ($this->action) {
            'approved_sco' => 'Pengajuan Peminjaman Ruangan Disetujui',
            'approved_wd' => 'Pengajuan Peminjaman Ruangan Disetujui oleh WD2',
            'rejected_sco' => 'Pengajuan Peminjaman Ruangan Ditolak',
            'rejected_wd' => 'Pengajuan Peminjaman Ruangan Ditolak oleh WD2',
            'forwarded_wd' => 'Pengajuan Peminjaman Ruangan Diteruskan ke WD2',
            default => 'Status Pengajuan Peminjaman Ruangan Berubah',
        };
    }

    /**
     * Get the message based on action.
     */
    private function getMessage(): string
    {
        return match ($this->action) {
            'approved_sco' => 'Pengajuan peminjaman ruangan Anda telah **disetujui** oleh SCO. Ruangan siap digunakan sesuai jadwal yang diajukan.',
            'approved_wd' => 'Pengajuan peminjaman ruangan Anda telah **disetujui** oleh Wakil Dekan 2. Ruangan siap digunakan sesuai jadwal yang diajukan.',
            'rejected_sco' => 'Pengajuan peminjaman ruangan Anda **ditolak** oleh SCO. Silakan periksa catatan di bawah untuk informasi lebih lanjut.',
            'rejected_wd' => 'Pengajuan peminjaman ruangan Anda **ditolak** oleh Wakil Dekan 2. Silakan periksa catatan di bawah untuk informasi lebih lanjut.',
            'forwarded_wd' => 'Pengajuan peminjaman ruangan Anda telah diteruskan ke **Wakil Dekan 2** untuk persetujuan lebih lanjut. Anda akan menerima notifikasi setelah diproses.',
            default => 'Status pengajuan peminjaman ruangan Anda telah berubah.',
        };
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservationRequest->id,
            'action' => $this->action,
            'notes' => $this->notes,
        ];
    }
}
