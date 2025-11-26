import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormEventHandler, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import InputError from '@/components/input-error';

interface Gedung {
    id: number;
    name: string;
}

interface Ruang {
    id: number;
    gedung_id: number;
    code: string;
    name: string;
    is_aula: boolean;
}

interface Organisasi {
    id: number;
    code: string;
    name: string;
}

interface PeminjamanProps {
    gedungs: Gedung[];
    ruangs: Ruang[];
    organisasis: Organisasi[];
}

export default function Peminjaman({ gedungs, ruangs, organisasis }: PeminjamanProps) {
    const [selectedGedung, setSelectedGedung] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        gedung_id: '',
        ruang_id: '',
        organisasi_id: '',
        tanggal: '',
        start_time: '',
        end_time: '',
        jumlah_orang: '',
        deskripsi_acara: '',
        surat_pengajuan: null as File | null,
    });

    const filteredRuangs = selectedGedung
        ? ruangs.filter((ruang) => ruang.gedung_id.toString() === selectedGedung)
        : [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('surat_pengajuan', file);
            setFileName(file.name);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/peminjaman', {
            onSuccess: () => {
                reset();
                setFileName('');
                setSelectedGedung('');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Peminjaman Ruangan" />

            <div className="container mx-auto py-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Peminjaman Ruangan</h1>
                    <p className="text-muted-foreground">
                        Ajukan permohonan peminjaman ruangan untuk kegiatan organisasi Anda
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Peminjaman</CardTitle>
                        <CardDescription>
                            Lengkapi formulir di bawah ini untuk mengajukan peminjaman ruangan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Organisasi */}
                            <div className="space-y-2">
                                <Label htmlFor="organisasi_id">Organisasi</Label>
                                <Select
                                    value={data.organisasi_id}
                                    onValueChange={(value) => setData('organisasi_id', value)}
                                >
                                    <SelectTrigger id="organisasi_id">
                                        <SelectValue placeholder="Pilih Organisasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organisasis.map((org) => (
                                            <SelectItem key={org.id} value={org.id.toString()}>
                                                {org.name} ({org.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.organisasi_id} />
                            </div>

                            {/* Gedung dan Ruang */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gedung_id">Gedung</Label>
                                    <Select
                                        value={selectedGedung}
                                        onValueChange={(value) => {
                                            setSelectedGedung(value);
                                            setData('gedung_id', value);
                                            setData('ruang_id', '');
                                        }}
                                    >
                                        <SelectTrigger id="gedung_id">
                                            <SelectValue placeholder="Pilih Gedung" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gedungs.map((gedung) => (
                                                <SelectItem
                                                    key={gedung.id}
                                                    value={gedung.id.toString()}
                                                >
                                                    {gedung.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gedung_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ruang_id">Ruangan</Label>
                                    <Select
                                        value={data.ruang_id}
                                        onValueChange={(value) => setData('ruang_id', value)}
                                        disabled={!selectedGedung}
                                    >
                                        <SelectTrigger id="ruang_id">
                                            <SelectValue placeholder="Pilih Ruangan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredRuangs.map((ruang) => (
                                                <SelectItem
                                                    key={ruang.id}
                                                    value={ruang.id.toString()}
                                                >
                                                    {ruang.code} - {ruang.name}
                                                    {ruang.is_aula && ' (Aula)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.ruang_id} />
                                </div>
                            </div>

                            {/* Tanggal dan Waktu */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">Tanggal Peminjaman</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                />
                                <InputError message={errors.tanggal} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Waktu Mulai</Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                    />
                                    <InputError message={errors.start_time} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">Waktu Selesai</Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                    <InputError message={errors.end_time} />
                                </div>
                            </div>

                            {/* Jumlah Orang */}
                            <div className="space-y-2">
                                <Label htmlFor="jumlah_orang">Jumlah Peserta</Label>
                                <Input
                                    id="jumlah_orang"
                                    type="number"
                                    min="1"
                                    placeholder="Masukkan jumlah peserta"
                                    value={data.jumlah_orang}
                                    onChange={(e) => setData('jumlah_orang', e.target.value)}
                                />
                                <InputError message={errors.jumlah_orang} />
                            </div>

                            {/* Deskripsi Acara */}
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi_acara">Deskripsi Acara</Label>
                                <Textarea
                                    id="deskripsi_acara"
                                    placeholder="Jelaskan acara yang akan dilaksanakan..."
                                    rows={4}
                                    value={data.deskripsi_acara}
                                    onChange={(e) => setData('deskripsi_acara', e.target.value)}
                                />
                                <InputError message={errors.deskripsi_acara} />
                            </div>

                            {/* Upload Surat */}
                            <div className="space-y-2">
                                <Label htmlFor="surat_pengajuan">
                                    Surat Pengajuan (Word/PDF)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="surat_pengajuan"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document.getElementById('surat_pengajuan')?.click()
                                        }
                                        className="w-full"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {fileName ? 'Ubah File' : 'Upload Surat Pengajuan'}
                                    </Button>
                                </div>
                                {fileName && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>{fileName}</span>
                                    </div>
                                )}
                                <InputError message={errors.surat_pengajuan} />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setFileName('');
                                        setSelectedGedung('');
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Ajukan Peminjaman'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
