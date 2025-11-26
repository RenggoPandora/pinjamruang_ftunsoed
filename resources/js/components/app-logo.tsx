import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-md">
                <AppLogoIcon className="size-6 object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-lg font-bold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    PINJAM FT
                </span>
                <span className="truncate text-xs text-muted-foreground font-medium">
                    Fakultas Teknik
                </span>
            </div>
        </>
    );
}
