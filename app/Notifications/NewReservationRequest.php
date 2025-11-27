<?php

namespace App\Notifications;

use App\Models\ReservationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReservationRequest extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservationRequest;
    protected $recipientRole;

    /**
     * Create a new notification instance.
     */
    public function __construct(ReservationRequest $reservationRequest, string $recipientRole)
    {
        $this->reservationRequest = $reservationRequest;
        $this->recipientRole = $recipientRole; // 'sco' or 'wd'
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
        $request = $this->reservationRequest;
        
        $subject = $this->recipientRole === 'sco' 
            ? 'Pengajuan Peminjaman Ruangan Baru'
            : 'Pengajuan Peminjaman Aula untuk Persetujuan';

        $greeting = $this->recipientRole === 'sco'
            ? 'Ada pengajuan peminjaman ruangan baru yang perlu ditinjau.'
            : 'Ada pengajuan peminjaman Aula yang diteruskan oleh SCO dan memerlukan persetujuan Anda.';

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line($greeting)
            ->line('**Detail Pengajuan:**')
            ->line('Pemohon: ' . $request->user->name)
            ->line('Organisasi: ' . $request->organisasi->name)
            ->line('Ruangan: ' . $request->ruang->name . ' - ' . $request->ruang->gedung->name)
            ->line('Tanggal: ' . $request->tanggal->format('d F Y'))
            ->line('Waktu: ' . $request->start_time . ' - ' . $request->end_time)
            ->line('Jumlah Peserta: ' . $request->jumlah_orang . ' orang')
            ->line('Deskripsi Acara: ' . $request->deskripsi_acara)
            ->action('Lihat Detail & Tinjau', url('/dashboard'))
            ->line('Silakan login ke sistem untuk meninjau dan memproses pengajuan ini.')
            ->salutation('Terima kasih, PINJAM FT - Fakultas Teknik');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'reservation_request_id' => $this->reservationRequest->id,
            'recipient_role' => $this->recipientRole,
        ];
    }
}
