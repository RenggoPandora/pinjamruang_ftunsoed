import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Aplikasi ini menggunakan Light Theme secara default"
                    />
                    {/* Theme switcher disembunyikan - Light mode only */}
                    <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Aplikasi ini dikonfigurasi untuk menggunakan Light Theme secara permanen.
                        </p>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
