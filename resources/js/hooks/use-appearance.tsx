import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    // Force light mode always - no dark mode support
    const isDark = false;

    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    // Always apply light theme
    applyTheme('light');
};

export function initializeTheme() {
    // Force light theme always
    localStorage.setItem('appearance', 'light');
    setCookie('appearance', 'light');
    applyTheme('light');

    // No need to listen for system theme changes since we're forcing light mode
    // mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        // Force light mode always, ignore user selection
        setAppearance('light');

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', 'light');

        // Store in cookie for SSR...
        setCookie('appearance', 'light');

        applyTheme('light');
    }, []);

    useEffect(() => {
        // Always force light mode
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateAppearance('light');

        return () =>
            mediaQuery()?.removeEventListener(
                'change',
                handleSystemThemeChange,
            );
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
